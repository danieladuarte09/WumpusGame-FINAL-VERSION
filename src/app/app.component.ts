import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameBoardComponent } from "./Components/game-board/game-board.component";
import { FormPageComponent } from "./Components/form-page/form-page.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, GameBoardComponent, FormPageComponent]
})
export class AppComponent {
  title = 'wumpusGame';
}
