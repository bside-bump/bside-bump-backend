import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from '../common/entities/category.entity';
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

  // 추가 테스트: price 필터링 후 빈 배열을 반환하는지 테스트
  it('should return empty array if no products match the given price for MORE', async () => {
    const result = await service.findAllWithProductsByPrice('MORE', 500);
    expect(result).toEqual([
      {
        id: 1,
        name: '음식',
        products: [],
      },
    ]);
  });

  it('should return empty array if no products match the given price for EXPENSIVE', async () => {
    const result = await service.findAllWithProductsByPrice('EXPENSIVE', 10000);
    expect(result).toEqual([
      {
        id: 1,
        name: '음식',
        products: [],
      },
    ]);
  });
});
