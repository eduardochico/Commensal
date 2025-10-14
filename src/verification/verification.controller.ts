import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('send')
  @UseGuards(ApiKeyGuard)
  sendCode(@Body() payload: SendCodeDto) {
    return this.verificationService.sendVerificationCode(payload);
  }

  @Post('verify')
  @UseGuards(ApiKeyGuard)
  verifyCode(@Body() payload: VerifyCodeDto) {
    return this.verificationService.verifyCode(payload);
  }
}
