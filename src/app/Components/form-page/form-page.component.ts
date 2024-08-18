import { Component } from '@angular/core';
import { InitialStructure } from '../../Models/initial-structure';
import { Subscription } from 'rxjs';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { GameConfigService } from '../../services/game-config.service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule, RouterModule, NavBarComponent],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss',
})
export class FormPageComponent {
  config: InitialStructure | undefined;
  private configSubscription: Subscription | undefined;
  showGameBoard: boolean = false;
  formGroup!: FormGroup;

  constructor(private gameConfigService: GameConfigService) {
    // Suscribirse a cambios en la configuración y almacenar la suscripción
    this.configSubscription = this.gameConfigService
      .getConfigObserver()
      .subscribe((config: InitialStructure) => {
        console.log('array:', config);
        this.config = config;
      });
  }

  //inicializamos el formulario
  ngOnInit(): void {
    this.initFormGroup();
  }

  ngOnDestroy(): void {
    // Desuscribirse en ngOnDestroy
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }

  private initFormGroup(): void {
    this.formGroup = new FormGroup(
      {
        boardSize: new FormControl('', [
          Validators.required,
          Validators.min(4),
          Validators.max(10),
          Validators.pattern(/^[0-9]*$/)
        ]),
        numberOfPits: new FormControl('', [
          Validators.required,
          Validators.min(3),
          Validators.max(10), 
          Validators.pattern(/^[0-9]*$/)
        ]),
      },
      { validators: this.validatePits }
    );
  }

  private validatePits: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const boardSize = control.get('boardSize')?.value;
    const numberOfPits = control.get('numberOfPits')?.value;

    if (boardSize && numberOfPits && numberOfPits > boardSize * 0.8) {
      return { pitsError: 'Choose a number of pits that is less than 80% of the grid size.' };
    }

    return null;
  };


  //actualizamos la información almacenada en el servicio
  public onPlayClick() {
    console.log(this.formGroup);

    // Obtener los valores del formulario
    const boardSize = this.formGroup.get('boardSize')?.value;
    const numberOfPits = this.formGroup.get('numberOfPits')?.value;

    // Actualizar la configuración del juego
    const config: InitialStructure = {
      boardSize: boardSize,
      numberOfPits: numberOfPits,
    };
    this.gameConfigService.updateConfig(config);
  }
}
