import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Password@123" })
  @IsNotEmpty()
  @IsString()
  @Length(12, 20)
  @Matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{12,20}$/, {
    message:
      "Password must contain at least one lowercase letter, one number, and one special character.",
  })
  password: string;

  @ApiProperty({ example: "john_doe" })
  @IsNotEmpty()
  @Length(1, 10)
  @Matches(/^[가-힣]{1,10}$/, {
    message: "Username must be in Korean and between 1 and 10 characters.",
  })
  username: string;
}
