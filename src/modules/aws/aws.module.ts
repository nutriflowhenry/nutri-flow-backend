import { Module } from '@nestjs/common';
import { CloudFrontService } from './cloud-front.service';
import { S3Service } from './s3-service';
import { SecretsManagerService } from './secrets-manager.service';

@Module({
    controllers: [],
    providers: [S3Service, CloudFrontService, SecretsManagerService],
    exports: [S3Service, CloudFrontService, SecretsManagerService],
})
export class AwsModule {
}