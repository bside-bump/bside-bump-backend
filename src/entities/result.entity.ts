import { RecommendationTypeEnum } from 'src/consts/types.const';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
    default: RecommendationTypeEnum.MORE_ITEMS, // 기본값은 '차라리'
  })
  recommendationType: RecommendationTypeEnum; // 차라리 혹은 아껴서

  @Column('json')
  suggestedItems: SuggestedItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

interface SuggestedItem {
  name: string;
  price: number;
  quantity: number;
  iconUrl: string;
}
