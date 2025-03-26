import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Req,
  Get,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetPaymentDto } from './dto/get-payment.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea una orden de compra, \"Checkout Session\"',
    description:
      'Requiere autenticación\n' +
      '\nSe crea una orden de pago para pagar una suscripcion Premium con un cobro recurrente de 2 dólares al mes\n' +
      '\nEn caso de exito retorna un mensaje y la URL de la orden de pago, \"Checkout Session\"',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Se creó con exito una URL para acceder a la orden de pago',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El usuario ya cuenta con una suscripción activa',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario indicado no existe',
  })
  @UseGuards(AuthGuard)
  @Post()
  async createCheckoutSession(@Req() req: { user: { sub: string } }) {
    const userId: string = req.user.sub;
    return this.paymentsService.createCheckoutSession(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todos los pagos realizados por el usuario',
    description:
      'Requiere autenticación\n' +
      '\nPermite obtener todos los pagos registrados para un usuario autenticado, tanto su suscripción activa como las canceladas\n' +
      '\nLos resultados se envían paginados, si no se envían datos de paginación, se toma por defecto la página 1 con un máximo de 10 elementos por página\n' +
      '\nEn caso de exito retorna un mensaje y los datos de los pagos de acuerdo a la información de paginación',
  })
  @ApiQuery({
    type: Number,
    name: 'page',
    default: 1,
    required: false,
  })
  @ApiQuery({
    type: Number,
    name: 'limit',
    default: 10,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Se obtuvieron con exito los registros de pagos del usuario indicado para la fecha solicitada',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario no existe',
  })
  @UseGuards(AuthGuard)
  @Get()
  async getAllPaymentsByUser(
    @Req() req: { user: { sub: string } },
    @Query() getPaymentData: GetPaymentDto,
  ) {
    const userId: string = req.user.sub;
    const limit: number = getPaymentData.limit;
    const page: number = getPaymentData.page;
    return this.paymentsService.getAllPaymentsByUser(userId, limit, page);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todos los pagos de todos los usuarios',
    description:
      'Requiere autenticación\n' +
      'Sólo puede ser usado por usuarios con rol de administrador\n' +
      '\nLos resultados se envían paginados, si no se envían datos de paginación, se toma por defecto la página 1 con un máximo de 10 elementos por página\n' +
      '\nEn caso de exito retorna un mensaje y los datos de todos los pagos realizados de acuerdo a la información de paginación',
  })
  @ApiQuery({
    type: Number,
    name: 'page',
    default: 1,
    required: false,
  })
  @ApiQuery({
    type: Number,
    name: 'limit',
    default: 10,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Se obtuvieron con exito los registros de todos los pagos realizados por los usuarios',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario no existe',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  async getAllPayments(@Query() getPaymentDto: GetPaymentDto) {
    return this.paymentsService.getAllPayments(getPaymentDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancela la suscripción activa de un usuario',
    description:
      'Requiere autenticación\n' +
      '\nCancela de forma inmediata el pago recurrente de una suscripción activa\n' +
      '\nEn caso de exito retorna un mensaje indicando el exito al cancelar la suscripción',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Se canceló exitosamente la suscripción del usuario autenticado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El usuario no tiene una suscripción activa',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario no existe',
  })
  @UseGuards(AuthGuard)
  @Delete()
  async cancelSubscriptionNow(@Req() req: { user: { sub: string } }) {
    const userId: string = req.user.sub;
    return this.paymentsService.cancelSubscriptionNow(userId);
  }
}
