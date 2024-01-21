import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { InitialStructure } from '../Models/initial-structure';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {

  constructor() { }

  private gameConfig$:  ReplaySubject<InitialStructure> = new ReplaySubject<InitialStructure>(1);

  getConfigObserver(): Observable<InitialStructure> {
    const storedConfigString = localStorage.getItem('GameConfig');
  
    if (storedConfigString === null) {
      return this.gameConfig$.asObservable();
    } else {
      const storedConfig = JSON.parse(storedConfigString);
      this.gameConfig$.next(storedConfig);
      return this.gameConfig$.asObservable();
    }
  }
  
  updateConfig(config: InitialStructure) {
    let configCopy = JSON.parse(JSON.stringify(config));
    
    // Actualiza el observable con la nueva configuración
    this.gameConfig$.next(configCopy);
  
    // Actualiza el Local Storage con la nueva configuración
    localStorage.setItem('GameConfig', JSON.stringify(configCopy));
  }

  //getCurrentConfig(): InitialStructure {
    //return this.gameConfig$.getValue();
  //}


}

