import { MetadataKey, UserRole } from "@common/enums";
import { SetMetadata } from "@nestjs/common";

export const ApplyRole = (role: UserRole) =>
	SetMetadata(MetadataKey.USER_ROLE, role);
