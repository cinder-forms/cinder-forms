import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { exampleReducer } from './+state/example.reducer';
import { AppComponent } from './app.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { CinderFormsModule } from '@cinder-forms/core';

@NgModule({
  declarations: [AppComponent, CustomInputComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ example: exampleReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    CinderFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
