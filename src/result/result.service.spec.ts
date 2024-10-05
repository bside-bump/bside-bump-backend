import { Test, TestingModule } from '@nestjs/testing';
import { ResultService } from './result.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Result } from '../common/entities/result.entity';
import { Repository } from 'typeorm';

describe('ResultService', () => {
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
          useValue: mockResultRepository,
        },
      ],
    }).compile();

    service = module.get<ResultService>(ResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
