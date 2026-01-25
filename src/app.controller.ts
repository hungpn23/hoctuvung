import { ApiPublicEndpoint } from "@common";
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
	@ApiPublicEndpoint()
	@Get("hello")
	getHello() {
		// throw new BadRequestException('No!!!!!!!');
		return { message: "Hello World!" };
	}
}
