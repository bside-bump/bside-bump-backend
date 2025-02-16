import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationTypeEnum } from '../common/consts/types.const';
import { Post } from '../common/entities/post.entity';
import { PostDto } from './dtos/post.dto';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let postRepository: Repository<Post>;

  // 모의 리포지토리 정의
  const mockPostRepository = {
    find: jest.fn(),
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

  // 전체 price 범위 테스트 (1,000원 이상 ~ 10,000,000원 미만 범위 초과 시 에러)
  it('should throw an error if overall price is out of range', async () => {
    const postDto: PostDto = {
      name: '테스트',
      price: 10000000, // 10,000,000 초과
      type: RecommendationTypeEnum.MORE,
      recommendedItems: [{ name: '추천1', price: 1000, iconUrl: 'icon-url' }],
    };

    await expect(service.savePost(postDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error if overall price is less than 1,000', async () => {
    const postDto: PostDto = {
      name: '테스트',
      price: 999, // 1,000 미만
      type: RecommendationTypeEnum.EXPENSIVE,
      recommendedItems: [{ name: '추천1', price: 1000, iconUrl: 'icon-url' }],
    };

    await expect(service.savePost(postDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  // 추천 품목의 개수 초과 테스트
  it('should throw an error if recommended items exceed limit for MORE', async () => {
    const postDto: PostDto = {
      name: '테스트',
      price: 50000,
      type: RecommendationTypeEnum.MORE,
      recommendedItems: [
        { name: '추천1', price: 1000, iconUrl: 'icon-url' },
        { name: '추천2', price: 2000, iconUrl: 'icon-url' },
        { name: '추천3', price: 3000, iconUrl: 'icon-url' },
        { name: '추천4', price: 4000, iconUrl: 'icon-url' }, // 4개, 최대 3개까지 가능
      ],
    };

    await expect(service.savePost(postDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  // 추천 품목 가격이 더 큰 경우 (MORE)
  it('should throw an error if recommended item price is greater than the main price for MORE', async () => {
    const postDto: PostDto = {
      name: '테스트',
      price: 5000,
      type: RecommendationTypeEnum.MORE,
      recommendedItems: [
        { name: '추천1', price: 6000, iconUrl: 'icon-url' }, // 가격이 더 큼
      ],
    };

    await expect(service.savePost(postDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  // 추천 품목 가격이 더 작은 경우 (EXPENSIVE)
  it('should throw an error if recommended item price is lower than the main price for EXPENSIVE', async () => {
    const postDto: PostDto = {
      name: '테스트',
      price: 5000,
      type: RecommendationTypeEnum.EXPENSIVE,
      recommendedItems: [
        { name: '추천1', price: 4000, iconUrl: 'icon-url' }, // 가격이 더 작음
      ],
    };

    await expect(service.savePost(postDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  // MORE 타입에서 추천 품목 가격이 1원부터 999,999,999원 사이일 때 정상 동작 테스트
  it('should allow recommended item price from 1 to 999,999,999 for MORE', async () => {
    const postDto: PostDto = {
      name: '테스트',
      price: 50000,
      type: RecommendationTypeEnum.MORE,
      recommendedItems: [
        { name: '추천1', price: 1, iconUrl: 'icon-url' },
        { name: '추천2', price: 49999, iconUrl: 'icon-url' },
      ],
    };

    mockPostRepository.save.mockResolvedValue(postDto);

    const post = await service.savePost(postDto);

    expect(post).toEqual(postDto);
    expect(mockPostRepository.save).toHaveBeenCalledTimes(1);
  });

  // 조건을 모두 만족하는 경우 정상 저장 테스트
  it('should save post when all conditions are met', async () => {
    const postDto: PostDto = {
      name: '테스트',
      price: 10000,
      type: RecommendationTypeEnum.MORE,
      recommendedItems: [{ name: '추천1', price: 5000, iconUrl: 'icon-url' }],
    };

    mockPostRepository.save.mockResolvedValue(postDto);

    const post = await service.savePost(postDto);

    expect(post).toEqual(postDto);
    expect(mockPostRepository.save).toHaveBeenCalledTimes(1);
  });
});
