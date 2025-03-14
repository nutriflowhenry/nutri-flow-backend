import { Injectable, OnModuleInit } from '@nestjs/common';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import * as process from 'node:process';


@Injectable()
export class SecretsManagerService implements OnModuleInit {
    private secretsManagerClient = new SecretsManagerClient({ region: process.env.AWS_REGION });
    private secrets: Record<string, string> = {};

    async onModuleInit() {
        await this.loadSecret('CloudFrontPrivateKey');
    }


    private async loadSecret(secretId: string): Promise<void> {
        try {
            const command = new GetSecretValueCommand({ SecretId: secretId });
            const response = await this.secretsManagerClient.send(command);

            if (!response.SecretString) {
                throw new Error(`Secret ${secretId} is empty`);
            }

            this.secrets[secretId] =
                Buffer.from(response.SecretString, 'base64').toString('utf-8');
            
            console.log(`Secret loaded: ${secretId}`);

        } catch (error) {
            console.error(`Failed to load secret ${secretId}:`, error);
            process.exit(1);
        }
    }


    getSecret(secretId: string): string {
        return this.secrets[secretId] || '';
    }
}