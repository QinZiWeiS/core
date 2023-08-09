import * as fse from 'fs-extra';

import { Injectable, Autowired } from '@opensumi/di';
import { IFileServiceClient } from '@opensumi/ide-file-service';

import { ITimeLineService } from '../common';

@Injectable()
export class TimeLineService implements ITimeLineService {
  @Autowired(IFileServiceClient)
  private fileService: IFileServiceClient;

  getTimeLineInfo = async (filePath: string) => {
    if (!filePath) {
      return [];
    }
    const localhistoryPath = filePath.replace('/tools/workspace', '/.localhistory');
    return this.fileService.readFile(localhistoryPath);
  };
}
