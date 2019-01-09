import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ContentDrawerComponent } from './content-drawer';

@NgModule({
  declarations: [
    ContentDrawerComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ContentDrawerComponent
  ]
})
export class ContentDrawerComponentModule {}
