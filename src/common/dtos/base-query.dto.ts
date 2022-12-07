import { IsNumber, IsOptional } from 'class-validator';

export class BaseQueryDto {
  @IsOptional()
  @IsNumber()
  public skip = 0;

  @IsOptional()
  @IsNumber()
  public limit = 100;

  @IsOptional()
  public sort: any;

  @IsOptional()
  public filter: any;
}
