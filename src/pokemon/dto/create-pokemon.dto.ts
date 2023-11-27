import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @Transform(({ value }) => value.toLocaleLowerCase())
  name: string;
}
