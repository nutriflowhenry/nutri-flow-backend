import { Injectable } from '@nestjs/common';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Twilio } from 'twilio';


@Injectable()
export class SmsService {

    private snsClient: SNSClient;
    private twilioClient: Twilio;

    constructor() {
        this.twilioClient = new Twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN,
        );
        // this.snsClient = new SNSClient({
        //     region: process.env.AWS_REGION,
        //     credentials: {
        //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     }
        // });
    }

    async sendSms(phoneNumber: string, message: string): Promise<void> {
        try {
            const result = this.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });

            console.log(`SMS sent successfully to ${phoneNumber}`);

        } catch (error) {
            console.error(`Failed to send SMS to ${phoneNumber}:`, error);
            throw new Error('SMS sending failed');
        }


        // try {
        //     const params = {
        //         Message: message,
        //         PhoneNumber: phoneNumber,
        //     };
        //
        //     const result = await this.snsClient.send(new PublishCommand(params));
        //     console.log(`SMS sent to ${phoneNumber}. Message ID: ${result.MessageId}`);
        //
        // } catch (error) {
        //     console.error(`Failed to send SMS:`, error);
        // }
    }
}