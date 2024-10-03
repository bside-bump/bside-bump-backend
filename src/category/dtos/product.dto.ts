import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ description: '제품 ID' })
  id: number;

  @ApiProperty({ description: '제품 이름' })
  name: string;

  @ApiProperty({ description: '제품 가격', example: 1000 })
  price: number;

  @ApiProperty({ description: '제품 아이콘 URL' })
  iconUrl: string;
}
