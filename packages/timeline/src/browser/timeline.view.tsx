import * as React from 'react';

import { ViewState, useInjectable } from '@opensumi/ide-core-browser';
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

  const currentResource = editorService.currentResource;

  const currentResourcePath = currentResource?.uri.codeUri.path;
  // console.log(currentResourcePath);

  const data = getTimeLineInfo(currentResourcePath);

  const template = ({ data, index }: { data: ITimeLineNode; index: number }) => (
      <div className={styles.timeline_node} key={`${index}`}>
        <div className={styles.timeline_node_type}>{data.type}</div>
        <div className={styles.timeline_node_time}>{data.time}</div>
      </div>
    );

  return <RecycleList height={height} width={width} itemHeight={24} data={data} template={template} />;
};
