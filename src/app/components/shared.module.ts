import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CustomHeaderComponent } from './custom-header/custom-header.component';

@NgModule({
  declarations: [CustomHeaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [CustomHeaderComponent]  // 👈 Make it available elsewhere
})
export class SharedModule {}
