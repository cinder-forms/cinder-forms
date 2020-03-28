import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CONFIG_TOKEN, defaultConfig } from './config';
import { controlDirectives } from './directives/controls/control-directives';
import { FormArrayDirective } from './directives/group/form-array.directive';
import { FormGroupDirective } from './directives/group/form-group.directive';
import { FormsConfig } from './types';

/**
 * This module represents the entry point of cinder-forms.
 * It provides all necessary directives for the usage inside templates.
 *
 * The `.withConfig()` method can be used to pass a config to the module.
 *
 * - [npm](https://www.npmjs.com/package/cinder-forms)
 * - [documentation](https://github.com/NiklasPor/cinder-forms)
 */
@NgModule({
  declarations: [FormGroupDirective, FormArrayDirective, ...controlDirectives],
  imports: [CommonModule],
  exports: [FormGroupDirective, FormArrayDirective, ...controlDirectives],
  providers: [
    {
      provide: CONFIG_TOKEN,
      useValue: defaultConfig
    }
  ]
})
export class CinderFormsModule {
  /**
   * Creates a new module with the given config. Missing values will be set with default values.
   *
   * @param config A partial `FormsConfig` object, supplying config paramters.
   *
   * @example
   * CinderFormsModule.withConfig({
   *   throttleTime: 15,
   * }),
   *
   */
  public static withConfig(
    config: Partial<FormsConfig>
  ): ModuleWithProviders<CinderFormsModule> {
    return {
      ngModule: CinderFormsModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useValue: {
            ...defaultConfig,
            ...config
          }
        }
      ]
    };
  }
}
