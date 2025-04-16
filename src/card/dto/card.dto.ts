import { IsOptional, IsString, IsInt } from 'class-validator';

export class CardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
