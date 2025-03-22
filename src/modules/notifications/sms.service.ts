import { Injectable } from '@nestjs/common';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';


@Injectable()
export class SmsService {

    private snsClient: SNSClient;

    constructor() {
        this.snsClient = new SNSClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        });
    }

    async sendSms(phoneNumber: string, message: string): Promise<void> {
        try {
            const params = {
                Message: message,
                PhoneNumber: phoneNumber,
            };

            const result = await this.snsClient.send(new PublishCommand(params));
            console.log(`SMS sent to ${phoneNumber}. Message ID: ${result.MessageId}`);

        } catch (error) {
            console.error(`Failed to send SMS:`, error);
        }
    }
}