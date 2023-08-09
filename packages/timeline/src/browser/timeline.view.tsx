import * as React from 'react';

import { ViewState, localize, useInjectable } from '@opensumi/ide-core-browser';
import { RecycleList } from '@opensumi/ide-core-browser/lib/components';
import { WorkbenchEditorService } from '@opensumi/ide-editor';

import { ITimeLineService } from '../common';

import * as styles from './timeline.module.less';

export interface ITimeLineNode {
  type: string;
  time: string;
}

export const TimeLine = ({ viewState }: React.PropsWithChildren<{ viewState: ViewState }>) => {
  const { width, height } = viewState;
  const { getTimeLineInfo } = useInjectable<ITimeLineService>(ITimeLineService);
  const editorService = useInjectable<WorkbenchEditorService>(WorkbenchEditorService);

  const [data, setData] = React.useState<any>([]);

  React.useEffect(() => {
    const currentResourcePath = editorService.currentResource?.uri.codeUri.path;
    const localhistoryPath = currentResourcePath?.replace('/tools/workspace', '/.localhistory');

    if (currentResourcePath && localhistoryPath) {
      getTimeLineInfo(localhistoryPath).then((res) => {
        setData(JSON.parse(res.content.buffer.toString()));
      });
    }
  }, []);

  const template = ({ data, index }: { data: ITimeLineNode; index: number }) => (
    <div className={styles.timeline_node} key={`${index}`}>
      <div className={styles.timeline_node_type}>{data.type}</div>
      <div className={styles.timeline_node_time}>{data.time}</div>
    </div>
  );

  return editorService.currentResource ? (
    <RecycleList height={height} width={width} itemHeight={24} data={data} template={template} />
  ) : (
    <div className={styles.timeline_noFile}>{localize('timeline.noFile')}</div>
  );
};
