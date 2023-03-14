import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@WebSocketGateway()
export class TrackGateway {
  constructor(private readonly trackService: TrackService) {}

  @SubscribeMessage('createTrack')
  create(@MessageBody() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @SubscribeMessage('findAllTrack')
  findAll() {
    return this.trackService.findAll();
  }

  @SubscribeMessage('findOneTrack')
  findOne(@MessageBody() id: number) {
    return this.trackService.findOne(id);
  }

  @SubscribeMessage('updateTrack')
  update(@MessageBody() updateTrackDto: UpdateTrackDto) {
    return this.trackService.update(updateTrackDto.id, updateTrackDto);
  }

  @SubscribeMessage('removeTrack')
  remove(@MessageBody() id: number) {
    return this.trackService.remove(id);
  }
}
