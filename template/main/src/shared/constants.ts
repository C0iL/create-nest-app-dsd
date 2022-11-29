export const enum EmailType {
	CONFIRMATION,
	RECOVERY,
}

export enum Role {
	USER = 'user',
	ADMIN = 'admin',
}
export const enum LogMsg {
	FAILED_FILE_UPLOAD = 'Failed to upload a picture => ',
	FAILED_FILE_REMOVE = 'Failed to delete a picture => ',
}

export const enum ErrorMsg {
	NOT_FOUND_USER = 'not_found_user',
	NOT_FOUND_TERMS = 'not_found_terms',

	EMPTY_FILE = 'empty_file',
	EMPTY_EMAIL = 'empty_email',
	EMPTY_USERNAME = 'empty_username',
	EMPTY_PASSWORD = 'empty_password',
	EMPTY_TOKEN = 'empty_token',
	EMPTY_TERMS_TEXT = 'empty_terms_text',

	INVALID_TOKEN = 'invalid_token',
	INVALID_EMAIL = 'invalid_email',
	INVALID_IMG = 'invalid_image',
	INVALID_YEAR = 'invalid_year',
	INVALID_ID = 'invalid_id',
	INVALID_ARRAY = 'invalid_array',
	INVALID_PICTURE_PATH = 'invalid_picture_path',
	INVALID_DATE = 'invalid_date',
	INVALID_FILE_TYPE = 'invalid_file_type',
	INVALID_CHARACTER = 'invalid_character',

	CONFLICT_USER = 'conflict_user',

	MIN_VALUE_SUBCEEDED = 'min_value_subceeded',
	MAX_VALUE_EXCEEDED = 'max_value_exceeded',

	EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
	EMAIL_ALREADY_CONFIRMED = 'email_already_confirmed',
	PASSWORD_MISMATCH = 'password_mismatch',
	PASSWORD_TOO_SHORT = 'password_too_short',
	PASSWORD_TOO_LONG = 'password_too_long',
	PASSWORD_UPPERCASE = 'password_uppercase_missing',
	PASSWORD_LOWERCASE = 'password_lowercase_missing',
	PASSWORD_DIGITS = 'password_digits_missing',
	PASSWORD_SYMBOLS = 'password_symbols_missing',
	TERMS_NOT_ACCEPTED = 'terms_not_accepted',
	TOKEN_EXPIRED = 'token_expired',
	USERNAME_TOO_SHORT = 'username_too_short',
	USERNAME_HAS_SPACE = 'username_has_space',
}

export const enum ConfirmationEmail {
	SUBJECT = 'PROJECT NAME - Бүртгэл баталгаажуулах',
	HEADER = 'Дараах линк дээр дарж бүртгэлээ баталгаажуулна уу.',
	URL = '/auth/confirmation',
	URL_TEXT = 'Баталгаажуулах',
}

export const enum RecoveryEmail {
	SUBJECT = 'PROJECT NAME - Нууц үг сэргээх',
	HEADER = 'Дараах линк дээр дарж нууц үгээ солино уу.',
	FOOTER = 'Хэрвээ та нууц үгээ сэргээх хүсэлт илгээгээгүй бол уг мейлийг устгана уу.',
	URL = '/auth/reset-password',
	URL_TEXT = 'Нууц үг солих',
}
