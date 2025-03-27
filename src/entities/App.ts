import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './Image';
import { Developer } from './Developer';

interface Review {
  id: string;
  userName: string;
  text: string;
  score: number;
  version: string;
  updated: string;
}

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  title!: string;

  @Column('text')
  description!: string;

  @Column('float', { nullable: true })
  score?: number;

  @Column({ nullable: true, type: 'varchar' })
  content_rating?: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ nullable: true, type: 'varchar' })
  icon?: string;

  @Column({ nullable: true, type: 'varchar' })
  currency?: string;

  @Column('int', { nullable: true })
  current_version_reviews?: number;

  @Column('float', { nullable: true })
  current_version_score?: number;

  @Column({ nullable: true, type: 'varchar' })
  developer?: string;

  @Column({ nullable: true, type: 'varchar' })
  developer_id?: string;

  @Column({ nullable: true, type: 'varchar' })
  developer_url?: string;

  @Column('int', { nullable: true })
  rating_count?: number;

  @Column({ type: 'boolean' })
  free!: boolean;

  @Column('simple-array', { nullable: true })
  genre_ids?: string[];

  @Column('simple-array', { nullable: true })
  genres?: string[];

  @Column('simple-json', { nullable: true })
  histogram?: Record<string, number>;

  @Column('simple-array', { nullable: true })
  languages?: string[];

  @Column('float', { nullable: true })
  price?: number;

  @Column({ nullable: true, type: 'varchar' })
  primary_genre?: string;

  @Column({ nullable: true, type: 'varchar' })
  primary_genre_id?: string;

  @Column({ nullable: true, type: 'varchar' })
  released?: string;

  @Column({ nullable: true, type: 'varchar' })
  required_os_version?: string;

  @Column('simple-json', { nullable: true })
  reviews?: Review[];

  @Column({ nullable: true, type: 'varchar' })
  size?: string;

  @Column('simple-array', { nullable: true })
  supported_models?: string[];

  @Column({ nullable: true, type: 'varchar' })
  updated?: string;

  @Column({ nullable: true, type: 'varchar' })
  version?: string;

  @CreateDateColumn()
  first_discovered!: Date;

  @UpdateDateColumn()
  last_updated!: Date;

  @Column({ nullable: true, type: 'datetime' })
  last_enriched?: Date;

  @Column({ nullable: true, type: 'datetime' })
  last_enrich_attempt?: Date;

  @Column({ type: 'boolean', default: false })
  needs_enrichment!: boolean;

  @Column('text', { nullable: true })
  enrich_errors?: string;

  @OneToMany(() => Image, (image) => image.app)
  images!: Image[];

  @ManyToOne(() => Developer, (developer) => developer.apps)
  developer_entity?: Developer;

  constructor() {
    this.title = '';
    this.description = '';
    this.url = '';
    this.free = false;
    this.first_discovered = new Date();
    this.last_updated = new Date();
    this.needs_enrichment = false;
  }
}
