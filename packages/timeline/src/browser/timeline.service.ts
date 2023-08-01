import path from 'path';

import { readFileSync } from 'fs-extra';

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

  getTimeLineInfo(filePath: string) {
    if (!filePath) {
      return [];
    }
    const localhistoryPath = filePath.replace('/tools/workspace', '/.localhistory');
    // console.log(localhistoryPath);
    const timelineData = readFileSync(localhistoryPath, 'utf-8');

    // console.log(timelineData);

    return [
      {
        type: 'create',
        time: '2023-05-10T14:48:00.000',
        file: 'file.txt',
      },
    ];
  }
}
