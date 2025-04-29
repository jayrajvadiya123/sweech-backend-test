import { IsOptional, IsString, Matches, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 10)
  @Matches(/^[가-힣]{1,10}$/, {
    message: "Username must be in Korean and between 1 and 10 characters.",
  })
  @ApiProperty({
    description:
      "The username must be in Korean and between 1 and 10 characters.",
    example: "홍길동",
    required: false,
  })
  username?: string;

  @IsOptional()
  @IsString()
  @Length(12, 20)
  @Matches(
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|;:,.<>?/~`]).{12,20}$/,
    {
      message:
        "Password must contain lowercase letters, numbers, and special characters.",
    }
  )
  @ApiProperty({
    description:
      "Password should be between 12 to 20 characters, containing lowercase letters, special characters, and numbers.",
    example: "password@1234",
    required: false,
  })
  password?: string;
}
