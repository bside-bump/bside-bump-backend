import { UnsplashImageUrls } from '@common/services/unsplash';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class UnsplashImageUrlDto implements UnsplashImageUrls {
  @ApiProperty({ description: '이미지 전체 크기 URL' })
  @IsString()
  full: string;

  @ApiProperty({ description: '이미지 원본 크기 URL' })
  @IsString()
  raw: string;

  @ApiProperty({ description: '이미지 일반 크기 URL' })
  @IsString()
  regular: string;

  @ApiProperty({ description: '이미지 작은 크기 URL' })
  @IsString()
  small: string;

  @ApiProperty({ description: '이미지 썸네일 크기 URL' })
  @IsString()
  thumb: string;
}

export class FindCategoryImagesDto {
  @ApiProperty({ description: '이미지 URL 배열', type: [UnsplashImageUrlDto] })
  @IsArray()
  @Type(() => UnsplashImageUrlDto)
  urls: UnsplashImageUrlDto[];
}
