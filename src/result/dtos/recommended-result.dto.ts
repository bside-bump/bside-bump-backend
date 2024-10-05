import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RecommendedItemDto {
  @ApiProperty({ description: '추천 품목 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '추천 품목 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '추천 품목 아이콘 URL' })
  @IsString()
  iconUrl: string = 'default_image.png';
}
