import { CommonModule } from '@angular/common';

export interface Atividade {
    id: number;
    nome: string;
    avaliacaoId: number;
    ativo: boolean;
    estado: number;
}
