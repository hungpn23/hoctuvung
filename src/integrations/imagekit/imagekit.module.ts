import { IMAGEKIT_CLIENT } from "@common/constants/provider-token";
import {
	IntegrationConfig,
	integrationConfig,
} from "@config/integration.config";
import ImageKit from "@imagekit/nodejs";
import { Module } from "@nestjs/common";

@Module({
	providers: [
		{
			provide: IMAGEKIT_CLIENT,
			inject: [integrationConfig.KEY],
			useFactory: (integrationConfig: IntegrationConfig) =>
				new ImageKit({
					privateKey: integrationConfig.imagekitPrivateKey,
				}),
		},
	],
	exports: [IMAGEKIT_CLIENT],
})
export class ImageKitModule {}
