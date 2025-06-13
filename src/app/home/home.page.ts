import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ChatService } from '../services/chat.service';
import { firstValueFrom } from 'rxjs';


interface ChatSuggestion {
  name: string;
  address: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {

  messages: { sender: string; text: string; suggestions?: ChatSuggestion[];}[] = [];
  userInput = '';
sidebarOpen = true;
input = '';

chatHistory = [
  { id: '1', title: 'Order #1234' },
  { id: '2', title: 'Support Request' }
];

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
    
    this.messages.push({ sender: 'user', text: msg });
    this.userInput = '';

    this.getAIResponse(msg);
  }

  async getAIResponse(input: string) {
    const response = await firstValueFrom(this.chatService.postMessageToChat({ userMessage: input }));

    console.log('AI Response:', response);
    
    this.messages.push({ sender: 'system', text: response.aiResponse.reply, suggestions: response.aiResponse.suggestedAddress });
  }

  toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

selectChat(chat: any) {
  console.log('Selected chat:', chat);
  // Replace currentMessages with fetched data if needed
}

  getCurrentUser() {
    return new Promise((resolve) => {
      this.authService.getCurrentUser().subscribe(user => {
        resolve(user);
      });
    });
  }

  onSuggestionClick(suggestion: ChatSuggestion) {
  this.userInput = suggestion.address;

  // Optionally, you can auto-send it
  // this.sendMessage();
}
}
