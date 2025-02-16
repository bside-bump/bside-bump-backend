import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductBodyDto {
  @ApiProperty({ description: '카테고리 ID' })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ description: '제품 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '제품 가격', example: 1000 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '제품 아이콘 URL' })
  @IsString()
  iconUrl: string;
}
