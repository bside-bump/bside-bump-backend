import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 카테고리와 그에 솏한 제품들을 모두 가져오는 메서드
  async findAllWithProducts() {
    return this.categoryRepository.find({
      relations: ['products'],
      select: {
        id: true,
        name: true,
        products: {
          name: true,
          price: true,
          iconUrl: true,
        },
      },
    });
  }
}
