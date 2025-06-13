import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { ChatService } from './chat.service';
import { ChatStateService } from './chat-state.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, IonicModule],
  providers: [AuthService, ApiService, ConfigService, ChatService, ChatStateService], 
})
export class ServiceModule {}
