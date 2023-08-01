export const TIMELINE_VIEW_ID = 'timeline-view';

export interface ITimeLineService {
  getTimeLineInfo(path: string | undefined): object[];
}

export const ITimeLineService = Symbol('ITimeLineService');
