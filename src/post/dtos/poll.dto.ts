import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class PollDto {
  @ApiProperty({ description: '투표 ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: '게시글 ID' })
  @IsUUID()
  postId: string;

  @ApiProperty({ description: '유저 ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: '투표 항목' })
  @IsString()
  option: string;

  @ApiProperty({ description: '생성 시간' })
  @IsDate()
  createdAt: Date;
}

export class CreatePostPollBodyDto {
  @ApiProperty({ description: '유저 ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: '투표 항목', example: '항목1 (참는다)' })
  @IsString()
  option: string;
}
