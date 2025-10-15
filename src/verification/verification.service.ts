import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { Twilio } from 'twilio';
import { inspect } from 'util';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly ttlSeconds: number;
  private readonly twilioClient: Twilio | null;
  private readonly smsFrom: string | null;
  private readonly twilioMockMode: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.smsFrom = this.configService.get<string>('TWILIO_SMS_FROM', '') ?? null;
    this.ttlSeconds = Number(this.configService.get<string>('VERIFICATION_TTL', '600'));
    this.twilioMockMode = this.parseBoolean(
      this.configService.get<string>('TWILIO_MOCK_MODE', 'false'),
    );

    if (this.twilioMockMode) {
      this.twilioClient = null;
      this.logger.warn(
        'TWILIO_MOCK_MODE está activo: los SMS no se enviarán y los códigos solo se registrarán en logs.',
      );
      return;
    }

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are not configured');
    }

    if (!this.smsFrom) {
      throw new Error('TWILIO_SMS_FROM is not configured');
    }

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendVerificationCode({ email, phoneNumber }: SendCodeDto) {
    const code = this.generateCode();
    const redisKey = this.buildRedisKey(email, phoneNumber);
    const redis = this.redisService.getClient();

    await redis.set(redisKey, code, 'EX', this.ttlSeconds);

    try {
      if (this.twilioMockMode) {
        this.logger.log(
          `[MOCK] Código de verificación para ${phoneNumber} (${email}): ${code}. No se envió SMS porque TWILIO_MOCK_MODE está activo.`,
        );
      } else if (this.twilioClient) {
        await this.twilioClient.messages.create({
          from: this.smsFrom ?? undefined,
          to: phoneNumber,
          body: `Tu código de verificación es: ${code}`,
        });
      }
    } catch (error) {
      const err = error as Error & { code?: string };
      const stack = err instanceof Error ? err.stack : undefined;
      const codeInfo = err?.code ? ` (code: ${err.code})` : '';
      const status = (error as { status?: number }).status;
      const errorCode = err?.code !== undefined && err?.code !== null ? String(err.code) : undefined;

      this.logger.error(`Error enviando SMS${codeInfo}: ${err.message}`, stack);
      this.logger.error(`Detalles completos del error de Twilio:\n${inspect(error, { depth: null })}`);
      await redis.del(redisKey);
      if (status === 401 || errorCode === '20003') {
        throw new InternalServerErrorException(
          'No se pudo autenticar con Twilio. Verifica TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN.',
        );
      }
      throw new InternalServerErrorException('No se pudo enviar el SMS');
    }

    return {
      email,
      phoneNumber,
      message: 'Código de verificación enviado',
      expiresIn: this.ttlSeconds,
    };
  }

  async verifyCode({ email, phoneNumber, code }: VerifyCodeDto) {
    const redisKey = this.buildRedisKey(email, phoneNumber);
    const redis = this.redisService.getClient();
    const storedCode = await redis.get(redisKey);

    if (!storedCode) {
      throw new BadRequestException('No hay un código vigente para validar');
    }

    if (storedCode !== code) {
      throw new BadRequestException('El código proporcionado es inválido');
    }

    await redis.del(redisKey);

    return {
      email,
      phoneNumber,
      verified: true,
    };
  }

  private parseBoolean(value?: string | boolean | null) {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value !== 'string') {
      return false;
    }

    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  }

  private buildRedisKey(email: string, phoneNumber: string) {
    return `verification:${email}:${phoneNumber}`;
  }

  private generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
