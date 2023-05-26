import { mixpanelProjectToken } from '@/config';
import mixpanel from 'mixpanel-browser';

type Mixpanel = typeof mixpanel;

export function track(...args: Parameters<Mixpanel['track']>): ReturnType<Mixpanel['track']> {
  if (mixpanelProjectToken) {
    mixpanel.track(...args);
  }
}
