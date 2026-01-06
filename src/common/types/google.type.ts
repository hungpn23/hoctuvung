export type GoogleJwtPayload = {
	iss: string;
	azp: string;
	aud: string;
	sub: string;
	email: string;
	email_verified: boolean;
	at_hash: string;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	iat: number;
	exp: number;
};

export type GoogleTokenResponse = {
	access_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
	id_token: string;
};
