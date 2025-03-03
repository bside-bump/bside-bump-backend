import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RecommendedItemDto {
  @ApiProperty({ description: '추천 품목 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '추천 품목 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '추천 품목 아이콘 URL', required: false })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({
    description: '추천 품목 직접 검색 이미지 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
