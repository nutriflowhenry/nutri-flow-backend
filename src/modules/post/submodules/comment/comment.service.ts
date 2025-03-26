import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Post } from '../../entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { PostService } from '../../post.service';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { UpdateCommentDto } from './dto/update-commnet.dto';
import { GetCommentDto } from './dto/get-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly userservice: UsersService,
    private readonly postService: PostService,
    private readonly commentRepository: CommentRepository,
  ) {}

  async create(
    postId: string,
    userId: string,
    createCommentData: CreateCommentDto,
  ) {
    const foundPost: Post = await this.postService.findOneApproved(postId);
    const foundUser: User = await this.userservice.findById(userId);
    if (!foundPost) {
      throw new NotFoundException('El post indicaco no existe');
    }
    if (!foundUser) {
      throw new NotFoundException('El usario indicaco no existe');
    }
    const newComment: Comment = await this.commentRepository.create(
      foundPost,
      foundUser,
      createCommentData,
    );

    const { author, post, ...sanitizedNewComment } = newComment;

    return {
      message: `Comentario creado exitosamente para el Post ${postId}`,
      newComment: {
        ...sanitizedNewComment,
        authorId: newComment.author.id,
        postId: newComment.post.id,
      },
    };
  }

  async findAllByPost(postId: string, paginationData: GetCommentDto) {
    const foundActivePost: Post | null =
      await this.postService.findOneApproved(postId);
    if (!foundActivePost) {
      throw new NotFoundException(
        `El post con id ${postId} no existe o no está activo`,
      );
    }

    const { page, limit } = paginationData;
    const [comments, commentCount] = await this.commentRepository.findAllByPost(
      postId,
      page,
      limit,
    );

    const totalPages: number = Math.ceil(commentCount / limit);

    return {
      message: `Comentarios obtenidos exitosamente para el post ${postId}, página actual: ${page}, elementos máximos por página: ${limit}`,
      comments,
      pagination: {
        page,
        limit,
        commentCount,
        totalPages,
      },
    };
  }

  async update(
    postId: string,
    commentId: string,
    userId: string,
    updateCommentData: UpdateCommentDto,
  ) {
    const updateDtoFields: string[] = Object.keys(updateCommentData);
    if (updateDtoFields.length === 0) {
      throw new BadRequestException(
        'No se proporcionaron datos para realizar una actualización',
      );
    }

    const foundVerifiedComment: Comment =
      await this.commentRepository.findVerified(commentId, userId);

    if (!foundVerifiedComment) {
      throw new NotFoundException(
        'Comentario no encontrado o no se tienen los permisos necesarios',
      );
    }

    const areDataEqual: boolean = updateDtoFields.every(
      (field) => foundVerifiedComment[field] === updateCommentData[field],
    );

    if (areDataEqual) {
      throw new BadRequestException(
        'No se pudieron realizar cambios en el registro, revise los valores enviados',
      );
    }

    const updatedComment: Comment = await this.commentRepository.update(
      foundVerifiedComment,
      updateCommentData,
    );

    return {
      message: `El comentario con id ${commentId} se actualizó con éxito`,
      updatedComment,
    };
  }

  async inactivate(commentId: string, userId: string) {
    const [foundComment, foundUser] = await Promise.all([
      this.commentRepository.findVerified(commentId, userId),
      this.userservice.findById(userId),
    ]);

    if (!foundComment) {
      throw new NotFoundException(
        'El comentario indicado no existe o no se tienen los permisos para borrarlo',
      );
    }
    if (!foundUser) {
      throw new NotFoundException('El usuario indicado no existe');
    }

    const updateResult = await this.commentRepository.inactive(foundComment.id);
    if (updateResult.affected === 0) {
      throw new InternalServerErrorException(
        'No se pudo realizar la inactivación del comentario',
      );
    }
    return {
      message: `El comentario con id ${foundComment.id} se inactivo con exito`,
    };
  }

  async remove(commentId: string, userId: string) {
    const foundVerifiedComment: Comment =
      await this.commentRepository.findVerified(commentId, userId);

    if (!foundVerifiedComment) {
      throw new NotFoundException(
        'Comentario no encontrado o no se tienen los permisos necesarios',
      );
    }

    await this.commentRepository.delete(commentId);

    return {
      message: `El comentario con id ${commentId} se eliminó con éxito`,
    };
  }

  async removeByAdmin(postId: string, commentId: string) {
    const foundComment: Comment = await this.commentRepository.findByIdAndPost(
      postId,
      commentId,
    );
    if (!foundComment) {
      throw new NotFoundException('El comentario indicado no existe');
    }
    await this.commentRepository.delete(foundComment.id);
    return {
      message: `El comentario con id ${foundComment.id} se borró exitosamente`,
    };
  }
}
