import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { CommentLike } from './comment-like.entity';
// import { Comment } from './comment.entity';
import { Poll } from './poll.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  resultId: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  description: string;

  @Column({ type: 'json', nullable: true })
  pollItems: PollItems[];

  @Column({ type: 'timestamp', nullable: true, default: null })
  pollEndAt: Date | null;

  @Index()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Poll, (poll) => poll.post)
  polls: Poll[];

  // @OneToMany(() => Comment, (comment) => comment.post)
  // comments: Comment[];

  // @OneToMany(() => CommentLike, (commentLike) => commentLike.post)
  // commentLikes: CommentLike[];
}

export interface PollItems {
  option: string;
}

export interface PostPollOptionCounts {
  [key: string]: number;
}
