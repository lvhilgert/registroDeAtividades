import { CommonModule } from '@angular/common';
import { Turma } from "./turma.model";

export interface Avaliacao {
        id: number;
        nome: string;
        anoVigente: number;
        turmaId: number;
        ativo: boolean;
        estado: number;
    }
