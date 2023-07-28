import { Injectable, Autowired } from '@opensumi/di';
import { IFileService } from '@opensumi/ide-file-service';

import { ITimeLineService } from '../common';

@Injectable()
export class TimeLineService implements ITimeLineService {
  @Autowired(IFileService)
  private fileService: IFileService;

  // async getHistory(path: string) {
  //     return this.fileService.getHistory(path);
  // }
}
