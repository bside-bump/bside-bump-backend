import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResultService } from './result.service';
import { ResultDto } from './dtos/result.dto';

@ApiTags('Result')
@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  @ApiOperation({ summary: '결과 저장' })
  @ApiResponse({
    status: 201,
    description: '결과가 성공적으로 저장되었습니다.',
  })
  async saveResult(@Body() resultDto: ResultDto) {
    // service를 통해서 결과 저장
    const savedResult = await this.resultService.saveResult(resultDto);
    return savedResult;
  }
}
