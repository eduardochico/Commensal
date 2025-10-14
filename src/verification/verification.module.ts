import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, ApiKeyGuard],
})
export class VerificationModule {}
