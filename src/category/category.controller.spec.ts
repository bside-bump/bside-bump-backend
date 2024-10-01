import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    findAllWithProducts: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: '음식',
        products: [{ name: '아이스크림', price: 1000, iconUrl: 'icon-url-1' }],
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

  it('should return all categories with their products', async () => {
    const categories = await controller.getCategoriesWithProducts();

    expect(categories).toEqual([
      {
        id: 1,
        name: '음식',
        products: [{ name: '아이스크림', price: 1000, iconUrl: 'icon-url-1' }],
      },
    ]);

    expect(service.findAllWithProducts).toHaveBeenCalledTimes(1);
  });
});
