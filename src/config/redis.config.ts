import {
	PortValidator,
	StringValidator,
} from "@common/decorators/validators.decorator";
import { type ConfigType, registerAs } from "@nestjs/config";
import { validateConfig } from "./validate-config";

class RedisEnvVariables {
	@StringValidator()
	REDIS_HOST!: string;

	@PortValidator()
	REDIS_PORT!: number;

	@StringValidator()
	REDIS_USERNAME!: string;

	@StringValidator()
	REDIS_PASSWORD!: string;
}

export const redisConfig = registerAs("redis", () => {
	const config = validateConfig(RedisEnvVariables);

	return {
		host: config.REDIS_HOST,
		port: config.REDIS_PORT,
		username: config.REDIS_USERNAME,
		password: config.REDIS_PASSWORD,
	};
});

export type RedisConfig = ConfigType<typeof redisConfig>;
