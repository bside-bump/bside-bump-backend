import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, Product } from 'src/common/entities';
import { Repository } from 'typeorm';
import { CreateProductBodyDto } from './dtos/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(body: CreateProductBodyDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: body.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    console.log('category : ', category);

    const product = this.productRepository.create({
      name: body.name,
      price: body.price,
      iconUrl: body.iconUrl,
      category,
    });

    return await this.productRepository.save(product);
  }
}
