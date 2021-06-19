import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatPhone} from '../../shared/interfaces/chat-phone';

@Injectable({
  providedIn: 'root'
})
export class ChatPhoneService {

  private chatPhone = `${environment.baseUrl}/chat-phone`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getChatPhone(): Observable<ChatPhone> {
    return this.httpClient.get<ChatPhone>(this.chatPhone);
  }

  public patchChatPhone(phone: string): Observable<any> {
    return this.httpClient.patch<any>(this.chatPhone, {phone});
  }
}
