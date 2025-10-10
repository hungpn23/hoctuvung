import { User } from '@api/user/entities/user.entity';
import { JobName } from '@common/constants/job-name.enum';
import { QueueName } from '@common/constants/queue-name.enum';
import { ImageKitService } from '@imagekit/imagekit.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import fs from 'fs';
import { ImageUploadData } from './image-job.type';

@Processor(QueueName.IMAGE_UPLOAD)
export class ImageJobConsumer extends WorkerHost {
  private readonly logger = new Logger(ImageJobConsumer.name);
  private readonly forkedEm: EntityManager;
  private readonly userRepository: EntityRepository<User>;

  constructor(
    private readonly imageKitService: ImageKitService,
    private readonly em: EntityManager,
  ) {
    super();
    this.forkedEm = this.em.fork();
    this.userRepository = this.forkedEm.getRepository(User);
  }

  async process(job: Job<ImageUploadData, void, JobName>) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}...`);

    const { userId, filePath, fileName } = job.data;

    try {
      if (job.name === JobName.UPLOAD_USER_AVATAR) {
        const uploadResult = await this.imageKitService.upload({
          file: fs.createReadStream(filePath),
          fileName,
          folder: 'avatars',
        });

        this.logger.debug(`Uploaded to ImageKit, URL: ${uploadResult.url}`);

        const user = await this.userRepository.findOne(userId);
        if (!user) throw new Error(`User with ID ${userId} not found`);

        user.avatarUrl = uploadResult.url;
        await this.forkedEm.flush();
        this.logger.debug(`Updated avatar URL for user ${userId} in DB.`);

        fs.unlink(filePath, (err) => {
          if (err) throw err;

          this.logger.debug(`Deleted local file: ${filePath}`);
        });
      }
    } catch (error) {
      this.logger.error(`Failed to process avatar for user ${userId}:`, error);
      throw error;
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.debug(`Job ${job.id} is now active`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    this.logger.debug(`Job ${job.id} is ${+job.progress}% complete`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Job ${job.id} has been completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.error(
      `Job ${job.id} has failed with reason: ${job.failedReason}`,
    );
    this.logger.error(job.stacktrace);
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job) {
    this.logger.error(`Job ${job.id} has been stalled`);
  }

  @OnWorkerEvent('error')
  onError(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} has failed with error: ${error.message}`);
  }
}
