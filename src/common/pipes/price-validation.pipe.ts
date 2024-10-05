/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PriceValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const price = parseInt(value, 10);

    if (isNaN(price)) {
      throw new BadRequestException('Price must be a number');
    }

    if (price < 1000 || price > 10000000) {
      throw new BadRequestException('Price must be between 1000 and 10000000');
    }

    return price;
  }
}
