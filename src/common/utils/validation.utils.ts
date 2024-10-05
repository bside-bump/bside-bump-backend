import { BadRequestException } from '@nestjs/common';
import { RecommendationTypeEnum } from '../../common/consts/types.const';
import { RecommendedItemDto } from '../../result/dtos/recommended-result.dto';

// 전체 가격 범위 검증
export function validateOverallPrice(price: number) {
  if (price < 1000 || price > 99999999) {
    throw new BadRequestException(
      '전체 가격은 1,000원 이상, 99,999,999원 이하여야 합니다.',
    );
  }
}

// 가격 범위 검증
export function validateItemPrice(type: RecommendationTypeEnum, price: number) {
  if (type === 'MORE') {
    if (price < 1000 || price > 99999999) {
      throw new BadRequestException(
        'MORE 타입의 품목 가격은 1,000원 이상, 99,999,999원 이하여야 합니다.',
      );
    }
  } else if (type === 'EXPENSIVE') {
    if (price < 1000 || price > 999999999) {
      throw new BadRequestException(
        'EXPENSIVE 타입의 품목 가격은 1,000원 이상, 999,999,999원 이하여야 합니다.',
      );
    }
  }
}

// 추천 품목 개수 검증
export function validateRecommendedItemsLength(
  type: RecommendationTypeEnum,
  items: RecommendedItemDto[],
) {
  if (type === 'MORE' && (items.length < 1 || items.length > 3)) {
    throw new BadRequestException(
      'MORE 타입에서는 추천 품목이 최소 1개에서 최대 3개까지 올 수 있습니다.',
    );
  }

  if (type === 'EXPENSIVE' && items.length !== 1) {
    throw new BadRequestException(
      'EXPENSIVE 타입에서는 추천 품목이 정확히 1개여야 합니다.',
    );
  }
}

// 추천 품목 가격 비교 검증
export function validateRecommendedItemsPrice(
  type: RecommendationTypeEnum,
  price: number,
  items: RecommendedItemDto[],
) {
  for (const item of items) {
    if (type === 'MORE' && item.price > price) {
      throw new BadRequestException(
        'MORE 타입에서는 추천 품목의 가격이 원래 품목의 가격보다 낮아야 합니다.',
      );
    }

    if (type === 'EXPENSIVE' && item.price < price) {
      throw new BadRequestException(
        'EXPENSIVE 타입에서는 추천 품목의 가격이 원래 품목의 가격보다 높아야 합니다.',
      );
    }
  }
}
