import { IsOptional, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsOptional()
  @IsString({ each: true })
  readonly flavors?: string[];
}
