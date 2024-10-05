import { ApiProperty } from '@nestjs/swagger';
import { RecommendedItemDto } from './recommended-result.dto';
import {
  IsNumber,
  IsEnum,
  ValidateNested,
  IsString,
  IsArray,
  Length,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecommendationTypeEnum } from '../../common/consts/types.const';

export class ResultDto {
  @ApiProperty({ description: '사용자가 선택한 품목 이름' })
  @IsString()
  @Length(1, 20, {
    message: '품목 이름은 1글자 이상 20글자 이하로 입력해주세요.',
  })
  name: string;

  @ApiProperty({ description: '사용자가 선택한 품목 가격' })
  @IsNumber()
  @Min(1000, { message: '가격은 최소 1,000원 이상이어야 합니다.' }) // 최소값 1,000
  @Max(10000000, { message: '가격은 최대 10,000,000원 이하이어야 합니다.' }) // 최대값 10,000,000
  price: number;

  @ApiProperty({
    description: "'MORE' 또는 'EXPENSIVE'",
    enum: RecommendationTypeEnum,
  })
  @IsEnum(RecommendationTypeEnum)
  type: RecommendationTypeEnum;

  @ApiProperty({ description: '추천 품목 목록', type: [RecommendedItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecommendedItemDto)
  recommendedItems: RecommendedItemDto[];
}
