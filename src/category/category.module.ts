import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnsplashService } from '@service/unsplash';
import { Product } from 'src/common/entities';
import { Category } from 'src/common/entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  providers: [CategoryService, UnsplashService, ProductService],
  controllers: [CategoryController],
})
export class CategoryModule {}
