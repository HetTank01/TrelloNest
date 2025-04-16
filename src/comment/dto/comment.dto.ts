import { IsOptional, IsString, IsInt } from 'class-validator';

export class CommentDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  ParentId?: number;
}
