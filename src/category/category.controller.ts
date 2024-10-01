import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dtos/category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: '타입과 가격에ㅐ 따른 카테고리와 제품 조회' })
  @ApiQuery({
    name: 'type',
    description:
      "'MORE' 또는 'EXPENSIVE', 만약 다른 값이 들어올 경우 모든 품목이 리턴됩니다.(필터링 적용X)",
    required: false,
  })
  @ApiQuery({
    name: 'price',
    description: '구매를 망설이는 가격',
    type: Number,
    required: false,
  })
  @ApiResponse({ status: 200, description: '성공', type: [CategoryDto] })
  async getCategoriesWithProducts(
    @Query('type') type: string,
    @Query('price', ParseIntPipe) price: number,
  ): Promise<CategoryDto[]> {
    return await this.categoryService.findAllWithProductsByPrice(type, price);
  }
}
