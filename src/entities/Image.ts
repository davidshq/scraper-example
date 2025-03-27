import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { App } from './App';

export enum ImageType {
  ICON = 'icon',
  SCREENSHOT = 'screenshot',
  IPAD_SCREENSHOT = 'ipad_screenshot',
  WATCH_SCREENSHOT = 'watch_screenshot',
  TV_SCREENSHOT = 'tv_screenshot',
  MAC_SCREENSHOT = 'mac_screenshot',
}

export enum DownloadStatus {
  PENDING = 'pending',
  DOWNLOADING = 'downloading',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  app_id!: number;

  @Column({ type: 'varchar' })
  original_url!: string;

  @Column({ nullable: true, type: 'integer' })
  width?: number;

  @Column({ nullable: true, type: 'integer' })
  height?: number;

  @Column({
    type: 'varchar',
    enum: ImageType,
    default: ImageType.SCREENSHOT,
  })
  image_type!: ImageType;

  @Column({ type: 'varchar' })
  local_path!: string;

  @Column({ nullable: true, type: 'integer' })
  file_size?: number;

  @Column({
    type: 'varchar',
    enum: DownloadStatus,
    default: DownloadStatus.PENDING,
  })
  download_status!: DownloadStatus;

  @Column({ nullable: true, type: 'datetime' })
  download_date?: Date;

  @Column({ nullable: true, type: 'varchar' })
  error_message?: string;

  @ManyToOne(() => App, (app) => app.images)
  app!: App;

  constructor() {
    this.app_id = 0;
    this.original_url = '';
    this.local_path = '';
    this.image_type = ImageType.SCREENSHOT;
    this.download_status = DownloadStatus.PENDING;
  }
}
