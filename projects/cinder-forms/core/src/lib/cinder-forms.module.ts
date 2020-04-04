import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CONFIG_TOKEN, defaultConfig } from './config';
import { CinderConfig } from './logic/control/init/types';
import { CinderControlDirective } from './directives/control/cinder-control.directive';

/**
 * This module represents the entry point of cinder-forms.
 * It provides all necessary directives for the usage inside templates.
 *
 * The `.withConfig()` method can be used to pass a config to the module.
 *
 * - [npm](https://www.npmjs.com/package/cinder-forms)
 * - [documentation](https://github.com/cinder-forms/cinder-forms)
 */
@NgModule({
  declarations: [CinderControlDirective],
  imports: [CommonModule],
  exports: [CinderControlDirective],
  providers: [
    {
      provide: CONFIG_TOKEN,
      useValue: defaultConfig,
    },
  ],
})
export class CinderFormsModule {
  /**
   * Creates a new module with the given config. Missing values will be set with default values.
   *
   * @param config A partial `CinderConfig` object, supplying config paramters.
   *
   * @example
   * CinderFormsModule.withConfig({
   *   throttleTime: 15,
   * }),
   *
   */
  public static withConfig(config: Partial<CinderConfig>): ModuleWithProviders<CinderFormsModule> {
    return {
      ngModule: CinderFormsModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useValue: {
            ...defaultConfig,
            ...config,
          },
        },
      ],
    };
  }
}
