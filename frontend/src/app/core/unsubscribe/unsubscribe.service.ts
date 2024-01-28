import { Injectable } from '@angular/core';
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UnsubscribeService {
  private subscriptionList: Subscription[] = [];

  constructor() { }

  set sub(sub: Subscription) {
    this.subscriptionList.push(sub);
  }

  public getSub(): Subscription[] {
    return this.subscriptionList;
  }
}
