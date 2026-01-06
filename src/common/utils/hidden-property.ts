import { Property, PropertyOptions } from "@mikro-orm/core";

export function HiddenProperty<T extends object>(
	options?: Omit<PropertyOptions<T>, "hidden">,
) {
	return Property({ ...options, hidden: true });
}
