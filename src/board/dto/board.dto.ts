import { IsOptional, IsString } from 'class-validator';

export class BoardDto {
  @IsOptional()
  @IsString()
  title?: string;
}
