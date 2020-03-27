# CinderForms

## Template Binding

```html
<form *cinderForm="myForm; let controls = controls">
  <input
    type="number"
    *cinderControl="controls.numberInput as numberInput; let errors = errors"
  />
  <div [ngSwitch]="true">
    <small *ngSwitchCase="!!numberInput.errors.required">Required.</small>
    <small *ngSwitchCase="!!errors.max">Number too high.</small>
  </div>
</form>
```

## Local Form

```ts
class SomeComponent {
  someForm = createGroup({
    numberInput: [0]
  });
}
```

## Connect to NgRx / NgXs

```ts
class SomeComponent {
  someConnectedForm = connectGroup(
    this.facade.myForm$,
    this.facade.updateMyForm
  );
}

const neverError = control => ({});
const alwaysError = control => ({alwaysError: true})

const groupState = reduceGroup(update: GroupUpdate): void;
const group =  selectGroup(group: GroupState): Group

const groupState = initGroup({
    numberInput: [0, [neverError, alwaysError]]
})

interface SomeState {
    myForm: typeof groupState
}
```
