import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatStateService {

  private chatHistoryRefreshTrigger = new BehaviorSubject<void>(undefined);
  chatHistoryRefresh$ = this.chatHistoryRefreshTrigger.asObservable();

  private chatRefreshTrigger = new BehaviorSubject<void>(undefined);
  chatRefresh$ = this.chatRefreshTrigger.asObservable();

  triggerChatHistoryRefresh() {
    this.chatHistoryRefreshTrigger.next();
  }

  triggerChatRefresh() {
    this.chatRefreshTrigger.next();
  }
}
