import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UsersModule } from '../users/users.module';
import { PostRepository } from './post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AwsModule } from '../aws/aws.module';

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([Post]), AwsModule],
    controllers: [PostController],
    providers: [PostService, PostRepository],
    exports: [PostService],
})
export class PostModule {
}
