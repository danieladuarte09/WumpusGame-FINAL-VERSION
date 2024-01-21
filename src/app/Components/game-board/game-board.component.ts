import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cell } from '../../Models/cell';
import { modalService } from '../../services/modal-service.service';
import { GameConfigService } from '../../services/game-config.service';
import { InitialStructure } from '../../Models/initial-structure';
import { GameInformationComponent } from '../game-information/game-information.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
    selector: 'app-game-board',
    standalone: true,
    templateUrl: './game-board.component.html',
    styleUrl: './game-board.component.scss',
    imports: [CommonModule, GameInformationComponent, NavBarComponent]
})
export class GameBoardComponent {
  constructor(public ModalService: modalService, 
    private el: ElementRef, 
    private gameConfigService: GameConfigService) {}

  matriz: Cell[][] = [];
  boardSizeInitial = 0;
  pitsInitial = 0;
  gameConfig$: any;
  pits: Cell[][] = [];
  gold:Cell[][] = [];
  wumpus: Cell[][] = [];
  playerPosition: { row: number; column: number } = { row: 0, column: 0 };
  goldMapping!:  void;
  wumpusMapping!:void;
  pitMapping!:void;
  showMessageGold = false;
  playerDirection: string = 'down'; //dirección por defecto del jugador

  ngOnInit(): void {
    //const example = this.matrizGame(10);
    //const matrizConJugador = this.placePlayer(example);
    //const matrixconOro = this.placeGold(example)
    //const matrixconWumpus = this.placeWumpus(example)
    //const matrixconPits = this.placePits(example, 6)
    //console.log(matrixconWumpus);

    this.gameConfigService
      .getConfigObserver()
      .subscribe((config: InitialStructure) => {
        console.log('Information received from the form:', config);

        this.boardSizeInitial = config.boardSize
        this.pitsInitial = config.numberOfPits
        this.matriz = this.placePlayer(config.boardSize);
        this.pits = this.placePits(this.matriz,config.numberOfPits)
        this.gold = this.placeGold(this.matriz);
        this.wumpus = this.placeWumpus(this.matriz);
        console.log(this.matriz);

        this.goldMapping = this.EvaluatePositionGold(this.matriz);
        this.wumpusMapping = this.EvaluatePositionWumpus(this.matriz);
        this.pitMapping = this.EvaluatePositionPit(this.matriz);
        

        //lay Again modal button
        this.ModalService.resetGame.subscribe(() => {
          this.resetGame()
        });
      });

      
    

    
    //console.log('gold?', this.position);
  }

  //Llamadas a las funciones
  //MatrizPlayer = this.placePlayer(6);
  //MatrizGold = this.placeGold(this.MatrizPlayer);
  //MatrizWumpus = this.placeWumpus(this.MatrizPlayer);
  //MatrizPit = this.placePits(this.MatrizPlayer, 5);
  

  //position = this.EvaluatePositionGold(this.MatrizPlayer);
  //position2 = this.EvaluatePositionWumpus(this.MatrizPlayer);
  //position3 = this.EvaluatePositionPit(this.MatrizPlayer);

  //gold: boolean = false


  

  resetGame(): void {
    
    //new matrix is generated
        this.matriz = this.placePlayer(this.boardSizeInitial);
        this.pits = this.placePits(this.matriz,this.pitsInitial)
        this.gold = this.placeGold(this.matriz);
        this.wumpus = this.placeWumpus(this.matriz);
    //Realizamos el mapeo de las casillas que tienen percepciones
        this.goldMapping = this.EvaluatePositionGold(this.matriz);
        this.wumpusMapping = this.EvaluatePositionWumpus(this.matriz);
        this.pitMapping = this.EvaluatePositionPit(this.matriz);
        this.showMessageGold = false;
    

  }

  placePlayer(gridSize: number): Cell[][] {
    const matriz: Cell[][] = [];

    for (let i = 0; i < gridSize; i++) {
      matriz[i] = [];

      for (let j = 0; j < gridSize; j++) {
        matriz[i][j] = new Cell(); // Inicializa cada celda con una instancia de Cell
      }
    }

    matriz[0][0].player = true; // Establece la posición inicial del jugador

    return matriz;
  }

