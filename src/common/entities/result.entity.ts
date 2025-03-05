import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RecommendationTypeEnum } from '../../common/consts/types.const';

@Entity()
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column({
    enum: Object.values(RecommendationTypeEnum),
    default: RecommendationTypeEnum.MORE, // 기본값은 '차라리'
  })
  recommendationType: RecommendationTypeEnum; // 차라리 혹은 아껴서

  @Column('json')
  suggestedItems: SuggestedItem[];

  @Column({ type: 'uuid', nullable: true, default: null })
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

interface SuggestedItem {
  name: string;
  price: number;
  iconUrl: string | null;
  imageUrl: string | null;
  quantity: number;
  percentage: number;
  change: number;
}
