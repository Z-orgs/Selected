import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateInfoTrackDto } from './dto/update-info-track.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}
  @Put('info/:id')
  updateInfoTrack(
    @Param('id') id: string,
    @Body() updateInfoTrack: UpdateInfoTrackDto,
  ) {
    return this.trackService.updateInfoTrack(id, updateInfoTrack);
  }
}
