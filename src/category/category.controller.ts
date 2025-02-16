import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnsplashService } from '@service/unsplash';
import { PriceValidationPipe } from '../common/pipes/price-validation.pipe';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category.dto';
import { FindCategoryImagesDto } from './dtos/get-category-image.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly unsplashService: UnsplashService,
  ) {}

  @Get()
  @ApiOperation({ summary: '타입과 가격에 따른 카테고리와 제품 조회' })
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
    @Query('price', PriceValidationPipe) price: number,
  ): Promise<CategoryDto[]> {
    return await this.categoryService.findAllWithProductsByPrice(type, price);
  }

  @Get('image')
  @ApiOperation({ summary: '이미지 검색' })
  @ApiQuery({
    name: 'keyword',
    description: '검색어, 예) "cat", "dog", "car", "apple", "banana", "orange"',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: '페이지 번호 (한 페이지당 10개의 이미지), 1부터 시작',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '이미지가 성공적으로 조회되었습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: FindCategoryImagesDto,
  })
  async findCategoryImages(
    @Query('keyword') keyword: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<FindCategoryImagesDto> {
    console.log('받는 쿼리 확인 : ', keyword);
    return { urls: await this.unsplashService.getImages(keyword, page) };
  }
}
