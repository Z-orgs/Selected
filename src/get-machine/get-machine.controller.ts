import { Controller } from '@nestjs/common';
import { GetMachineService } from './get-machine.service';

@Controller('get-machine')
export class GetMachineController {
  constructor(private readonly getMachineService: GetMachineService) {}
}
