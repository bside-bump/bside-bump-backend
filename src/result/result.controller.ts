import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResultService } from './result.service';
import { ResultDto } from './dtos/result.dto';
import { Result } from '../common/entities/result.entity';

@ApiTags('Result')
@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get(':id')
  @ApiOperation({ summary: 'ID로 결과 조회' })
  @ApiResponse({
    status: 200,
    description: '결과가 성공적으로 조회되었습니다.',
    type: Result,
  })
  @ApiResponse({ status: 404, description: '결과를 찾을 수 없습니다.' })
  async getResultById(@Param('id') id: string) {
    const result = await this.resultService.findById(id);
    return result;
  }

  @Post()
  @ApiOperation({ summary: '결과 저장' })
  @ApiResponse({
    status: 201,
    description: '결과가 성공적으로 저장되었습니다.',
  })
  async saveResult(@Body() resultDto: ResultDto) {
    // service를 통해서 결과 저장
    console.log('받는 데이터 확인 : ', JSON.stringify(resultDto));
    const savedResult = await this.resultService.saveResult(resultDto);
    return savedResult;
  }
}
