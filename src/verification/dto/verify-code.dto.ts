import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class VerifyCodeDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message:
      'phoneNumber debe estar en formato E.164 (por ejemplo +521234567890)',
  })
  phoneNumber!: string;

  @IsNotEmpty()
  @Matches(/^\d{4}$/)
  code!: string;
}
