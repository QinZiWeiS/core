import moment from 'moment';
import * as React from 'react';

import { ViewState, localize, useInjectable } from '@opensumi/ide-core-browser';
import { RecycleList } from '@opensumi/ide-core-browser/lib/components';
import { WorkbenchEditorService } from '@opensumi/ide-editor';

import * as styles from './timeline.module.less';
import { TimeLineService } from './timeline.service';

export interface ITimeLineNode {
  type: string;
  time: string;
}

export const TimeLine = ({ viewState }: React.PropsWithChildren<{ viewState: ViewState }>) => {
  const { width, height } = viewState;
  const { getTimeLineInfo, onDidSaved } = useInjectable<TimeLineService>(TimeLineService);
  const editorService = useInjectable<WorkbenchEditorService>(WorkbenchEditorService);

  const [data, setData] = React.useState<any>();
  const [hasLocalHistory, setHasLocalHistory] = React.useState<boolean>(false);

  React.useEffect(() => {
    renderTimeline();
  }, []);

  React.useEffect(() => {
    const disposable = onDidSaved((value: string) => {
      renderTimeline();
    });
    return () => {
      disposable.dispose();
    };
  }, [data]);

  const renderTimeline = () => {
    const currentResourcePath = editorService.currentResource?.uri.codeUri.path;
    const localhistoryPath = currentResourcePath?.replace('/tools/workspace', '/.localhistory');

    if (currentResourcePath && localhistoryPath) {
      getTimeLineInfo(localhistoryPath)
        .then((res) => {
          setData(JSON.parse(res.content.buffer.toString()));
          setHasLocalHistory(true);
        })
        .catch(() => {
          setHasLocalHistory(false);
        });
    }
  };

  const template = ({ data, index }: { data: ITimeLineNode; index: number }) => (
    <div className={styles.timeline_node} key={`${index}`}>
      <div className={styles.timeline_node_type}>{localize(`timeline.${data.type}`)}</div>
      <div className={styles.timeline_node_time}>{moment(data.time).fromNow()}</div>
    </div>
  );

  return editorService.currentResource ? (
    hasLocalHistory ? (
      <RecycleList height={height} width={width} itemHeight={24} data={data} template={template} />
    ) : (
      <div className={styles.timeline_noFile}>{localize('timeline.noLocalHistory')}</div>
    )
  ) : (
    <div className={styles.timeline_noFile}>{localize('timeline.noFile')}</div>
  );
};
