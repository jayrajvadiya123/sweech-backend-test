import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({
    description: "The content of the comment",
    minLength: 1,
    maxLength: 500,
    example: "This is a great post!",
  })
  @IsString()
  @Length(1, 500)
  content: string;
}
