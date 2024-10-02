import { ApiProperty } from '@nestjs/swagger';
import { RecommendedItemDto } from './recommended-result.dto';
import {
  IsNumber,
  IsEnum,
  ValidateNested,
  IsString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecommendationTypeEnum } from 'src/consts/types.const';

export class ResultDto {
  @ApiProperty({ description: '사용자가 선택한 품목 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '사용자가 선택한 품목 가격' })
  @IsNumber()
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
