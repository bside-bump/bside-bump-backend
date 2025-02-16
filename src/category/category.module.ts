import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnsplashService } from '@service/unsplash';
import { Category } from 'src/common/entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, UnsplashService],
  controllers: [CategoryController],
})
export class CategoryModule {}
