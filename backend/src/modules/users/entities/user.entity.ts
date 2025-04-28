import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FavoriteCity } from '@modules/weather/models/favorite-city.entity';

/**
 * Entity representing a user in the system
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  @Exclude({ toPlainOnly: true })
  passwordHash: string;

  @OneToMany(() => FavoriteCity, (favoriteCity) => favoriteCity.user)
  favoriteCities: FavoriteCity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
