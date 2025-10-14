import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { Twilio } from 'twilio';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly ttlSeconds: number;
  private readonly twilioClient: Twilio;
  private readonly smsFrom: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.smsFrom = this.configService.get<string>('TWILIO_SMS_FROM', '');
    this.ttlSeconds = Number(this.configService.get<string>('VERIFICATION_TTL', '600'));

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
      await this.twilioClient.messages.create({
        from: this.smsFrom,
        to: phoneNumber,
        body: `Tu código de verificación es: ${code}`,
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error enviando SMS: ${err.message}`);
      await redis.del(redisKey);
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

  private buildRedisKey(email: string, phoneNumber: string) {
    return `verification:${email}:${phoneNumber}`;
  }

  private generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
