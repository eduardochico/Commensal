import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from './verification/verification.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    VerificationModule,
  ],
})
export class AppModule {}
