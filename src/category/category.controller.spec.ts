import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    findAllWithProductsByPrice: jest.fn().mockResolvedValue([
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
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return filtered products when type is MORE and price is provided', async () => {
    const result = await controller.getCategoriesWithProducts('MORE', 5000);
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
    expect(service.findAllWithProductsByPrice).toHaveBeenCalledWith(
      'MORE',
      5000,
    );
  });

  it('should return filtered products when type is EXPENSIVE and price is provided', async () => {
    const result = await controller.getCategoriesWithProducts(
      'EXPENSIVE',
      1000,
    );
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
    expect(service.findAllWithProductsByPrice).toHaveBeenCalledWith(
      'EXPENSIVE',
      1000,
    );
  });
});
