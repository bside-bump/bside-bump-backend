import { Result } from '@common/entities/result.entity';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

describe('ResultController', () => {
  let controller: ResultController;
  let service: ResultService;

  // 모의 리포지토리 정의
  const mockResultRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultService,
        {
          provide: getRepositoryToken(Result),
          useValue: mockResultRepository, // 모의 리포지토리 주입
        },
        ConfigService,
      ],
      controllers: [ResultController],
    }).compile();

    controller = module.get<ResultController>(ResultController);
    service = module.get<ResultService>(ResultService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
