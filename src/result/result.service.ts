import { Result } from '@common/entities/result.entity';
import { sendingMsgToDiscord } from '@common/utils/discord-sending.utils';
import {
  validateItemPrice,
  validateOverallPrice,
  validateRecommendedItemsLength,
  validateRecommendedItemsPrice,
} from '@common/utils/validation.utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ResultDto } from './dtos/result.dto';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    private readonly configService: ConfigService,
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
    if (process.env.NODE_ENV === 'production') {
      try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // 총 결과 갯수와 오늘 등록된 결과 개수 가져오기
        const totalResults = await this.resultRepository.count();
        const todayResults = await this.resultRepository.count({
          where: {
            createdAt: Between(startOfToday, endOfToday),
          },
        });
        // Discord로 전송할 메시지 생성
        const message = `
    **새로운 결과가 저장되었습니다!** 🎉
    - 이름: ${savedResult.name}
    - 가격: ${savedResult.price.toLocaleString()}원
    - 타입: ${savedResult.recommendationType}
    - 추천 품목: ${savedResult.suggestedItems.map(
      (item) => `\n  - ${item.name} (가격: ${item.price.toLocaleString()}원)`,
    )}

    📊 현재까지 총 ${totalResults}개의 결과가 등록되었습니다.
    🗓️ 오늘은 총 ${todayResults}개의 결과가 등록되었습니다.
    `;

        // Discord 메시지 전송
        const hookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL');
        await sendingMsgToDiscord(hookUrl, message);
      } catch (error) {
        console.log('discord 전송 실패 : ', error);
      }
    }

    return savedResult;
  }
}
