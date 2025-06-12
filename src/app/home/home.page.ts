import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ChatService } from '../services/chat.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  messages: { from: string; text: string }[] = [];
  userInput = '';

  constructor(
    private authService: AuthService, 
    private configService: ConfigService,
    private chatService: ChatService,
    private router: Router
  ) {}

  async sendMessage() {
    if (!this.userInput.trim()) return;
    
    const msg = this.userInput.trim();

    const isTrackingNumber = /^\d{10}$/.test(msg);

    const doRestrictChatWithLogin = this.configService.get('FEATURE_RESTRICT_LOGIN');

    const user = await this.getCurrentUser();
    if (doRestrictChatWithLogin && !user && !isTrackingNumber) {
      alert('Please login to send a message.');
      this.router.navigate(['/login']);  // redirect if needed
      return;
    }
    
    this.messages.push({ from: 'user', text: msg });
    this.userInput = '';

    this.getAIResponse(msg);
  }

  async getAIResponse(input: string) {
    const response = await firstValueFrom(this.chatService.postMessageToChat({ userMessage: input }));

    console.log('AI Response:', response);
    
    this.messages.push({ from: 'ai', text: response.aiResponse.reply });
  }

  getCurrentUser() {
    return new Promise((resolve) => {
      this.authService.getCurrentUser().subscribe(user => {
        resolve(user);
      });
    });
  }
}
