import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { ChatHistoryComponent } from './chat-history/chat-history.component';

@NgModule({
  declarations: [CustomHeaderComponent, ChatHistoryComponent],
  imports: [CommonModule, IonicModule],
  exports: [CustomHeaderComponent, ChatHistoryComponent]  
})
export class SharedModule {}
