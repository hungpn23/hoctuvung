import { Module } from '@nestjs/common';
import { ImageJobModule } from './image-job/image-job.module';
import { StudyJobModule } from './study-job/study-job.module';

@Module({
  imports: [ImageJobModule, StudyJobModule],
})
export class BackgroundModule {}
