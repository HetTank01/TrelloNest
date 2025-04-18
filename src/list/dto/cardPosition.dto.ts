import { IsInt } from 'class-validator';

export class CardPositionDto {
  @IsInt()
  id: number;

  @IsInt()
  position: number;
}
