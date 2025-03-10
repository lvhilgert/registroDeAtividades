import { CommonModule } from '@angular/common';

export interface Turma {
    id: number;
    nome: string;
    serie: string;
    anoVigente: number;
    ativo: boolean;
}
