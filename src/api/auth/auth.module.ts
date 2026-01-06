import { QueueName } from "@common/constants/queue-name.enum";
import { Session, User } from "@db/entities";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		JwtModule.register({}),
		MikroOrmModule.forFeature([User, Session]),
		BullModule.registerQueue({ name: QueueName.EMAIL }),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
