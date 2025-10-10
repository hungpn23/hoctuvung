import { Module } from '@nestjs/common';
import { ImageJobModule } from './image-job/image-job.module';

@Module({
  imports: [ImageJobModule],
})
export class BackgroundModule {}
