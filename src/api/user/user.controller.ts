import {
	ApiEndpoint,
	ApiFile,
	multerStorage,
	Payload,
	type UUID,
	validateImagePipe,
} from "@common";
import { Controller, Post, UploadedFile } from "@nestjs/common";
import { UploadAvatarDto } from "./user.dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiFile("avatar", { storage: multerStorage() })
	@ApiEndpoint({ type: UploadAvatarDto })
	@Post("upload-avatar")
	async uploadAvatar(
		@UploadedFile(validateImagePipe())
		file: Express.Multer.File,
		@Payload("userId") userId: UUID,
	) {
		return await this.userService.uploadAvatar(userId, file);
	}
}
