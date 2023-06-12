import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { InternalServerErrorException } from './../exceptions';

const validator = new Ajv();

// Add custom keywords
validator.addKeyword({
	keyword: 'isDirectory',
	validate: (schema: boolean, data: string): boolean => {
		if (!schema) return true;
		try {
			fs.accessSync(data, fs.constants.F_OK | fs.constants.R_OK);

			return true;
		} catch {
			throw new InternalServerErrorException(
				`Directory ${data} does not exist`
			);
		}
	}
});

// Add formats
addFormats(validator);

export const ajv = validator;
