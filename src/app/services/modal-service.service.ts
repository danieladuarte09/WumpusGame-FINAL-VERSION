import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ModalStateComponent } from '../Components/modal-state/modal-state.component';
import { MatDialog } from '@angular/material/dialog';
import { GameInformationComponent } from '../Components/game-information/game-information.component';
import { AboutModalComponent } from '../Components/about-modal/about-modal.component';
import { HowtoPlayModalComponent } from '../Components/howto-play-modal/howto-play-modal.component';

@Injectable({
  providedIn: 'root'
})
/*export class ModalService {
  private game$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);*/

  export class modalService {
    constructor(public dialog: MatDialog) {}

    resetGame: EventEmitter<void> = new EventEmitter<void>();

  openDialog(message: string): void {
    const dialogRef = this.dialog.open(ModalStateComponent, {
      data: { message }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openModal(): void {
    this.dialog.open(GameInformationComponent, {
      width: '500px', // Ajusta el ancho según tus necesidades
    });
  }

  openAboutModal(): void {
    this.dialog.open(AboutModalComponent, {
      width: '500px', // Ajusta el ancho según tus necesidades
    });
  }

  openHowtoPlayModal(): void {
    this.dialog.open(HowtoPlayModalComponent, {
      width: '500px', 
    });
  }



  }