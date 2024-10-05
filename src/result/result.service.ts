import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from '../common/entities/result.entity';
import { Repository } from 'typeorm';
import { ResultDto } from './dtos/result.dto';
import {
  validateOverallPrice,
  validateItemPrice,
  validateRecommendedItemsLength,
  validateRecommendedItemsPrice,
} from '../common/utils/validation.utils';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
  ) {}

  // 주어진 ID로 결과 조회
  async findById(id: string): Promise<Result> {
    const result = await this.resultRepository.findOne({ where: { id } });

    if (!result) {
      throw new NotFoundException(`ID가 ${id}인 결과를 찾을 수 없습니다.`);
    }

    return result;
  }

  async saveResult(resultDto: ResultDto) {
    const { name, price, type, recommendedItems } = resultDto;

    console.log('name : ', name);
    console.log('price : ', price);
    console.log('type : ', type);
    console.log('recommendedItems : ', JSON.stringify(recommendedItems));

    // 전체 가격 검증
    validateOverallPrice(price); // 전체 가격은 항상 1,000원 이상, 99,999,999원 이하
    // 추천 품목 개수 검증
    validateRecommendedItemsLength(type, recommendedItems);
    // 각 추천 품목의 가격 검증
    recommendedItems.forEach((item) => validateItemPrice(type, item.price));
    // 추천 품목의 가격이 전체 가격과 비교하여 유효한지 검증
    validateRecommendedItemsPrice(type, price, recommendedItems);

    // 결과 데이터 저장할 객체 생성
    const resultData = {
      name,
      price,
      recommendationType: type,
      suggestedItems: [],
    };

    if (type === 'MORE') {
      for (const item of recommendedItems) {
        const quantity = Math.floor(price / item.price);
        const change = price - quantity * item.price;

        resultData.suggestedItems.push({
          name: item.name,
          price: item.price,
          iconUrl: item.iconUrl,
          quantity,
          change,
          percentage: 0,
        });
      }
    } else if (type === 'EXPENSIVE') {
      for (const item of recommendedItems) {
        const percentage = (price / item.price) * 100;

        resultData.suggestedItems.push({
          name: item.name,
          price: item.price,
          iconUrl: item.iconUrl,
          percentage: percentage.toFixed(2),
          quantity: 0,
          change: 0,
        });
      }
    }

    const savedResult = await this.resultRepository.save(resultData);
    return savedResult;
  }
}
