import { InjectionToken } from '@angular/core';
import { asyncScheduler, MonoTypeOperatorFunction } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { FormsConfig } from './types';

export const CONFIG_TOKEN = new InjectionToken<FormsConfig>(
  'NGRX_CLEAN_FORMS_CONFIG'
);

export const defaultConfig: FormsConfig = {
  throttleTime: 20,
  distinctWritesOnly: true
};

export const throttle = <T>(config: FormsConfig): MonoTypeOperatorFunction<T> =>
  throttleTime(config.throttleTime, asyncScheduler, {
    leading: true,
    trailing: true
  });
