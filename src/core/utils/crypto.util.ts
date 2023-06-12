import crypto from 'crypto';

/**
 * It takes a string and returns an hash of it
 * hashed string
 *
 * @param str - The string to hash.
 * to make the hash more secure.
 * @returns An object with two properties: salt and result.
 */
export const hashString = (str: string, algorithm = 'sha256') => {
	return crypto.createHash(algorithm).update(str).digest('hex');
};

/**
 * Get an object with hash and random salt from a password
 * @param password - The password to hash
 * @returns An object with two properties: salt and hash.
 */
export const hashPassword = (password: string, withSalt = true): CryptoHash => {
	const salt = withSalt ? crypto.randomBytes(16).toString('hex') : '';
	const hash = crypto
		.pbkdf2Sync(password, salt, 1000, 64, 'sha512')
		.toString('hex');

	return { salt, hash };
};

/**
 * Get random UUID
 * @returns A random UUID.
 */
export const uuid = () => crypto.randomUUID();

/**
 * Convert a string to MD5 hash
 * @returns A random MD5 hash.
 */
export const md5 = (value: string) =>
	crypto.createHash('md5').update(value).digest('hex');

/**
 * Encrypt a string using AES-256-CBC algorithm
 * @param value - The string to encrypt
 */
export const encrypt = (value: string) => {
	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
	let encrypted = cipher.update(value);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return `${iv.toString('hex')}:${encrypted.toString('hex')}:${key.toString(
		'hex'
	)}`;
};

/**
 * Decrypt a string using AES-256-CBC algorithm
 * @param value - The string to decrypt
 */
export const decrypt = (value: string) => {
	const [iv, encrypted, key] = value.split(':');
	const ivBuffer = Buffer.from(iv, 'hex');
	const encryptedBuffer = Buffer.from(encrypted, 'hex');
	const keyBuffer = Buffer.from(key, 'hex');
	const decipher = crypto.createDecipheriv(
		'aes-256-cbc',
		Buffer.from(keyBuffer),
		ivBuffer
	);
	let decrypted = decipher.update(encryptedBuffer);
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
};
