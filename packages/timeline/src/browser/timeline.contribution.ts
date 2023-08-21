import { Autowired } from '@opensumi/di';
import { Domain, FileStat, OnEvent, WithEventBus, localize } from '@opensumi/ide-core-browser';
import { EditorDocumentModelCreationEvent } from '@opensumi/ide-editor/lib/browser';
import { EditorDocumentModelWillSaveEvent } from '@opensumi/ide-editor/lib/browser/doc-model/types';
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
  // 文件保存
  @OnEvent(EditorDocumentModelWillSaveEvent)
  async handleEditorDocumentModelWillSaveEvent(event: EditorDocumentModelWillSaveEvent) {
    const filePath = event.payload.uri.codeUri.path;
    const localhistoryPath = filePath.replace('/tools/workspace', '/.localhistory');
    const saveObj = { type: 'save', time: new Date().getTime() };

    const res = await this.fileService.readFile(localhistoryPath);
    const timelineData = JSON.parse(res.content.buffer.toString());

    if (timelineData) {
      timelineData.unshift(saveObj);
    }

    this.fileService.getFileStat(localhistoryPath).then((fileStat: FileStat) => {
      this.fileService.setContent(fileStat, JSON.stringify(timelineData)).then((res) => {
        this.timeLineService.reloadTimeLine();
      });
    });
  }

  // 文件创建
  @OnEvent(EditorDocumentModelCreationEvent)
  handleEditorDocumentModelCreationEvent(event: EditorDocumentModelCreationEvent) {
    const filePath = event.payload.uri.codeUri.path;
    const localhistoryPath = filePath.replace('/tools/workspace', '/.localhistory');

    const createObj = { type: 'create', time: new Date().getTime() };

    this.fileService.createFile(localhistoryPath).then((fileStat: FileStat) => {
      this.fileService.setContent(fileStat, JSON.stringify([createObj])).then((res) => {
        this.timeLineService.reloadTimeLine();
      });
    });
  }
}
