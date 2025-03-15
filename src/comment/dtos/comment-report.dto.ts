import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CommentReportDto {
  @ApiProperty({ description: '댓글 신고 ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: '게시글 ID' })
  @IsUUID()
  postId: string;

  @ApiProperty({ description: '댓글 ID' })
  @IsUUID()
  commentId: string;

  @ApiProperty({ description: '유저 ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: '신고 사유' })
  @IsString()
  reason: string;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;
}

export class CreateCommentReportBodyDto extends PickType(CommentReportDto, [
  'userId',
  'reason',
] as const) {}
