import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { FoodTrackerService } from './food-tracker.service';
import { CreateFoodTrackerDto } from './dto/create-food-tracker.dto';
import { UpdateFoodTrackerDto } from './dto/update-food-tracker.dto';
import { GetFoodTrackerDto } from './dto/get-food-tracker.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('food-tracker')
export class FoodTrackerController {
  constructor(private readonly foodTrackerService: FoodTrackerService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea un registro de comida del usuario autenticado',
    description:
      'Requiere autenticación\n' +
      '\nSe debe enviar por body el nombre de la comida, cantidad de calorias ingeridas, descripción y opcionalmente la fecha de creación y una imagen de la comida\n' +
      '\nEn caso de exito retorna un mensaje y los datos de registro de comida creado',
  })
  @ApiBody({
    type: CreateFoodTrackerDto,
    examples: {
      RegistroBásico: {
        value: {
          name: 'Carne asada',
          calories: 10,
          description: 'Carne asada al carbón acompañada de nopales',
        },
      },
      RegistroCompleto: {
        value: {
          name: 'Carne asada',
          calories: 10,
          description: 'Carne asada al carbón acompañada de nopales',
          createdAt: '2025-11-01',
          image:
            'https://mi-bucket.s3.us-east-1.amazonaws.com/imagenes/ejemplo.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Se creó con exito el registro de consumo de comida',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'El usuario no existe o no tiene un perfil de usuario asociado',
  })
  @UseGuards(AuthGuard)
  @Post('create')
  async createFoodTracker(
    @Req() req: { user: { sub: string } },
    @Body() foodTrackeData: CreateFoodTrackerDto,
  ) {
    return await this.foodTrackerService.createFoodTracker(
      foodTrackeData,
      req.user.sub,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve la cantidad de calorías consumidas por día',
    description:
      'Requiere autenticación\n' +
      '\nSe puede enviar por query param la fecha de la cual se desean obtener los registros y la zona horaria del usuario, si no se envían se toma por defecto la fecha actual\n' +
      '\nEn caso de exito retorna un mensaje y la cantidad de calorías consumidas en el día',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    default: new Date(),
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'timeZone',
    default: 'America/Mexico_City',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Se obtuvieron con exito los registros de comida para la fecha solicitada',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'El usuario no existe o no tiene un perfil de usuario asociado',
  })
  @UseGuards(AuthGuard)
  @Get('dailyCalories')
  async findDailyCalories(
    @Query() queryDate: GetFoodTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    return await this.foodTrackerService.getDailyCalories(
      req.user.sub,
      queryDate?.date,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve todos los registros de consumo de comida por día',
    description:
      'Requiere autenticación\n' +
      '\nSe puede enviar por query param la fecha de la cual se desean obtener los registros y la zona horaria del usuario, si no se envían se toma por defecto la fecha actual\n' +
      '\nLos resultados se envían paginados, si no se envían se toma por defecto la página 1 con un máximo de 10 elementos por página\n' +
      '\nEn caso de exito retorna un mensaje y los datos de los registros de comida para la fecha indicada',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    default: new Date(),
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'timeZone',
    default: 'America/Mexico_City',
    required: false,
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
      'Se obtuvieron con exito los registros de comida para la fecha solicitada',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'El usuario no existe o no tiene un perfil de usuario asociado',
  })
  @UseGuards(AuthGuard)
  @Get('daily')
  async findAllDailyFoodTracker(
    @Query() queryDate: GetFoodTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    return await this.foodTrackerService.getDailyFoodTracker(
      req.user.sub,
      queryDate,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Elimina un registro de consumo de comida',
    description:
      'Requiere autenticación\n' +
      '\nEl usuario autenticado sólo puede borrar los registros que le pertenecen\n' +
      '\nEn caso de exito retorna un mensaje indicando que registro se eliminó',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único del registro de comida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se eliminó el registro de comida de forma exitosa',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario o el registro de comida no existen',
  })
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deleteFoodTracker(
    @Param('id', ParseUUIDPipe) foodTrackerId: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.foodTrackerService.deleteFoodTracker(
      foodTrackerId,
      req.user.sub,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza un registro de comida',
    description:
      'Requiere autenticación\n' +
      '\nEl usuario autenticado sólo puede actualizar los registros que le pertenecen\n' +
      '\nLa actualización también incluye modifcar el estado del registro de comida, es decir, hacer un soft-delete\n' +
      '\nEn caso de exito retorna un mensaje y los datos del registro modificado',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único del registro de comida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Se eliminó el registro de comida de forma exitosa',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autorización inválido o inexistente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario o el registro de comida no existen',
  })
  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async updateFoodTracker(
    @Param('id', ParseUUIDPipe) foodTrackerId: string,
    @Body() updateFoodTrackerData: UpdateFoodTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.foodTrackerService.updateFoodTracker(
      foodTrackerId,
      req.user.sub,
      updateFoodTrackerData,
    );
  }

  @Put(':foodTrackerId/image')
  @UseGuards(AuthGuard)
  async updateImage(
    @Req() req: { user: { sub: string } },
    @Param('foodTrackerId') foodTrackerId: string,
    @Body('fileType') fileType: string,
  ): Promise<object> {
    await this.foodTrackerService.updateMealImage(
      foodTrackerId,
      req.user.sub,
      fileType,
    );
    return { message: 'Meal picture updated successfully' };
  }
}
