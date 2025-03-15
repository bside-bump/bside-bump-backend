import { Comment } from '@common/entities/Comment.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;
  let commentRepository: Repository<Comment>;

  // 모의 리포지토리 정의
  const mockCommentRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository, // 모의 리포지토리 주입
        },
      ],
      controllers: [CommentController],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
