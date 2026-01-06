import { IMAGEKIT_CLIENT } from "@common/constants/provider-token";
import { imagekitConfig, ImageKitConfig } from "@config/imagekit.config";
import ImageKit from "@imagekit/nodejs";
import { Module } from "@nestjs/common";

@Module({
	providers: [
		{
			provide: IMAGEKIT_CLIENT,
			inject: [imagekitConfig.KEY],
			useFactory: (imagekitConfig: ImageKitConfig) =>
				new ImageKit(imagekitConfig),
		},
	],
	exports: [IMAGEKIT_CLIENT],
})
export class ImageKitModule {}
