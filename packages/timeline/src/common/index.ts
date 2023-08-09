export const TIMELINE_VIEW_ID = 'timeline-view';

export interface ITimeLineService {
  getTimeLineInfo(path: string | undefined): any;
}

export const ITimeLineService = Symbol('ITimeLineService');
