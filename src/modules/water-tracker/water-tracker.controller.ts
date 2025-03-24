import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { WaterTrackerService } from './water-tracker.service';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { GetWaterTrackerDto } from './dto/get-water-tracker.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { WaterTrackerAction } from './enums/WaterTrackerAction.enum';

@Controller('water-tracker')
export class WaterTrackerController {
  constructor(private readonly waterTrackerService: WaterTrackerService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza el registro de consumo de agua',
    description:
      '\nRequiere autenticación\n' +
      '\nSi no existe un registro lo crea, de lo contrario lo actualiza\n' +
      '\nIncrementa o disminuye la cantidad de agua registrada del usuario en 50 mililitros.\n' +
      '\nSe debe enviar por body la acción a realizar, incrementar o disminuir\n' +
      '\nEn caso de exito retorna un mensaje y la cantidad de consumo de agua actualizada',
  })
  @ApiBody({
    type: UpdateWaterTrackerDto,
    examples: {
      Disminución: {
        value: {
          action: WaterTrackerAction.DECREMENT,
        },
      },
      Aumento: {
        value: {
          action: WaterTrackerAction.INCREMENT,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Se actualizó con exito el consumo de agua',
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
  @Post('update')
  async updateDailyWaterTracker(
    @Body() updateDto: UpdateWaterTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.waterTrackerService.updateDailyWaterTracker(
      updateDto,
      req.user.sub,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Devuelve el consumo de agua del usuario por día',
    description:
      'Devuelve la cantidad de agua registrada del usuario autenticado por fecha\n' +
      '\nRequiere autenticación\n' +
      '\nSe debe enviar por query param la fecha de la que se desea el registro y la zona horaria, si no se envía, se toma por defecto la fecha del día actual\n' +
      '\nEn caso de exito retorna los datos del regitro de consumo de agua de la fecha indicada o del día actual o un mensaje indicando la ausencia de registros para el día indicado',
  })
  @ApiQuery({
    type: String,
    name: 'date',
    default: new Date(),
    description: 'Fecha de la cual se desea obtener el registro',
    example: '2025-11-01',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'timeZone',
    default: 'America/Mexico_City',
    description: 'Zona horaria del usuario',
    example: 'America/Mexico_City',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Se obtuvieron con exito los registros de consumo de agua para la fecha indicada o para el día actual',
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
  async getDailyWaterTracker(
    @Query() queryData: GetWaterTrackerDto,
    @Req() req: { user: { sub: string } },
  ) {
    const day: string = queryData.date;
    return this.waterTrackerService.getDailyWaterTracker(req.user.sub, day);
  }
}
