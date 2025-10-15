import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VerificationModule } from './verification/verification.module';
import { RedisModule } from './redis/redis.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TWILIO_ACCOUNT_SID: Joi.string()
          .trim()
          .when('TWILIO_MOCK_MODE', {
            is: Joi.string()
              .valid('1', 'true', 'yes', 'on')
              .insensitive(),
            then: Joi.optional(),
            otherwise: Joi.required(),
          }),
        TWILIO_AUTH_TOKEN: Joi.string()
          .trim()
          .when('TWILIO_MOCK_MODE', {
            is: Joi.string()
              .valid('1', 'true', 'yes', 'on')
              .insensitive(),
            then: Joi.optional(),
            otherwise: Joi.required(),
          }),
        TWILIO_SMS_FROM: Joi.string()
          .trim()
          .when('TWILIO_MOCK_MODE', {
            is: Joi.string()
              .valid('1', 'true', 'yes', 'on')
              .insensitive(),
            then: Joi.optional(),
            otherwise: Joi.required(),
          }),
        TWILIO_MOCK_MODE: Joi.string()
          .valid('1', 'true', 'yes', 'on', '0', 'false', 'no', 'off')
          .insensitive()
          .default('false'),
        VERIFICATION_TTL: Joi.string()
          .pattern(/^[1-9]\d*$/)
          .default('600'),
        REDIS_HOST: Joi.string().default('127.0.0.1'),
        REDIS_PORT: Joi.string()
          .pattern(/^[1-9]\d*$/)
          .default('6379'),
        REDIS_PASSWORD: Joi.string().allow('', null),
      }),
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
        convert: false,
      },
    }),
    RedisModule,
    VerificationModule,
    HomeModule,
  ],
})
export class AppModule {}
