import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class CommentDto {
  @ApiProperty({ description: '댓글 ID' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: '게시글 ID' })
  @IsUUID()
  postId: string;

  @ApiProperty({
    description: '유저 ID (클라이언트에서 생성 후 로컬 스토리지에 저장)',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '생성 시간' })
  @IsDate()
  createdAt: Date;
}

export class CreateCommentDto extends PickType(CommentDto, [
  'userId',
  'content',
] as const) {}
