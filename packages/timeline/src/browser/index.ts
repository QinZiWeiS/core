import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

import { TimeLineContribution } from './timeline.contribution';

@Injectable()
export class TimeLineModule extends BrowserModule {
  providers: Provider[] = [TimeLineContribution];
}
