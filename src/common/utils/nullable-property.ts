import { Property, PropertyOptions } from "@mikro-orm/core";

export function NullableProperty<T extends object>(
	options?: Omit<PropertyOptions<T>, "nullable">,
) {
	return Property({ ...options, nullable: true });
}
