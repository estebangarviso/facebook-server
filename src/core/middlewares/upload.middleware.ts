import multer from 'multer';
import { ALLOWED_FILE_MIMETYPES } from '../../app/shared/constants';
import ms from 'ms';
import { BadRequestException } from '../exceptions';
import { isNumber } from 'class-validator';
type Options = {
	dest?: string;
	allowedMimeTypes?: string[];
	maxFileSize?: string | number;
	maxFiles?: number;
	checkFiles?: boolean;
	subFolder?: string;
};
type MulterOpstions = multer.Options;

/**
 * Multer uploader middleware
 * @param dest Destination folder. Default is "uploads"
 * @param allowedMimeTypes Allowed mime types. Default is all mime types
 * @param maxFileSize Maximum file size. Default is 10mb (10 * 1024 * 1024)
 * @param maxFiles Maximum number of files. Default is 30
 * @returns Express middleware
 * @example
 * ```ts
 * import { Uploader } from '@core/middlewares';
 * import { UseBefore } from '@core/decorators';
 *
 * @UseBefore(Uploader({}))
 * async upload(req: Request, res: Response) {
 * 	// ...
 * }
 * ```
 */
export const Uploader = ({
	dest = 'uploads',
	allowedMimeTypes = [
		...ALLOWED_FILE_MIMETYPES.image,
		...ALLOWED_FILE_MIMETYPES.video
	],
	maxFileSize = '10mb',
	maxFiles = 30
}: Options): ReturnType<typeof multer> => {
	const storage: MulterOpstions['storage'] = multer.memoryStorage();
	const fileFilter: MulterOpstions['fileFilter'] = (_, file, cb) => {
		if (!allowedMimeTypes.includes(file.mimetype))
			cb(new BadRequestException('File type not allowed'));
		else cb(null, true);
	};

	const limits: MulterOpstions['limits'] = {
		fileSize: isNumber(maxFileSize) ? maxFileSize : ms(maxFileSize),
		files: maxFiles
	};

	return multer({
		storage,
		fileFilter,
		limits,
		dest
	});
};
