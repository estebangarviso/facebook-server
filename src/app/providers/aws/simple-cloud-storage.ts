import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
	ListObjectsCommand,
	GetObjectCommand,
	HeadBucketCommand,
	CreateBucketCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import SimpleCloudStorageInterface from './interfaces/simple-cloud-storage.interface';
import { Readable } from 'stream';
import { env } from '@config';
import fs from 'fs';
import { Injectable } from '@core/decorators';
import { Logger } from '@core/services';
import sharp, { ResizeOptions } from 'sharp';

@Injectable()
export class SimpleCloudStorageProvider implements SimpleCloudStorageInterface {
	private readonly client: S3Client = new S3Client({
		region: env.AWS.REGION,
		credentials: {
			accessKeyId: env.AWS.ACCESS_KEY_ID,
			secretAccessKey: env.AWS.SECRET_ACCESS_KEY
		}
	});

	private readonly bucketName: string = env.AWS.S3.BUCKET_NAME;

	constructor(private readonly _logger: Logger) {}

	public async checkAndCreateBucket() {
		if (await this.checkBucket()) {
			this._logger.debug('AWS S3 bucket already exists');

			return;
		}
		const command = new CreateBucketCommand({
			Bucket: this.bucketName
		});

		return this.client.send(command);
	}

	public async checkBucket(): Promise<boolean> {
		const command = new HeadBucketCommand({
			Bucket: this.bucketName
		});

		await this.client.send(command);
		this._logger.success('AWS S3 bucket access validated');

		return true;
	}

	public async upload(file: Express.Multer.File, options: ResizeOptions) {
		const key = this.getKeyFromFile(file);
		const buffer = await sharp(file.buffer).resize(options).toBuffer();

		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			Body: buffer,
			ContentType: file.mimetype
		});

		await this.client.send(command);

		return key;
	}

	public async list() {
		const command = new ListObjectsCommand({
			Bucket: this.bucketName
		});

		return await this.client.send(command);
	}

	async getOne(fileKey: string) {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: fileKey
		});

		return await this.client.send(command);
	}

	public async download(fileKey: string) {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: fileKey
		});
		const response = await this.client.send(command);
		const file = fs.createWriteStream(fileKey);

		return (response.Body as Readable).pipe(file);
	}

	public async delete(fileKey: string) {
		const command = new DeleteObjectCommand({
			Bucket: this.bucketName,
			Key: fileKey
		});

		return await this.client.send(command);
	}

	public async getSignedUrl(fileKey: string, expires?: number) {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: fileKey
		});

		return await getSignedUrl(this.client, command, {
			expiresIn: expires || env.AWS.S3.URL_EXPIRES_IN
		});
	}

	public getKeyFromFile(file: Express.Multer.File) {
		return file.path.replace(/\\/g, '/');
	}
}
