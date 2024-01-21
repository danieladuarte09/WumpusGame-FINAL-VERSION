import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { modalService } from '../../services/modal-service.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  constructor(private ModalService: modalService) {}

  openPerceptionModal(): void {
    this.ModalService.openModal();
  }

}
