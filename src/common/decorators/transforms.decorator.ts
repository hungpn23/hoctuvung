import { Transform } from "class-transformer";

export function ToLowerCase(): PropertyDecorator {
	return Transform(({ value }): unknown => {
		if (value === null || value === undefined) return value;

		if (Array.isArray(value)) {
			return value.map((v): unknown =>
				typeof v === "string" ? v.toLowerCase() : v,
			);
		}

		return typeof value === "string" ? value.toLowerCase() : value;
	});
}

export function ToUpperCase(): PropertyDecorator {
	return Transform(({ value }): unknown => {
		if (value === null || value === undefined) return value;

		if (Array.isArray(value)) {
			return value.map((v): unknown =>
				typeof v === "string" ? v.toUpperCase() : v,
			);
		}

		return typeof value === "string" ? value.toUpperCase() : value;
	});
}

export function ToBoolean(): PropertyDecorator {
	return Transform(({ value }): unknown => {
		if (value === null || value === undefined) return value;
		if (typeof value === "boolean") return value;

		const stringValue = String(value).toLowerCase().trim();

		if (["true", "1", "yes"].includes(stringValue)) {
			return true;
		}

		if (["false", "0", "no"].includes(stringValue)) {
			return false;
		}

		return value;
	});
}
