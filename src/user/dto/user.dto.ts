import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UserDto {
  @IsOptional() // Required only on update
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  shared_boards?: any[];
}
