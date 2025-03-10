import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvaliacaoService } from '../../services/avaliacao.service';
import { TurmaService } from '../../services/turma.service';
import { Avaliacao } from '../../models/avaliacao.model';
import { Atividade } from '../../models/atividade.model';

@Component({
    selector: 'app-avaliacao',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './avaliacao.component.html',
    styleUrls: ['./avaliacao.component.css']
})
export class AvaliacaoComponent implements OnInit {

    anos: number[] = [];
    anoSelecionado = new Date().getFullYear();
    turmas: any[] = [];
    turmaSelecionada: number | null = null;
    avaliacoes: any[] = [];

    // Controle de expandir/retrair atividades
    avaliacoesExpandidas: { [key: number]: boolean } = {};

    constructor(private router: Router, private avaliacaoService: AvaliacaoService, private turmaService: TurmaService) {}

    ngOnInit() {
        this.popularAnos();
        this.carregarTurmas();
        this.buscarAvaliacoes();
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
                this.buscarAvaliacoes();
            },
            error: () => alert('Erro ao carregar turmas.')
        });
    }

    buscarAvaliacoes() {
        const turmaId = this.turmaSelecionada ?? undefined;
        this.avaliacaoService.buscarAvaliacoesComAtividades(this.anoSelecionado, turmaId).subscribe({
            next: avaliacoes => this.avaliacoes = avaliacoes,
            error: () => alert('Erro ao carregar avaliações.')
        });
    }

    toggleExpandir(avaliacao: any, event: Event) {
      event.stopPropagation(); // Impede que o clique no ícone afete a linha da avaliação
      avaliacao.expandida = !avaliacao.expandida;
  }
  
  editarAvaliacao(avaliacaoId: number) {
      this.router.navigate(['/cadastro-avaliacao', avaliacaoId]);
  }
  
  adicionarAtividade(avaliacaoId: number) {
    this.router.navigate(['/cadastro-atividade', avaliacaoId]);
}

  editarAtividade(avaliacaoId: number, atividadeId: number) {
      this.router.navigate(['/cadastro-atividade', avaliacaoId, atividadeId]);
  }
  

    irParaCadastroAvaliacao() {
        this.router.navigate(['/cadastro-avaliacao']);
    }

    irParaAlunoAtividade(atividadeId: number){
      this.router.navigate(['/atividade-aluno', atividadeId]);
    }

    voltarParaInicio() {
        this.router.navigate(['/inicio']);
    }

    irParaNota(avaliacaoId: number){
      this.router.navigate(['/nota', avaliacaoId]);
    }
}
