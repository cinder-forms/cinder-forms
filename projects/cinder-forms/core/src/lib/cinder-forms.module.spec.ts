import { TestBed } from '@angular/core/testing';
import { CinderFormsModule } from './cinder-forms.module';
import { CONFIG_TOKEN, defaultConfig } from './config';
import { FormsConfig } from './types';

describe('CinderFormsModule', () => {
  it('can be created', async () => {
    const expected = defaultConfig;

    await TestBed.configureTestingModule({
      imports: [
        CinderFormsModule.withConfig({
          distinctWritesOnly: expected.distinctWritesOnly,
          throttleTime: expected.throttleTime
        })
      ]
    }).compileComponents();

    const result: FormsConfig = TestBed.get(CONFIG_TOKEN);

    expect(result).toEqual(expected);
  });

  it('can be created with config', async () => {
    const expected: FormsConfig = {
      throttleTime: 9123,
      distinctWritesOnly: false
    };

    await TestBed.configureTestingModule({
      imports: [
        CinderFormsModule.withConfig({
          distinctWritesOnly: expected.distinctWritesOnly,
          throttleTime: expected.throttleTime
        })
      ]
    }).compileComponents();

    const result: FormsConfig = TestBed.get(CONFIG_TOKEN);

    expect(result).toEqual(expected);
  });
});
