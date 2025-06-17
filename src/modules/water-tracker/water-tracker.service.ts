import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { WaterTrackerRepository } from './water-tracker.repository';
import { WaterTracker } from './entities/water-tracker.entity';
import { WaterTrackerAction } from './enums/WaterTrackerAction.enum';
import { UsersService } from '../users/users.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';
import { GetAllWaterTrackerDto } from './dto/get-all-water-tracker.dto';
import { DateTime } from 'luxon';

@Injectable()
export class WaterTrackerService {
  constructor(
    private readonly waterTrackerRepository: WaterTrackerRepository,
    private readonly userService: UsersService,
    private readonly usersProfileServise: UserProfilesService,
  ) {}

  async updateDailyWaterTracker(
    dataUpdate: UpdateWaterTrackerDto,
    userId: string,
  ) {
    const today: string = new Date().toISOString();
    console.log(today)
    // const cleanToday: string = today.split('T')[0];
    const userProfile: UserProfile = await this.getUserProfile(userId);
    const user: User = await this.userService.findById(userId);
    const userTimeZone:string = user.timeZone;
    let waterTracker: WaterTracker | null =
      await this.waterTrackerRepository.getWaterTrackerByDate(
        userProfile,
        today,
        userTimeZone
      );
    if (!waterTracker) {
      const initialAmount: number = 
      dataUpdate.action === WaterTrackerAction.INCREMENT 
        ? dataUpdate.amount 
        : 0;
    
    waterTracker = await this.waterTrackerRepository.createWaterTracker({
      amount: initialAmount,
      date: today,
      userProfile,
    });
    } else {
    waterTracker = await this.waterTrackerRepository.updateWaterTracker(
      dataUpdate,
      waterTracker,
    );
  }
    const updatedWaterTracker: number = waterTracker.amount;
    return {
      message: 'Registro de consumo de agua actualizado con exito',
      updatedWaterTracker,
    };
  }

  async getDailyWaterTracker(
  userId: string,
  date: string, // YYYY-MM-DD
  timeZone: string = 'America/Mexico_City'
) {
  const userProfile = await this.getUserProfile(userId);
  const user: User = await this.userService.findById(userId);
  const userTimeZone: string = user.timeZone;
  
  // Limpia la fecha por si acaso
  const cleanDate = date.split('T')[0];
  
  return this.waterTrackerRepository.getWaterTrackerByDate(
    userProfile,
    cleanDate,
    userTimeZone
  );
}

  async getAll(userId: string, getData: GetAllWaterTrackerDto) {
    const skip: number = (getData.page - 1) * getData.limit;
    const validateUserProfile: UserProfile = await this.getUserProfile(userId);
    const [waterTrackers, waterTrackerCount] =
      await this.waterTrackerRepository.getAll(
        validateUserProfile,
        getData.limit,
        skip,
      );
    return {
      message: `Registros de consumo de agua obtenidos con exito para el usuario id ${userId}`,
      data: {
        results: waterTrackers,
        total: waterTrackerCount,
        page: getData.page,
        limit: getData.limit,
        totalPages: Math.ceil(waterTrackerCount / getData.limit),
      },
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user: User | null = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (!user.userProfile) {
      throw new NotFoundException('El usuario no tiene perfil asociado');
    }
    const userProfile: UserProfile = await this.usersProfileServise.findOneById(
      user.userProfile.id,
    );
    if (!userProfile) {
      throw new NotFoundException('Perfil no encontrado');
    } else {
      return userProfile;
    }
  }

  getStartAndEndOfDay(
    date?: string,
    timeZone: string | null = 'America/Argentina/Buenos_Aires',
  ) {
    const userDate = date
      ? DateTime.fromJSDate(new Date(date)).setZone(timeZone)
      : DateTime.now().setZone(timeZone);

    const startOfDay = userDate.startOf('day');
    const endOfDay = userDate.endOf('day');

    const startUTC = startOfDay.toUTC().toJSDate();
    const endUTC = endOfDay.toUTC().toJSDate();

    return {
      startUTC,
      endUTC,
    };
  }
}