import { MetadataKey } from "@common/constants/metadata.enum";
import { UserRole } from "@common/constants/role.enum";
import { SetMetadata } from "@nestjs/common";

export const ApplyRole = (role: UserRole) =>
	SetMetadata(MetadataKey.USER_ROLE, role);
