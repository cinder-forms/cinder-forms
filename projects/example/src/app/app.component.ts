import { tap } from 'rxjs/operators';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { connectControl, connectGroup } from '@cinder-forms/core';
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

  public simpleGroup = connectGroup(
    (update) => this.store.dispatch(ExampleActions.updateSimpleGroup({ update })),
    this.store.select(ExampleSelectors.selectSimpleGroup)
  );

  constructor(private store: Store<AppState>) {}
}
