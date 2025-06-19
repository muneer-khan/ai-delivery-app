import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ChatService } from '../services/chat.service';
import { firstValueFrom } from 'rxjs';
import { ChatStateService } from '../services/chat-state.service';


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

  messages: { role: string; content: string; suggestions?: ChatSuggestion[];}[] = [];
  userInput = '';
  sidebarOpen = true;
  input = '';
  inputType = 'text';
  activeChatSessionId = '';
  activeOrderId = '';

  constructor(
    private authService: AuthService, 
    private configService: ConfigService,
    private chatService: ChatService,
    private chatStateService: ChatStateService,
    private router: Router
  ) {
    this.chatStateService.chatRefresh$.subscribe(() => {
      this.clearInput();
      this.clearChat();
    });
  }

  ngOnInit() {
    this.clearInput();
    this.clearChat();
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;
    
    const msg = this.userInput.trim();
    const messageType = this.inputType;

    const isTrackingNumber = /^\d{10}$/.test(msg);

    const doRestrictChatWithLogin = this.configService.get('FEATURE_RESTRICT_LOGIN');

    const user = await this.getCurrentUser();
    if (doRestrictChatWithLogin && !user && !isTrackingNumber) {
      alert('Please login to send a message.');
      this.router.navigate(['/login']);  // redirect if needed
      return;
    }
    
    this.messages.push({ role: 'user', content: msg });
    this.clearInput();

    const messageData = {
      userMessage: msg,
      messageType: messageType,
      sessionId: this.activeChatSessionId ? this.activeChatSessionId : null,
      orderId: this.activeOrderId ? this.activeOrderId : null
    };

    this.getAIResponse(messageData);
  }

  async getAIResponse(messageData: any) {
    const response = await firstValueFrom(this.chatService.postMessageToChat(messageData));

    console.log('AI Response:', response);
    if(!this.activeChatSessionId && response.aiResponse.sessionId) {
      this.chatStateService.triggerChatHistoryRefresh(response.aiResponse.sessionId);
      this.activeChatSessionId = response.aiResponse.sessionId;
    }

    if(response.aiResponse.orderId) {
        this.activeOrderId = response.aiResponse.orderId;
    }
    
    this.messages.push({ role: 'system', content: response.aiResponse.reply, suggestions: response.aiResponse.suggestions });
  }

  setInputType() {
    this.inputType = "text";
  }

  toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

selectChat(chat: any) {
  console.log('Selected chat:', chat);
  if(chat && chat.id) {
    this.chatService.setActiveChat({ sessionId: chat.id }).subscribe(response => {
      this.activeChatSessionId = response.sessionId;
      this.messages = response.messages || [];
    });
  } else {
    this.clearChat();
  }
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
    this.inputType = 'selection';
  }

  clearInput() {
    this.userInput = '';
    this.inputType = 'text';
  }

  clearChat() {
    this.messages = [];
    this.activeChatSessionId = '';
  }
}
