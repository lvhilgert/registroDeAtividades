import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtividadeAlunoService } from '../../services/atividadeAluno.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-atividade-aluno',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './atividadeAluno.component.html',
    styleUrls: ['./atividadeAluno.component.css']
})
export class AtividadeAlunoComponent implements OnInit {
    atividadeId!: number;
    nomeAtividade = '';
    alunos: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private atividadeAlunoService: AtividadeAlunoService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.atividadeId = Number(this.route.snapshot.paramMap.get('atividadeId'));
        this.carregarAlunos();
        this.carregarNomeAtividade();
    }

    carregarNomeAtividade() {
      this.atividadeAlunoService.buscarNomeAtividade(this.atividadeId).subscribe({
          next: (dados) => this.nomeAtividade = dados.nome,
          error: () => this.toastr.error('Erro ao carregar nome da atividade.', 'Erro')
      });
  }

    carregarAlunos() {
        this.atividadeAlunoService.buscarAlunosComNotas(this.atividadeId).subscribe({
            next: (dados) => this.alunos = dados,
            error: () => this.toastr.error('Erro ao carregar alunos e notas.', 'Erro')
        });
    }

    atualizarNota(aluno: any) {
      this.atividadeAlunoService.salvarNota(aluno.atividadeAlunoId, this.atividadeId, aluno.alunoId, aluno.nota)
          .subscribe({
              next: (resposta) => {
                  this.toastr.success('Nota salva com sucesso!');
                  
                  // Se for um novo registro, atualiza o ID correto na lista
                  if (!aluno.atividadeAlunoId) {
                      aluno.atividadeAlunoId = resposta.id; 
                  }
              },
              error: () => this.toastr.error('Erro ao salvar nota.', 'Erro')
          });
  }

    getNotaDescricao(nota: number): string {
        return nota === 0 ? 'NA' : nota === 1 ? 'AP' : 'A';
    }

    voltar() {
        this.router.navigate(['/avaliacao']);
    }
}
