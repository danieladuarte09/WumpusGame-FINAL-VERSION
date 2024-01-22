import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { modalService } from '../../services/modal-service.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-about-modal',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterLink],
  templateUrl: './about-modal.component.html',
  styleUrl: './about-modal.component.scss'
})
export class AboutModalComponent {

  constructor(private dialogRef: MatDialogRef<modalService>) {}

  close(): void {
    this.dialogRef.close();
  }


}
