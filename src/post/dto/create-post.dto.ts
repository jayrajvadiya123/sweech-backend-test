import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
  @ApiProperty({
    description: "Title of the post",
    example: "My First Post",
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Content of the post",
    example: "This is the content of the post.",
  })
  @IsString()
  @MaxLength(1000)
  @IsNotEmpty()
  content: string;
}
