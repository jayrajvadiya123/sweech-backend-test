import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt, Min } from "class-validator";

export class PaginationDto {
  @ApiProperty({
    description: "Page number to fetch",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
