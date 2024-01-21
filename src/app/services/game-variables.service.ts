import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameVariablesService {

  private game$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private arrow$: BehaviorSubject<number> = new BehaviorSubject<number>(3);
  private arrowInformation$: BehaviorSubject<string> = new BehaviorSubject<string>('');
 


  modalObserver(): Observable<string> {
    return this.game$.asObservable()
  }

  setModalState(value: string) {
    this.game$.next(value);
  }


  arrowObserver():Observable<number> {
    return this.arrow$.asObservable()
  }

  setArrowState(value: number) {
    this.arrow$.next(value);
  }

  arrowInformationObserver():Observable<string> {
    return this.arrowInformation$.asObservable()
  }

  setArrowInformationState(value: string) {
    this.arrowInformation$.next(value);
  }

 

}
