import { Test, TestingModule } from '@nestjs/testing';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Result } from '../common/entities/result.entity';
import { Repository } from 'typeorm';

describe('ResultController', () => {
  let controller: ResultController;
  let service: ResultService;
  let resultRepository: Repository<Result>;

  // 모의 리포지토리 정의
  const mockResultRepository = {
    find: jest.fn(),
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
