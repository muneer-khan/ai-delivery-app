import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ChatStateService } from 'src/app/services/chat-state.service';
import { ChatService } from 'src/app/services/chat.service';

interface ChatSession {
  id: string;
  topic: string;
  status: string;
}

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
  standalone: false,
})

export class ChatHistoryComponent  implements OnInit {
  @Output() chatSelection = new EventEmitter<void>();
  
  chatHistory: ChatSession[] = [];
  selectedChatId: string = '';

  constructor(
    private chatService: ChatService,
    private chatStateService: ChatStateService
  ) {
    this.chatStateService.chatHistoryRefresh$.subscribe(() => {
      this.getChatHistory();
    });
    this.getChatHistory();
   }

  ngOnInit() {
  }
  
  async getChatHistory() {
    try {
      const result = await firstValueFrom(this.chatService.getChatHistory());
      this.chatHistory = result.history;
    } catch (err) {
      this.chatHistory = [];
      console.error('Failed to load chat history:', err);
    }
  }

  selectChat(item: any) {
    this.selectedChatId = item.id;
    this.chatSelection.emit(item);
  }

  startNewChat() {
    this.selectedChatId = '';
    this.chatSelection.emit();
  }

}
