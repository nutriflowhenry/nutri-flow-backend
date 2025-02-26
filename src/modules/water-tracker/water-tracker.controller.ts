import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WaterTrackerService } from './water-tracker.service';
import { CreateWaterTrackerDto } from './dto/create-water-tracker.dto';
import { UpdateWaterTrackerDto } from './dto/update-water-tracker.dto';

@Controller('water-tracker')
export class WaterTrackerController {
  constructor(private readonly waterTrackerService: WaterTrackerService) {}

  @Post()
  create(@Body() createWaterTrackerDto: CreateWaterTrackerDto) {
    return this.waterTrackerService.create(createWaterTrackerDto);
  }

  @Get()
  findAll() {
    return this.waterTrackerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waterTrackerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaterTrackerDto: UpdateWaterTrackerDto) {
    return this.waterTrackerService.update(+id, updateWaterTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waterTrackerService.remove(+id);
  }
}
