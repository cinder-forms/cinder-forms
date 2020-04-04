import { InjectionToken } from '@angular/core';
import { asyncScheduler, MonoTypeOperatorFunction } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { CinderConfig } from './logic/control/init/types';

export const CONFIG_TOKEN = new InjectionToken<CinderConfig>('NGRX_CLEAN_FORMS_CONFIG');

export const defaultConfig: CinderConfig = {
  throttleTime: 20,
  distinctWritesOnly: true,
};

export const throttle = <T>(config: CinderConfig): MonoTypeOperatorFunction<T> =>
  throttleTime(config.throttleTime, asyncScheduler, {
    leading: true,
    trailing: true,
  });
