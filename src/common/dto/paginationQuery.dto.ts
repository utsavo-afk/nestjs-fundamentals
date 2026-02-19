import { IsOptional, IsPositive } from 'class-validator';

export class PaginaionQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}
