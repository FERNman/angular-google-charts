import { InjectionToken } from '@angular/core';

import { GoogleChartsConfig } from './google-charts-config.model';

export const GOOGLE_CHARTS_CONFIG = new InjectionToken<GoogleChartsConfig>('GOOGLE_CHARTS_CONFIG');
