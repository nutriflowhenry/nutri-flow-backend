import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WaterTrackerModule } from './modules/water-tracker/water-tracker.module';
import { FoodTrackerModule } from './modules/food-tracker/food-tracker.module';
import typeOrmConfig from './config/typeOrm.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { S3Module } from 'nestjs-s3';
import { SecretsManagerService } from './modules/aws/secrets-manager.service';
import { CloudFrontService } from './modules/aws/cloud-front.service';
import { ImagesController } from './modules/images/images.controller';
import { FoodTrackerService } from './modules/food-tracker/food-tracker.service';
import { UserProfilesModule } from './modules/user-profiles/user-profiles.module';
import { S3Service } from './modules/aws/s3-service';
import { ImagesModule } from './modules/images/images.module';
import { AwsModule } from './modules/aws/aws.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeOrmConfig],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get('typeorm'),
        }),
        JwtModule.register({
            global: true,
            signOptions: { expiresIn: '1h' },
            secret: process.env.JWT_SECRET,
        }),
        S3Module.forRootAsync({
            useFactory: () => ({
                config: {
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    },
                    region: process.env.AWS_REGION,
                }
            })
        }),
        AuthModule,
        UsersModule,
        FoodTrackerModule,
        UserProfilesModule,
        WaterTrackerModule,
        ImagesModule,
        AwsModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
}
