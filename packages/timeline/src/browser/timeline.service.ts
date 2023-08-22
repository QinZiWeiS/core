import { Injectable, Autowired } from '@opensumi/di';
import { BinaryBuffer, Emitter, FileStat, OnEvent, WithEventBus, debounce } from '@opensumi/ide-core-browser';
import { EditorDocumentModelCreationEvent, EditorDocumentModelWillSaveEvent } from '@opensumi/ide-editor/lib/browser';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { IMainLayoutService } from '@opensumi/ide-main-layout';

import { ITimeLineService, TIMELINE_VIEW_ID } from '../common';

@Injectable()
export class TimeLineService extends WithEventBus {
  @Autowired(IFileServiceClient)
  private fileService: IFileServiceClient;

  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

  private onDidSaveEmitter: Emitter<string> = new Emitter();
  get onDidSaved() {
    return this.onDidSaveEmitter.event;
  }

  getTimeLineInfo = async (filePath: string) => {
    if (!filePath) {
      return [];
    }
    const localhistoryPath = filePath.replace('/tools/workspace', '/.localhistory');
    return this.fileService.readFile(localhistoryPath) as unknown as { content: BinaryBuffer };
  };

  // 文件保存
  @debounce(500)
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
        this.onDidSaveEmitter.fire('');
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
        this.onDidSaveEmitter.fire('');
      });
    });
  }
}
