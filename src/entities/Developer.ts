import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { App } from './App';

@Entity()
export class Developer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  developer_id!: string;

  @Column({ nullable: true, type: 'varchar' })
  name?: string;

  @Column({ nullable: true, type: 'varchar' })
  website?: string;

  @Column({ nullable: true, type: 'varchar' })
  country?: string;

  @OneToMany(() => App, (app) => app.developer_entity)
  apps!: App[];

  constructor() {
    this.developer_id = '';
  }
}