  randomPosition(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Las posiciones adyacentes al player deben estar vacias
  isAdjacentToPlayer(row: number, column: number, matriz: Cell[][]): boolean {
    const playerRow = matriz.findIndex((row) =>
      row.some((cell) => cell.player)
    );
    const playerColumn = matriz[playerRow].findIndex((cell) => cell.player);

    const rowDiff = Math.abs(row - playerRow);
    const columnDiff = Math.abs(column - playerColumn);

    return (
      (rowDiff === 1 && columnDiff === 0) || (rowDiff === 0 && columnDiff === 1)
    );
  }

  placeGold(matriz: Cell[][]): Cell[][] {
    let row, column;

    do {
      row = this.randomPosition(0, matriz.length - 1);
      column = this.randomPosition(0, matriz.length - 1);
    } while (
      matriz[row][column].player ||
      this.isAdjacentToPlayer(row, column, matriz)
    );
    matriz[row][column].gold = true;

    return matriz;
  }

  placeWumpus(matriz: Cell[][]): Cell[][] {
    let row, column;

    do {
      row = this.randomPosition(0, matriz.length - 1);
      column = this.randomPosition(0, matriz.length - 1);
    } while (
      matriz[row][column].player ||
      matriz[row][column].gold ||
      matriz[row][column].pit ||
      this.isAdjacentToPlayer(row, column, matriz)
    );

    matriz[row][column].wumpus = true;

    return matriz;
  }

  placePits(matriz: Cell[][], numberPits: number): Cell[][] {
    for (let i = 0; i < numberPits; i++) {
      let row, column;

      do {
        row = this.randomPosition(0, matriz.length - 1);
        column = this.randomPosition(0, matriz.length - 1);
      } while (
        matriz[row][column].player ||
        matriz[row][column].wumpus ||
        matriz[row][column].gold ||
        matriz[row][column].pit ||
        this.isAdjacentToPlayer(row, column, matriz)
      );

      matriz[row][column].pit = true;
    }

    return matriz;
  }

  movePlayer(matriz: Cell[][], direction: string): Cell[][] {
    const gridSize = matriz.length;
    let playerRow = -1;
    let playerCol = -1;

    // Encuentra la posición actual del jugador
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (matriz[i][j].player) {
          playerRow = i;
          playerCol = j;
          break;
        }
      }
    }

    // Actualiza la posición del jugador en función de la dirección
    switch (direction) {
      case 'up':
        if (playerRow > 0) {
          matriz[playerRow][playerCol].player = false;
          matriz[playerRow - 1][playerCol].player = true;
          this.GameStatus(matriz);
        }
        break;
      case 'down':
        if (playerRow < gridSize - 1) {
          matriz[playerRow][playerCol].player = false;
          matriz[playerRow + 1][playerCol].player = true;
          this.GameStatus(matriz);
        }
        break;
      case 'left':
        if (playerCol > 0) {
          matriz[playerRow][playerCol].player = false;
          matriz[playerRow][playerCol - 1].player = true;
          this.GameStatus(matriz);
        }
        break;
      case 'right':
        if (playerCol < gridSize - 1) {
          matriz[playerRow][playerCol].player = false;
          matriz[playerRow][playerCol + 1].player = true;
          this.GameStatus(matriz);
        }
        break;
      default:
        // Dirección no válida
        break;
    }

