import { Post } from '@common/entities/post.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreatePostBodyDto, FindPostQuery } from './dtos/post.dto';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let postRepository: Repository<Post>;

  // 모의 리포지토리 정의
  const mockPostRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  afterEach(() => {
    jest.clearAllMocks(); // 모든 모킹된 함수 초기화
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return posts with sorting and limit', async () => {
      const posts: Post[] = [
        {
          id: '1',
          resultId: 'result1',
          userId: 'user1',
          description: '',
          pollItems: [],
          pollEndAt: new Date(),
          polls: [],
          createdAt: new Date(),
        },
      ];
      const query: FindPostQuery = {
        sort: 'createdAt',
        order: 'desc',
        limit: 50,
      };

      mockPostRepository.find.mockResolvedValue(posts);

      const result = await service.find(query);

      expect(postRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'desc' },
        take: 50,
      });
      expect(result).toEqual(posts);
    });

    it('should handle status "progress" and add pollEndAt condition', async () => {
      const posts: Post[] = [{ id: '1' } as Post];
      const currentDate = new Date();
      const query: FindPostQuery = {
        sort: 'createdAt',
        order: 'asc',
        status: 'progress',
      };

      mockPostRepository.find.mockResolvedValue(posts);

      const result = await service.find(query);

      expect(postRepository.find).toHaveBeenCalled();
      const findArgs = (postRepository.find as jest.Mock).mock.calls[0][0];
      expect(findArgs.order).toEqual({ createdAt: 'asc' });
      expect(findArgs.take).toEqual(100);
      expect(findArgs.where).toEqual({ pollEndAt: MoreThan(currentDate) });
      expect(result).toEqual(posts);
    });
  });

  describe('findById', () => {
    it('should return a post by id', async () => {
      const post: Post = { id: '123' } as Post;
      mockPostRepository.findOne.mockResolvedValue(post);

      const result = await service.findById('123');

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['polls'],
      });
      expect(result).toEqual(post);
    });
  });

  describe('create', () => {
    it('should create and save a new post', async () => {
      const dto: CreatePostBodyDto = {
        pollEndAt: new Date(Date.now() + 3600 * 1000),
        resultId: 'result1',
        userId: 'user1',
        description: '',
        pollItems: [],
      };
      const createdPost: Post = {
        id: 'newId',
        ...dto,
        createdAt: new Date(),
        polls: [],
      };

      mockPostRepository.create.mockReturnValue(createdPost);
      mockPostRepository.save.mockResolvedValue(createdPost);

      const result = await service.create(dto);

      expect(postRepository.create).toHaveBeenCalledWith(dto);
      expect(postRepository.save).toHaveBeenCalledWith(createdPost);
      expect(result).toEqual(createdPost);
    });
  });
});
