import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import {
  EditorAutoSaveEditorContribution,
  EditorContribution,
} from '@opensumi/ide-editor/lib/browser/editor.contribution';
import { BrowserEditorContribution } from '@opensumi/ide-editor/lib/browser/types';

import { ITimeLineService } from '../common';

import { TimeLineContribution } from './timeline.contribution';
import { TimeLineService } from './timeline.servie';


@Injectable()
export class TimeLineModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ITimeLineService,
      useClass: TimeLineService,
    },
    EditorContribution,
    EditorAutoSaveEditorContribution,
    TimeLineContribution,
  ];
  contributionProvider = BrowserEditorContribution;
}
