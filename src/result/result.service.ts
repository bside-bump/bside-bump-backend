import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from 'src/common/entities/result.entity';
import { Repository } from 'typeorm';
import { ResultDto } from './dtos/result.dto';

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
