import { ImageKeywordValidationPipe } from '@common/pipes/image-keyword-validation.pipe';
import { PriceValidationPipe } from '@common/pipes/price-validation.pipe';
import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotImplementedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category.dto';
import { CreateProductBodyDto } from './dtos/create-product.dto';
import { FindCategoryImagesDto } from './dtos/get-category-image.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    // private readonly productService: ProductService,
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
    description:
      '구매를 망설이는 가격 (1000 ~ 99999999), -1 인 경우 모든 품목이 리턴됩니다.',
    type: Number,
    required: false,
  })
  @ApiResponse({ status: 200, description: '성공', type: [CategoryDto] })
  async getCategoriesWithProducts(
    @Query('type') type: string,
    @Query('price', PriceValidationPipe) price: number = -1,
  ): Promise<CategoryDto[]> {
    return await this.categoryService.findAllWithProductsByPrice(type, price);
  }

  @Get('image')
  @ApiOperation({ summary: '이미지 검색' })
  @ApiQuery({
    name: 'keyword',
    description: '검색어, 예) "cat", "dog", "고양이", "강아지"',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: '페이지 번호 (한 페이지당 10개의 이미지), 1부터 시작',
    required: true,
  })
  @ApiOkResponse({
    description: '이미지가 성공적으로 조회되었습니다.',
    type: FindCategoryImagesDto,
  })
  async findCategoryImages(
    @Query('keyword', ImageKeywordValidationPipe) keyword: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<FindCategoryImagesDto> {
    console.log('받는 쿼리 확인 : ', keyword);
    return {
      urls: await this.categoryService.findCategoryImages(keyword, page),
    };
  }

  @Post('product')
  @ApiOperation({ summary: '카테고리 제품 생성 (사용 X)' })
  @ApiBody({ type: CreateProductBodyDto })
  @ApiNotImplementedResponse({
    description: '사용하지 않는 api입니다.',
  })
  async create(@Body() body: CreateProductBodyDto): Promise<void> {
    console.log('받는 내용 확인: ', body);
    throw new NotImplementedException('사용하지 않는 api입니다.');
  }
}
