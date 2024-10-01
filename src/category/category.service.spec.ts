import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<Category>;

  const mockCategoryRepository = {
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: '음식',
        products: [{ name: '아이스크림', price: 1000, iconUrl: 'icon-url-1' }],
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return categories with their products', async () => {
    const categories = await service.findAllWithProducts();

    expect(categories).toEqual([
      {
        id: 1,
        name: '음식',
        products: [{ name: '아이스크림', price: 1000, iconUrl: 'icon-url-1' }],
      },
    ]);
  });
});
