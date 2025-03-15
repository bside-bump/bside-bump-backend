import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from './post.entity';

@Entity()
@Index(['userId', 'commentId', 'postId'], { unique: true })
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  postId: string;

  @Index()
  @Column()
  commentId: string;

  @Index()
  @Column()
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes)
  comment: Comment;

  @ManyToOne(() => Post, (post) => post.commentLikes)
  post: Post;
}
