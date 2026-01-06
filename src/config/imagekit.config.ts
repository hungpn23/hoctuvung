import { StringValidator } from "@common/decorators/validators.decorator";
import { type ConfigType, registerAs } from "@nestjs/config";
import { validateConfig } from "./validate-config";

class ImageKitEnvVariables {
	@StringValidator()
	IMAGEKIT_PRIVATE_KEY!: string;
}

export const imagekitConfig = registerAs("imagekit", () => {
	const config = validateConfig(ImageKitEnvVariables);

	return {
		privateKey: config.IMAGEKIT_PRIVATE_KEY,
	};
});

export type ImageKitConfig = ConfigType<typeof imagekitConfig>;
