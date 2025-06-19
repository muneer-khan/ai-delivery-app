import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatStateService {

  private chatHistoryRefreshTrigger = new BehaviorSubject<any>(undefined);
  chatHistoryRefresh$ = this.chatHistoryRefreshTrigger.asObservable();

  private chatRefreshTrigger = new BehaviorSubject<void>(undefined);
  chatRefresh$ = this.chatRefreshTrigger.asObservable();

  triggerChatHistoryRefresh(selectedChat?: string) {
    this.chatHistoryRefreshTrigger.next(selectedChat);
  }

  triggerChatRefresh() {
    this.chatRefreshTrigger.next();
  }
}
