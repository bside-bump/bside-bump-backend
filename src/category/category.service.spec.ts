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
        products: [
          { name: '아이스크림', price: 1000, iconUrl: 'icon-url-1' },
          { name: '탕후루', price: 3000, iconUrl: 'icon-url-2' },
        ],
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

  it('should return products with price less than the given price when type is MORE', async () => {
    const result = await service.findAllWithProductsByPrice('MORE', 5000);
    expect(result).toEqual([
      {
        id: 1,
        name: '음식',
        products: [
          { name: '아이스크림', price: 1000, iconUrl: 'icon-url-1' },
          { name: '탕후루', price: 3000, iconUrl: 'icon-url-2' },
        ],
      },
    ]);
  });

  it('should return products with price greater than the given price when type is EXPENSIVE', async () => {
    const result = await service.findAllWithProductsByPrice('EXPENSIVE', 1000);
    expect(result).toEqual([
      {
        id: 1,
        name: '음식',
        products: [{ name: '탕후루', price: 3000, iconUrl: 'icon-url-2' }],
      },
    ]);
  });
});
