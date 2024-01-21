import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameVariablesService } from '../../services/game-variables.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';
import { RouterLink } from '@angular/router';
import { modalService } from '../../services/modal-service.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-game-information',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterLink],
  templateUrl: './game-information.component.html',
  styleUrl: './game-information.component.scss'
})
export class GameInformationComponent  {
  

  constructor(private dialogRef: MatDialogRef<modalService>) {}

  close(): void {
    this.dialogRef.close();
  }

  

  

}
