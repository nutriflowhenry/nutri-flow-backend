import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    constructor(@InjectS3() private readonly s3: S3) {
    }

    async generateUploadUrl(
        id: string, type: 'profile' | 'meal' | 'post', fileType: string): Promise<string> {

        const filePath = `${type}-pictures/${id}.${fileType}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filePath,
            ContentType: `image/${fileType}`,
        });

        return await getSignedUrl(this.s3, command, { expiresIn: 900 });
    }

    async uploadFile(key: string, body: Buffer, contentType: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: contentType,
        });

        await this.s3.send(command);
    }
}