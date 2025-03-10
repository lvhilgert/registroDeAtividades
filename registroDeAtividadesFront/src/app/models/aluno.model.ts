import { CommonModule } from '@angular/common';
import { Turma } from "./turma.model";

export interface Aluno {
    id: number;
    nome: string;
    turmaId: number;
    turmaNome?: string;
    turmaSerie?: string; 
    anoVigente: number;
    ativo: boolean;
}

