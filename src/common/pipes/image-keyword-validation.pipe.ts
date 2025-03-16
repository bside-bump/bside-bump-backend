/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ImageKeywordValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const keyword = value.toString();
    if (keyword.length < 1) {
      throw new BadRequestException('Keyword must be longer than 1 characters');
    }

    if (keyword.length > 100) {
      throw new BadRequestException(
        'Keyword must be shorter than 100 characters',
      );
    }

    return keyword;
  }
}
