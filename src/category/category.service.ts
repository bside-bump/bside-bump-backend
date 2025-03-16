import { Category } from '@common/entities/category.entity';
import { UnsplashService } from '@common/services/unsplash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly unsplashService: UnsplashService,
  ) {}

  // 카테고리와 그에 솏한 제품들을 모두 가져오는 메서드
  async findAllWithProductsByPrice(type: string, price: number) {
    const categories = await this.categoryRepository.find({
      relations: ['products'],
      select: {
        id: true,
        name: true,
        products: {
          id: true,
          name: true,
          price: true,
          iconUrl: true,
        },
      },
    });
    if (price === -1) {
      // 전체 가격에 대한 조회
      return categories.map((category) => ({
        ...category,
        products: category.products,
      }));
    }
    // type 에 따라 필터링 로직 적용
    if (type === 'MORE') {
      return categories.map((category) => ({
        ...category,
        products: category.products.filter((product) => product.price < price),
      }));
    } else if (type === 'EXPENSIVE') {
      return categories.map((category) => ({
        ...category,
        products: category.products.filter((product) => product.price > price),
      }));
    }

    return categories;
  }

  async findCategoryImages(keyword: string, page: number) {
    return await this.unsplashService.getImages(keyword, page);
  }
}
