import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Discount} from '../../shared/interfaces/discount';
import {ExpectedTime} from '../../shared/interfaces/expected-time';

@Injectable({
  providedIn: 'root'
})
export class ExpectedTimeService {

  private expectedTime = `${environment.baseUrl}/expected-time`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getExpectedTimes(): Observable<ExpectedTime[]> {
    return this.httpClient.get<ExpectedTime[]>(this.expectedTime);
  }

  public patchExpectedTime(id: number, time: string): Observable<any> {
    return this.httpClient.patch<any>(`${this.expectedTime}/${id}`, {time});
  }
}
