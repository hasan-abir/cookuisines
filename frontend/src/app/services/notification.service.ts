import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private waitingSubject = new BehaviorSubject<boolean>(false);
  waiting$ = this.waitingSubject.asObservable();

  constructor() {}

  setWaitingState(state: boolean) {
    this.waitingSubject.next(state);
  }
}
