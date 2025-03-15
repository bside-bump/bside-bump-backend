import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateCommentLikeBodyDto {
  @ApiProperty({ description: '유저 ID' })
  @IsUUID()
  userId: string;
}

export class CommentLikeDto {
  @ApiProperty({ description: '댓글 좋아요 ID' })
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

  @ApiProperty({ description: '생성일' })
  createdAt: Date;
}
