import { Autowired } from '@opensumi/di';
import { Domain, WithEventBus, localize } from '@opensumi/ide-core-browser';
import { EXPLORER_CONTAINER_ID } from '@opensumi/ide-explorer/lib/browser/explorer-contribution';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { MainLayoutContribution, IMainLayoutService } from '@opensumi/ide-main-layout';

import { ITimeLineService, TIMELINE_VIEW_ID } from '../common';

import { TimeLine } from './timeline.view';
@Domain(MainLayoutContribution)
export class TimeLineContribution extends WithEventBus implements MainLayoutContribution {
  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

  @Autowired(IFileServiceClient)
  private fileService: IFileServiceClient;

  @Autowired(ITimeLineService)
  private timeLineService: ITimeLineService;

  onDidRender() {
    this.mainLayoutService.collectViewComponent(
      {
        component: TimeLine,
        collapsed: false,
        id: TIMELINE_VIEW_ID,
        name: localize('timeline.title'),
      },
      EXPLORER_CONTAINER_ID,
    );
  }
}
