import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createApi } from 'unsplash-js';
import { UnsplashImageUrls } from './unsplash-image.interface';

@Injectable()
export class UnsplashService {
  constructor(private configService: ConfigService) {}

  async getImages(keyword: string, page: number): Promise<UnsplashImageUrls[]> {
    // unsplash api를 통해 이미지 검색
    const unsplashAccessKey = this.configService.get('UNSPLASH_ACCESS_KEY');
    const api = createApi({
      // See https://unsplash.com/developers
      accessKey: unsplashAccessKey,
    });
    const result = await api.search.getPhotos({
      query: keyword,
      page: page,
      perPage: 10,
      orientation: 'landscape',
    });
    console.log('unsplash 응답 데이터 길이', result.response.results.length);
    console.log('unsplash 응답 데이터 0번째', result.response.results[0]);
    const urls = result.response.results.map(
      (photo) => photo.urls as UnsplashImageUrls,
    );
    return urls;
  }
}
