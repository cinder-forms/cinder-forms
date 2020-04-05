import { Component, ChangeDetectionStrategy } from '@angular/core';
import { connectControl } from '@cinder-forms/core';
import { Store } from '@ngrx/store';
import { AppState } from './+state/app.state';
import * as ExampleActions from './+state/example.actions';
import * as ExampleSelectors from './+state/example.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public simpleControl = connectControl(
    (update) => this.store.dispatch(ExampleActions.updateSimpleControl({ update })),
    this.store.select(ExampleSelectors.selectSimpleControl)
  );

  constructor(private store: Store<AppState>) {}
}
