import { Exclude, Transform } from 'class-transformer';

export class PublicUserDto {

   @Exclude()
   password: string;

   @Transform(({ value }) => {
      const createdAt = value instanceof Date ? value : new Date(value);

      return createdAt.toLocaleDateString('es', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
      })
   })
   createdAt: string;

   @Transform(({ value }) => {
      const updatedAt = value instanceof Date ? value : new Date(value);

      return updatedAt.toLocaleDateString('es', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
      })
   })
   updatedAt: string;
}