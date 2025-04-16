import { IsOptional, IsString, IsInt } from 'class-validator';

export class ListDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  position?: number;
}
