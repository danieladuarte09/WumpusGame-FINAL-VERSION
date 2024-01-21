import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { modalService } from '../../services/modal-service.service';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-modal-state',
  templateUrl: 'modal-state.component.html',
  standalone: true,
  styleUrl: './modal-state.component.scss',
  imports: [MatDialogModule,MatCardModule, CommonModule,
    RouterModule
  ]
})
export class ModalStateComponent {

  
  constructor(
    private ModalService: modalService,
    public dialogRef: MatDialogRef<ModalStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {}
  
  playGameButton() {
    // Emitir el evento de reinicio
    this.ModalService.resetGame.emit();
    // Cerrar el modal
    this.dialogRef.close();
    
  }
}