    return matriz;
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        this.changePlayerDirection('up')
        this.matriz = this.movePlayer(this.matriz, 'up');
        break;
      case 'ArrowDown':
        this.changePlayerDirection('down')
        this.matriz = this.movePlayer(this.matriz, 'down');
        break;
      case 'ArrowLeft': 
        this.changePlayerDirection('left')
        this.matriz = this.movePlayer(this.matriz, 'left');
        break;
      case 'ArrowRight':
        this.changePlayerDirection('right')
        this.matriz= this.movePlayer(this.matriz, 'right');
        break;
    }
  }

  //focus en la tabla para que mueva el player con el keyboard
  ngAfterViewInit(): void {
    this.el.nativeElement.querySelector('.table').focus();
  }

  EvaluatePositionGold(matriz: Cell[][]): void {
    for (let row = 0; row < matriz.length; row++) {
      for (let column = 0; column < matriz[0].length; column++) {
        if (matriz[row][column].gold) {
          // Verificar celda arriba
          if (row > 0) {
            matriz[row - 1][column].brightness = true;
          }
          //celda  abajo
          if (row < matriz.length - 1) {
            matriz[row + 1][column].brightness = true;
          }
          //izquierda
          if (column > 0) {
            matriz[row][column - 1].brightness = true;
          }
          //derecha
          if (column < matriz.length - 1) {
            matriz[row][column + 1].brightness = true;
          }
        }
      }
    }
  }

  EvaluatePositionWumpus(matriz: Cell[][]): void {
    for (let row = 0; row < matriz.length; row++) {
      for (let column = 0; column < matriz[0].length; column++) {
        if (matriz[row][column].wumpus) {
          // Verificar celda arriba
          if (row > 0) {
            matriz[row - 1][column].stench = true;
          }
          //celda  abajo
          if (row < matriz.length - 1) {
            matriz[row + 1][column].stench = true;
          }
          //izquierda
          if (column > 0) {
            matriz[row][column - 1].stench = true;
          }
          //derecha
          if (column < matriz.length - 1) {
            matriz[row][column + 1].stench = true;
          }
        }
      }
    }
  }

  EvaluatePositionPit(matriz: Cell[][]): void {
    for (let row = 0; row < matriz.length; row++) {
      for (let column = 0; column < matriz[0].length; column++) {
        if (matriz[row][column].pit) {
          // Verificar celda arriba
          if (row > 0) {
            matriz[row - 1][column].breeze = true;
          }
          //celda  abajo
          if (row < matriz.length - 1) {
            matriz[row + 1][column].breeze = true;
          }
          //izquierda
          if (column > 0) {
            matriz[row][column - 1].breeze = true;
          }
          //derecha
          if (column < matriz.length - 1) {
            matriz[row][column + 1].breeze = true;
          }
        }
      }
    }
  }

  showModal(message: string): void {
    this.ModalService.openDialog(message);
  }

  getPlayerPosition(matriz: Cell[][]): { row: number; column: number } | null {
    for (let row = 0; row < matriz.length; row++) {
      for (let column = 0; column < matriz[0].length; column++) {
        if (matriz[row][column].player) {
          return { row, column };
        }
      }
    }

    return null;
  }

  GameStatus(matriz: Cell[][]): void {
    const playerPosition = this.getPlayerPosition(matriz);

    if (playerPosition) {
      const { row, column } = playerPosition;

      if (matriz[row][column].pit) {
        this.showModal('Oops! You have fallen into a well. End of game');
      }
      if (matriz[row][column].wumpus) {
        this.showModal('You have been caught by the WUMPUS. End of game');
      }

      if (matriz[row][column].gold) {
        this.showMessageGold = true;
      }

      if (matriz[row][column].gold && matriz[0][0].player) {
        this.showModal('You have won!');
      }
    }
  }
  /*
  throwArrows(event: KeyboardEvent) {
    const matriz = this.matrixGenerated
    const direction = event.key;
    
    if (this.arrowCountChild > 0 ) {
      
      switch (direction) {
        case 'ArrowUp':
          if (this.user.row > 0 && matriz[this.user.row - 1][this.user.column] === 1 ) {
            matriz[this.user.row - 1][this.user.column] = 0;
            this.arrowInformationChild = 'You killed Wumpus ';
          } else { 
            this.arrowInformationChild = 'You have shot an arrow and missed the Wumpus!';
            
            
          }
          break;
        case 'ArrowDown':
          if (this.user.row < matriz.length - 1 && matriz[this.user.row + 1][this.user.column] === 1) {
            matriz[this.user.row + 1][this.user.column] = 0;
            this.arrowInformationChild = 'You killed Wumpus ';
          } else { 
            this.arrowInformationChild = 'You have shot an arrow and missed the Wumpus!';
            
            
          }
          break;
        case 'ArrowLeft':
          if (this.user.column > 0 && matriz[this.user.row][this.user.column - 1] === 1) {
            matriz[this.user.row][this.user.column - 1] = 0;
            this.arrowInformationChild = 'You killed Wumpus ';
          } else { 
            this.arrowInformationChild = 'You have shot an arrow and missed the Wumpus!';
            
            
          }
          
          break;
        case 'ArrowRight':
          if (this.user.column < this.matrixGenerated[0].length - 1 && matriz[this.user.row][this.user.column + 1] ===1 ) {
            matriz[this.user.row][this.user.column + 1] = 0;
            this.arrowInformationChild = 'You killed Wumpus ';
            
          } else { 
            this.arrowInformationChild = 'You have shot an arrow and missed the Wumpus!';
           
            
          }
          break;
        default:
          this.arrowInformationChild = 'Invalid direction';
      } 
       
    //Restamos una flecha
    this.gamePerceptionsService.setArrowState(this.arrowCountChild = this.arrowCountChild -1 ) 
    this.showArrowMessage = false
    } else {
      this.arrowInformationChild = 'You have run out of available arrows ';
    }
    //Actualizamos información al usuario
    this.gamePerceptionsService.setArrowInformationState(this.arrowInformationChild) 
    this.arrowButton = false;
    
   
  }*/
  changePlayerDirection(direction: string): void {
    this.playerDirection = direction;
  }

  getPlayerImage(): string {
    return `/assets/player.${this.playerDirection}.png`;
  }



}


