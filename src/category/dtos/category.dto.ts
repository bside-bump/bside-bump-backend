import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class CategoryDto {
  @ApiProperty({ description: '카테고리 ID' })
  id: number;

  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  @ApiProperty({
    type: [ProductDto],
    description: '카테고리에 해당하는 제품 목록',
  })
  products: ProductDto[];
}
