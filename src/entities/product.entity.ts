import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number; // 물품의 고유 ID

  @Column()
  name: string; // 물품 이름

  @Column('decimal')
  price: number; // 물품 가격

  @Column()
  iconUrl: string; // 아이콘 이미지 URL

  @ManyToOne(() => Category, (category) => category.products)
  category: Category; // 물품이 속한 카테고리 (외래키 관계)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // 물품이 생성된 날짜
}
