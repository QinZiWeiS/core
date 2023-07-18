import { Autowired } from '@opensumi/di';
import { Domain, localize } from '@opensumi/ide-core-browser';
import { EXPLORER_CONTAINER_ID } from '@opensumi/ide-explorer/lib/browser/explorer-contribution';
import { MainLayoutContribution, IMainLayoutService } from '@opensumi/ide-main-layout';

import { TIMELINE_VIEW_ID } from '../common';

import { TimeLine } from './timeline.view';


@Domain(MainLayoutContribution)
export class TimeLineContribution implements MainLayoutContribution {
  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

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
