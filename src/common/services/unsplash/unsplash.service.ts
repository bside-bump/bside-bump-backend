import { parseLanguage } from '@common/utils/parse-language.utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createApi, Language } from 'unsplash-js';
import { UnsplashImageUrls } from './unsplash-image.interface';

@Injectable()
export class UnsplashService {
  private readonly unsplashAccessKey: string;
  constructor(private readonly configService: ConfigService) {
    this.unsplashAccessKey = this.configService.get('UNSPLASH_ACCESS_KEY');
  }

  async getImages(keyword: string, page: number): Promise<UnsplashImageUrls[]> {
    // unsplash api를 통해 이미지 검색
    const language = parseLanguage(keyword);
    console.log('검색어 언어', language);
    try {
      const api = createApi({
        // See https://unsplash.com/developers
        accessKey: this.unsplashAccessKey,
      });
      const request = {
        query: keyword,
        page: page,
        perPage: 10,
        orientation: 'landscape' as const,
        lang: language as Language,
      };
      console.log('unsplash api 호출', request);
      const result = await api.search.getPhotos(request);
      console.log('unsplash 응답 데이터 길이', result.response.results?.length);
      console.log('unsplash 응답 데이터 0번째', result.response.results?.[0]);
      const urls = result.response.results?.map(
        (photo) => photo.urls as UnsplashImageUrls,
      );
      return urls;
    } catch (error) {
      console.error('unsplash api 호출 중 에러 발생', error);
      return [];
    }
  }
}
