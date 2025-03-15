import { Comment } from '@common/entities/Comment.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<Comment>;

  // 모의 리포지토리 정의
  const mockCommentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // 모든 모킹된 함수 초기화
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
