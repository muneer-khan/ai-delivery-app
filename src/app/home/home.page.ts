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

interface MessageType { 
  role: string; 
  content: string; 
  suggestions?: ChatSuggestion[];
  suggestionType?: string
  selectionActive?: boolean
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {

  messages: MessageType[] = [];
  userInput = '';
  sidebarOpen = true;
  input = '';
  inputType = 'text';
  activeChatSessionId = '';
  activeOrderId = '';
  selectedSuggestionType: any;
  selectedChatIndex = 0;

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
    const messageData = {
      userMessage: msg,
      messageType: messageType,
      sessionId: this.activeChatSessionId ? this.activeChatSessionId : null,
      orderId: this.activeOrderId ? this.activeOrderId : null,
      suggestionType: this.selectedSuggestionType ? this.selectedSuggestionType : null
    };
    this.messages[this.selectedChatIndex].selectionActive = false;
    this.clearInput();
    this.getAIResponse(messageData);
  }

  async getAIResponse(messageData: any) {
    const response = await firstValueFrom(this.chatService.postMessageToChat(messageData));
    const result = response.result;
    if(!this.activeChatSessionId && result.sessionId) {
      this.chatStateService.triggerChatHistoryRefresh(result.sessionId);
      this.activeChatSessionId = result.sessionId;
    }

    if(result.orderId) {
        this.activeOrderId = result.orderId;
    } else {
      this.activeOrderId = '';
    }
    this.disableSelections();
    this.messages.push({ role: 'system', content: result.reply, suggestions: result.suggestions, suggestionType: result.suggestionType, selectionActive: true });
  }

  private disableSelections() {

  }

  setInputType() {
    this.inputType = "text";
    this.selectedSuggestionType = '';
    this.selectedChatIndex = 0;
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

getPlaceholder(): string {
  return this.activeChatSessionId
    ? 'Send a message...'
    : 'What would you like to pickup or dropoff?';
}


  getCurrentUser() {
    return new Promise((resolve) => {
      this.authService.getCurrentUser().subscribe(user => {
        resolve(user);
      });
    });
  }

  onSuggestionClick(suggestion: ChatSuggestion, msgIndex: number) {
    this.userInput = suggestion.address || suggestion.name;
    this.inputType = 'selection';
    console.log(msgIndex);
    console.log(this.messages[msgIndex]);
    
    
    this.selectedSuggestionType = this.messages[msgIndex].suggestionType;
    this.selectedChatIndex = msgIndex;
  }

  clearInput() {
    this.userInput = '';
    this.inputType = 'text';
    this.selectedSuggestionType = '';
    this.selectedChatIndex = 0;
  }

  clearChat() {
    this.messages = [];
    this.activeChatSessionId = '';
    this.activeOrderId = '';
    this.selectedSuggestionType = '';
  }
}
