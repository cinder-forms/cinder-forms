import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './+state/app.state';
import * as ExampleActions from './+state/example.actions';
import * as ExampleSelectors from './+state/example.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private store: Store<AppState>) {
    this.store.select(ExampleSelectors.selectSimpleControl).subscribe(console.log);
    this.store.dispatch(ExampleActions.updateSimpleControl({ update: { value: 'newValue' } }));
  }
}
