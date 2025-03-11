import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { SecretsManagerService } from './secrets-manager.service';


@Injectable()
export class CloudFrontService {
    constructor(private readonly secretsManagerService: SecretsManagerService) {
    }

    async generateSignedUrl(filePath: string): Promise<string> {
        const privateKey = this.secretsManagerService.getSecret('CloudFrontPrivateKey');
        if (!privateKey) {
            throw new Error('CloudFront private key is not loaded');
        }

        return getSignedUrl({
            url: `${process.env.CLOUDFRONT_DOMAIN}/${filePath}`,
            keyPairId: process.env.CLOUDFRONT_SIGNING_KEY_ID,
            privateKey,
            dateLessThan: new Date(Date.now() + 3600 * 1000).toISOString()
        });
    }
}