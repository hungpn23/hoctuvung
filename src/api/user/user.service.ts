import { JobName } from "@common/constants/job-name.enum";
import { QueueName } from "@common/constants/queue-name.enum";
import type { UUID } from "@common/types/branded.type";
import type { ImageUploadData } from "@common/types/jobs.type";
import { User } from "@db/entities";
import type { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import type { Queue } from "bullmq";
import { plainToInstance } from "class-transformer";
import { UploadAvatarDto } from "./user.dto";

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: EntityRepository<User>,

		@InjectQueue(QueueName.IMAGE)
		private readonly imageQueue: Queue<ImageUploadData, void, JobName>,
	) {}

	async uploadAvatar(userId: UUID, file: Express.Multer.File) {
		await this.imageQueue.add(JobName.UPLOAD_USER_AVATAR, {
			userId,
			filePath: file.path,
			fileName: file.filename,
		});

		return plainToInstance(UploadAvatarDto, {
			status: "Avatar is being processed.",
		});
	}
}
