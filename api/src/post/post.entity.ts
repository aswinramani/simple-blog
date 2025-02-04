import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './../user/user.entity';
import { v4 as uuid } from 'uuid';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 75, nullable: false })
  title: string;

  @Column({ length: 350, nullable: false })
  content: string;
  
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: User;

  @Column({ name: 'author_id', nullable: false })
  authorId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor() {
    this.id = uuid();
  }
}
