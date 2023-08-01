import { Autowired } from '@opensumi/di';
import { Domain, OnEvent, WithEventBus, localize } from '@opensumi/ide-core-browser';
import { EditorDocumentModelWillSaveEvent } from '@opensumi/ide-editor/lib/browser/doc-model/types';
import { EXPLORER_CONTAINER_ID } from '@opensumi/ide-explorer/lib/browser/explorer-contribution';
import { MainLayoutContribution, IMainLayoutService } from '@opensumi/ide-main-layout';

import { TIMELINE_VIEW_ID } from '../common';

import { TimeLine } from './timeline.view';
@Domain(MainLayoutContribution)
export class TimeLineContribution extends WithEventBus implements MainLayoutContribution {
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

  @OnEvent(EditorDocumentModelWillSaveEvent)
  handleEditorDocumentModelWillSaveEvent(event: EditorDocumentModelWillSaveEvent) {
    const filePath = event.payload.uri.codeUri.path;

    // console.log('handleEditorDocumentModelWillSaveEvent');
  }
}
