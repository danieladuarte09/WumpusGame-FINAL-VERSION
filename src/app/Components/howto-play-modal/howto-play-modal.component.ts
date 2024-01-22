import { Component } from '@angular/core';
import { modalService } from '../../services/modal-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-howto-play-modal',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterLink],
  templateUrl: './howto-play-modal.component.html',
  styleUrl: './howto-play-modal.component.scss'
})
export class HowtoPlayModalComponent {

  constructor(private dialogRef: MatDialogRef<modalService>) {}

  close(): void {
    this.dialogRef.close();
  }

}
