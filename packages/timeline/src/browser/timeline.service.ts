import { Injectable, Autowired } from '@opensumi/di';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { IMainLayoutService } from '@opensumi/ide-main-layout';

import { ITimeLineService, TIMELINE_VIEW_ID } from '../common';

@Injectable()
export class TimeLineService implements ITimeLineService {
  @Autowired(IFileServiceClient)
  private fileService: IFileServiceClient;

  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

  getTimeLineInfo = async (filePath: string) => {
    if (!filePath) {
      return [];
    }
    const localhistoryPath = filePath.replace('/tools/workspace', '/.localhistory');
    return this.fileService.readFile(localhistoryPath);
  };

  reloadTimeLine = () => {
    const handlerTimeLine = this.mainLayoutService.getTabbarHandler(TIMELINE_VIEW_ID);
    handlerTimeLine?.hide();
    handlerTimeLine?.show();
  };
}
