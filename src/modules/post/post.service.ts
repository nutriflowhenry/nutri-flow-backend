import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/post/create-post.dto';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';
import { PostStatus } from './enums/post-status.enum';
import { GetPostDto } from './dto/post/get-post.dto';
import { UpdateResult } from 'typeorm';
import { S3Service } from '../aws/s3-service';
import { CloudFrontService } from '../aws/cloud-front.service';

@Injectable()
export class PostService {
    constructor(
        private readonly s3Service: S3Service,
        private readonly userService: UsersService,
        private readonly postRepository: PostRepository,
        private readonly cloudFrontService: CloudFrontService,
    ) {
    }

    async createPost(userId: string, createPostDto: CreatePostDto) {
        const user: User = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        const newPost: Post = await this.postRepository.create(user, createPostDto);
        const { author, ...sanitizedPost } = newPost;
        return {
            message: 'Post creado exitosamente con status pendiente',
            sanitizedPost: {
                ...sanitizedPost,
                author: newPost.author.id,
            },
        };
    }

    async getAllActive(getPostData: GetPostDto) {
        getPostData.status = PostStatus.APPROVED;
        return this.getBase(getPostData);
    }

    async getAll(getPostData: GetPostDto) {
        return this.getBase(getPostData);
    }

    async findOneById(id: string) {
        return this.postRepository.findOneById(id);
    }

    async findOneApproved(id: string) {
        return this.postRepository.findOneApproved(id);
    }

    async update(postId: string, userId: string, updatePostData: UpdatePostDto) {
        const updateDtoFields: string[] = Object.keys(updatePostData);
        if (updateDtoFields.length === 0) {
            throw new BadRequestException(
                'No se proporcionaron datos para realizar una actualización',
            );
        }
        const author: User = await this.userService.findById(userId);
        const existingPost: Post | null =
            await this.postRepository.findByAuthorAndId(postId, author.id);
        if (!existingPost) {
            throw new NotFoundException(
                `El post con id ${postId} no existe o no se está autorizado para modificarlo`,
            );
        }

        const areDataEqual: boolean = updateDtoFields.every(
            (field) => existingPost[field] === updatePostData[field],
        );

        if (areDataEqual) {
            throw new BadRequestException(
                'No se pudieron realizar cambios en el registro, revise los valores enviados',
            );
        }

        const updatedPost: Post = await this.postRepository.update(
            existingPost,
            updatePostData,
        );
        return {
            message: `El post con id ${updatedPost.id} se actualizó correctamente`,
            updatedPost,
        };
    }

    async approve(id: string) {
        const foundPost: Post = await this.postRepository.findOneById(id);
        if (!foundPost) {
            throw new ForbiddenException('El post indicado no existe');
        }
        if (foundPost.status === PostStatus.APPROVED) {
            throw new BadRequestException('El post ya está aprobado');
        }
        const approvedPost: Post = await this.postRepository.approve(id);
        return {
            message: `El Post con id ${id} se aprobó con exito`,
            approvedPost,
        };
    }

    async ban(postId: string) {
        const foundPost: Post | null =
            await this.postRepository.findOneNotInactive(postId);
        if (!foundPost) {
            throw new NotFoundException('El Post no existe o ya está inactivo');
        }
        const banResult: UpdateResult = await this.postRepository.ban(postId);
        if (banResult.affected === 0) {
            throw new InternalServerErrorException(
                'No se pudo inacivar el post indicado',
            );
        }
        return {
            message: `El post con id ${postId} se inactivo correctamente`,
        };
    }

    async getImageUploadUrl(postId: string, fileType: string): Promise<string> {
        return this.s3Service.generateUploadUrl(postId, 'post', fileType);
    }

    async updatePostImage(
        postId: string,
        userId: string,
        fileType: string,
    ): Promise<void> {
        const filePath = `post-pictures/${postId}.${fileType}`;
        await this.update(postId, userId, { image: filePath });
    }

    private async getBase(getPostData: GetPostDto) {
        const [posts, postCount] = await this.postRepository.findAll(getPostData);
        const totalPages: number = Math.ceil(postCount / getPostData.limit);

        const mappedPosts = await Promise.all(
            posts.map(async post => ({
                ...post,
                author: {
                    id: post.author.id,
                    name: post.author.name,
                    profilePicture: await this.cloudFrontService.generateSignedUrl(post.author.profilePicture),
                }
            })));

        return {
            message: `Se obtuvieron correctamente los Post activos (aprobados), página actual: ${getPostData.page}, número máximo de Post por página ${getPostData.limit}`,
            posts: mappedPosts,
            pagination: {
                page: getPostData.page,
                limit: getPostData.limit,
                postCount,
                totalPages,
            },
        };
    }
}
