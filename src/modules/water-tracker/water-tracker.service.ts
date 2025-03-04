import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';
import { WaterTrackerRepository } from './water-tracker.repository';
import { WaterTracker } from './entities/water-tracker.entity';
import { WaterTrackerAction } from './enums/WaterTrackerAction.enum';
import { UsersService } from '../users/users.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

@Injectable()
export class WaterTrackerService {
   constructor(
      private readonly waterTrackerRepository: WaterTrackerRepository,
      private readonly userService: UsersService,
      private readonly usersProfileServise: UserProfilesService,
   ) {
   }

   async updateDailyWaterTracker(
      dataUpdate: UpdateWaterTrackerDto,
      userId: string,
   ) {
      const today: string = new Date().toISOString();
      const userProfile: UserProfile = await this.getUserProfile(userId);
      let waterTracker: WaterTracker | null =
         await this.waterTrackerRepository.getWaterTrackerByDate(
            userProfile,
            today,
         );
      if (!waterTracker) {
         const initialAmount: number =
            dataUpdate.action === WaterTrackerAction.INCREMENT ? 1 : 0;
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

   async getDailyWaterTracker(userId: string, date: string) {
      const userProfile: UserProfile = await this.getUserProfile(userId);
      const waterTracker: WaterTracker | null =
         await this.waterTrackerRepository.getWaterTrackerByDate(
            userProfile,
            date,
         );
      if (!waterTracker) {
         return {
            message: 'No hay registros para la fecha solicitada',
         };
      }
      return {
         waterTracker,
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
}
