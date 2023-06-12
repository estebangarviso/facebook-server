import {
	CreateBucketCommandOutput,
	DeleteObjectCommandOutput,
	GetObjectCommandOutput,
	ListObjectsCommandOutput
} from '@aws-sdk/client-s3';
import { WriteStream } from 'fs';
import { ResizeOptions } from 'sharp';

export default abstract class SimpleCloudStorageInterface {
	/**
	 * Create a bucket
	 * @returns Returns a promise with the bucket creation response
	 */
	public abstract checkAndCreateBucket(): Promise<CreateBucketCommandOutput | void>;

	/**
	 * Validates if the bucket exists
	 * @returns Returns true if the bucket exists
	 * @throws if the bucket does not exists
	 */
	public abstract checkBucket(): Promise<boolean>;

	/**
	 * Stream a file to upload it on S3
	 * @param file File object from request
	 * @param options Resize options
	 * @returns Returns a promise with key of the uploaded file
	 * @throws Throws an error if the upload fails
	 */
	public abstract upload(
		file: Express.Multer.File,
		options?: ResizeOptions
	): Promise<string>;

	/**
	 * List all files from server
	 * @returns Returns a list of files
	 * @throws Throws an error if the bucket does not exist
	 */
	public abstract list(): Promise<ListObjectsCommandOutput>;

	/**
	 * Get a file from server
	 * @param fileKey File key
	 * @returns Returns a file
	 * @throws Throws an error if the file does not exist
	 */
	public abstract getOne(fileKey: string): Promise<GetObjectCommandOutput>;

	/**
	 * Get a signed URL for a file
	 * @param fileKey File key
	 * @returns Returns a signed URL
	 * @throws Throws an error if the file does not exist
	 */
	public abstract download(fileKey: string): Promise<WriteStream>;

	/**
	 * Delete a file from server
	 * @param fileKey File key
	 * @returns Returns the deleted file
	 * @throws Throws an error if the file does not exist
	 */
	public abstract delete(fileKey: string): Promise<DeleteObjectCommandOutput>;

	/**
	 * Get a signed URL for a file
	 * @param fileKey File key
	 * @returns Returns a signed URL
	 * @throws Throws an error if the file does not exist
	 */
	public abstract getSignedUrl(
		fileKey: string,
		expires?: number
	): Promise<string>;
}
