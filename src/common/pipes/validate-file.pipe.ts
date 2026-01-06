import {
	type FileTypeValidatorOptions,
	type MaxFileSizeValidatorOptions,
	type ParseFileOptions,
	ParseFilePipeBuilder,
} from "@nestjs/common";

export type ValidateFileOptions = FileTypeValidatorOptions &
	MaxFileSizeValidatorOptions &
	Omit<ParseFileOptions, "validators">;

export type OptionalValidateFileOptions = Partial<ValidateFileOptions>;

export function validateFilePipe(options: ValidateFileOptions) {
	return new ParseFilePipeBuilder()
		.addFileTypeValidator(options)
		.addMaxSizeValidator(options)
		.build(options);
}
