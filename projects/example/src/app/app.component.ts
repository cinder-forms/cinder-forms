import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArrayUpdate, FormControlUpdate, FormGroupUpdate } from '@cinder-forms/core';
import { Store } from '@ngrx/store';
import { AppState } from './+state/app.state';
import * as ExampleActions from './+state/example.actions';
import { ExampleGroupControls, StateAccessExampleFormControls } from './+state/example.reducer';
import * as ExampleSelectors from './+state/example.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public state$ = this.store.select(ExampleSelectors.selectExample);
  public singleInput$ = this.store.select(ExampleSelectors.selectSingleInput);
  public formGroup$ = this.store.select(ExampleSelectors.selectFormGroup);
  public stateAccessFormGroup$ = this.store.select(ExampleSelectors.selectStateAccessExampleGroup);
  public forbiddenNumber$ = this.store.select(ExampleSelectors.selectForbiddenNumber);
  public formArray$ = this.store.select(ExampleSelectors.selectArray);

  constructor(private store: Store<AppState>) {}

  public ngOnInit() {}

  public updateSingleInput(controlUpdate: FormControlUpdate<string>) {
    this.store.dispatch(ExampleActions.updateSingleFormControl({ update: controlUpdate }));
  }

  public resetFormGroup() {
    this.store.dispatch(ExampleActions.resetFormGroup());
  }

  public updateFormGroup(update: FormGroupUpdate<ExampleGroupControls>) {
    this.store.dispatch(ExampleActions.updateFormGroup({ update }));
  }

  public updateFormArray(update: FormArrayUpdate<string>) {
    this.store.dispatch(ExampleActions.updateFormArray({ update }));
  }

  public updateStateAccessFormGroup(update: FormGroupUpdate<StateAccessExampleFormControls>) {
    this.store.dispatch(ExampleActions.updateStateAccessExampleFormGroup({ update }));
  }

  public addControlToArray() {
    this.store.dispatch(ExampleActions.addControlToArray());
  }

  public ngAfterViewInit() {}
}
