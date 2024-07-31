import { Routes } from '@angular/router';


export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'formpage', 
        pathMatch: 'full' 
    },
    { 
        path: 'gameboard', 
        loadComponent: () => import('./Components/game-board/game-board.component').then(m => m.GameBoardComponent)
    },
    { 
        path: 'formpage', 
        loadComponent: () => import('./Components/form-page/form-page.component').then(m => m.FormPageComponent)
    }
];