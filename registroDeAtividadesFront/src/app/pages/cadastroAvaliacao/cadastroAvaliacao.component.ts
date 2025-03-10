import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadastroAvaliacaoService } from '../../services/cadastroAvaliacao.service';
import { TurmaService } from '../../services/turma.service';
import { Avaliacao } from '../../models/avaliacao.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-avaliacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastroAvaliacao.component.html',
  styleUrls: ['./cadastroAvaliacao.component.css']
})
export class CadastroAvaliacaoComponent implements OnInit {

  avaliacao: Avaliacao = { 
    id: 0, 
    nome: '', 
    turmaId: 0, 
    anoVigente: new Date().getFullYear(), 
    ativo: true,
    estado: 0
  };
  avaliacaoId: number | null = null;
  anos: number[] = [];
  turmas: any[] = [];
  nomeErro: boolean = false;
  turmaErro: boolean = false;
  exibirConfirmacao = false; // Controla se o dialog está visível
  avaliacaoParaExcluir: number | null = null; // Guarda o id da avaliação para excluir

  estados = [
    { valor: 0, descricao: 'Aberta' },
    { valor: 1, descricao: 'Em andamento' },
    { valor: 2, descricao: 'Finalizada' }
  ];

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private cadastroAvaliacaoService: CadastroAvaliacaoService,
      private turmaService: TurmaService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
      this.popularAnos();
      this.avaliacaoId = Number(this.route.snapshot.paramMap.get('id'));

      if (this.avaliacaoId) {
          this.carregarAvaliacao();
      }

      this.carregarTurmas();
  }

  popularAnos() {
      const anoAtual = new Date().getFullYear();
      for (let ano = 2020; ano <= anoAtual + 3; ano++) {
          this.anos.push(ano);
      }
  }

  carregarTurmas() {
      this.turmaService.buscarTurmasPorAno(this.avaliacao.anoVigente).subscribe({
          next: turmas => this.turmas = turmas,
          error: () => this.toastr.error('Erro ao carregar turmas.', 'Erro')
      });
  }

  carregarAvaliacao() {
      this.cadastroAvaliacaoService.buscarAvaliacaoPorId(this.avaliacaoId!).subscribe({
          next: avaliacao => this.avaliacao = avaliacao,
          error: () => this.toastr.error('Erro ao carregar avaliação.', 'Erro')
      });
  }

  salvar() {
      this.validarCampos();

      if (this.nomeErro || this.turmaErro) {
          return;
      }

      this.cadastroAvaliacaoService.salvarAvaliacao(this.avaliacao).subscribe({
          next: () => {
              this.toastr.success('Avaliação salva com sucesso!', 'Sucesso');
              this.router.navigate(['/avaliacao']);
          },
          error: () => this.toastr.error('Erro ao salvar avaliação.', 'Erro')
      });
  }

  excluir() {
      this.exibirConfirmacao = true;
  }

  fecharDialog() {
      this.exibirConfirmacao = false;
  }

  confirmarExclusao() {
      if (this.avaliacao.id) {
          this.cadastroAvaliacaoService.excluirAvaliacao(this.avaliacao.id).subscribe({
              next: () => {
                  this.toastr.success('Avaliação excluída com sucesso!', 'Sucesso');
                  this.router.navigate(['/avaliacao']);
              },
              error: (err) => {
                  console.error('Erro ao excluir avaliação:', err);
                  this.toastr.error(err.error?.mensagem || 'Erro ao excluir avaliação.', 'Erro');
              }
          });
      }
      this.fecharDialog();
  }

  validarCampos() {
      this.nomeErro = !this.avaliacao.nome.trim();
      this.turmaErro = !this.avaliacao.turmaId;
  }

  cancelar() {
      this.router.navigate(['/avaliacao']);
  }
}
