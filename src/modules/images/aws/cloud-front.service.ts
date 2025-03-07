import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import * as  fs from 'fs';
import * as path from 'path';

@Injectable()
export class CloudFrontService {
    private readonly privateKey: string;

    constructor() {
        this.privateKey = fs.readFileSync(
            path.resolve(process.env.CLOUDFRONT_PRIVATE_KEY_PATH), 'utf8');
    }

    generateSignedUrl(filePath: string): string {
        return getSignedUrl({
            url: `${process.env.CLOUDFRONT_DOMAIN}/${filePath}`,
            keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
            privateKey: this.privateKey,
            dateLessThan: new Date(Date.now() + 3600 * 1000).toISOString()
        });
    }
}