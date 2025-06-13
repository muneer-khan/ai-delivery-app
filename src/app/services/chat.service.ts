import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private apiService: ApiService) {}

    postMessageToChat(data: any): Observable<any> {
        return this.apiService.post<any>('chat', data);
    }

    getChatHistory() : Observable<any> {
      return this.apiService.get<any[]>(`chat/history`);
    }

    setActiveChat(data: any): Observable<any> {
        return this.apiService.post<any>('chat/set-active', data);
    }
}