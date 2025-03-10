import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlunoService } from '../../services/aluno.service';
import { TurmaService } from '../../services/turma.service';
import { Aluno } from '../../models/aluno.model';
import { Turma } from '../../models/turma.model';

@Component({
    selector: 'app-aluno',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './aluno.component.html',
    styleUrls: ['./aluno.component.css']
})
export class AlunoComponent implements OnInit {

    anos: number[] = [];
    anoSelecionado = new Date().getFullYear();
    turmas: Turma[] = [];
    turmaSelecionada: number | null = null;

    alunos: Aluno[] = [];  // Atualizado para ter os campos novos (turmaNome e turmaSerie)

    constructor(private router: Router, private alunoService: AlunoService, private turmaService: TurmaService) {}

    ngOnInit() {
        this.popularAnos();
        this.carregarTurmas();
        this.buscarAlunos();
    }

    popularAnos() {
        const anoAtual = new Date().getFullYear();
        for (let ano = 2020; ano <= anoAtual + 3; ano++) {
            this.anos.push(ano);
        }
    }

    carregarTurmas() {
        this.turmaService.buscarTurmasPorAno(this.anoSelecionado).subscribe({
            next: turmas => {
                this.turmas = turmas;
                this.buscarAlunos();  // Recarrega alunos após carregar turmas
            },
            error: () => alert('Erro ao carregar turmas.')
        });
    }

    buscarAlunos() {
        const turmaId = this.turmaSelecionada ?? undefined;  // Corrige null para undefined
        this.alunoService.buscarAlunos(this.anoSelecionado, turmaId).subscribe({
            next: alunos => this.alunos = alunos,
            error: () => alert('Erro ao carregar alunos.')
        });
    }

    irParaCadastroAluno() {
        this.router.navigate(['/cadastro-aluno']);
    }

    editarAluno(alunoId: number) {
      this.router.navigate(['/cadastro-aluno', alunoId]);
  }

    voltarParaInicio() {
        this.router.navigate(['/inicio']);
    }
}
