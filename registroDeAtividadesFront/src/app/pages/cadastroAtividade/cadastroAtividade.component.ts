import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadastroAtividadeService } from '../../services/cadastroAtividade.service';
import { CadastroAvaliacaoService } from '../../services/cadastroAvaliacao.service';
import { Atividade } from '../../models/atividade.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-atividade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastroAtividade.component.html',
  styleUrls: ['./cadastroAtividade.component.css']
})
export class CadastroAtividadeComponent implements OnInit {

  atividade: Atividade = { 
    id: 0, 
    nome: '', 
    avaliacaoId: 0, 
    ativo: true,
    estado: 0
  };

  atividadeId: number | null = null;
  avaliacaoId: number = 0;
  avaliacaoNome: string = ''; // Nome da avaliação para exibir no input
  nomeErro: boolean = false;
  exibirConfirmacao = false; // Controla se o dialog está visível
  estados = [
    { valor: 0, descricao: 'Aberta' },
    { valor: 1, descricao: 'Em andamento' },
    { valor: 2, descricao: 'Finalizada' }
  ];

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private cadastroAtividadeService: CadastroAtividadeService,
      private cadastroAvaliacaoService: CadastroAvaliacaoService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.avaliacaoId = Number(this.route.snapshot.paramMap.get('avaliacaoId'));
    this.atividadeId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.avaliacaoId) {
        this.buscarAvaliacao();  // Buscar a avaliação para exibir o nome no campo desabilitado
    }

    if (this.atividadeId && this.atividadeId > 0) {
        this.carregarAtividade();  // Buscar a atividade caso seja edição
    }
}

  buscarAvaliacao() {
      this.cadastroAvaliacaoService.buscarAvaliacaoPorId(this.avaliacaoId).subscribe({
          next: avaliacao => {
              this.avaliacaoNome = avaliacao.nome;
              this.atividade.avaliacaoId = avaliacao.id;
          },
          error: () => this.toastr.error('Erro ao carregar avaliação.', 'Erro')
      });
  }

  carregarAtividade() {
      this.cadastroAtividadeService.buscarAtividadePorId(this.atividadeId!).subscribe({
          next: atividade => this.atividade = atividade,
          error: () => this.toastr.error('Erro ao carregar atividade.', 'Erro')
      });
  }

  salvar() {
      this.validarCampos();

      if (this.nomeErro) {
          return;
      }

      this.cadastroAtividadeService.salvarAtividade(this.atividade).subscribe({
          next: () => {
              this.toastr.success('Atividade salva com sucesso!', 'Sucesso');
              this.router.navigate(['/avaliacao']);
          },
          error: () => this.toastr.error('Erro ao salvar atividade.', 'Erro')
      });
  }

  excluir() {
    this.exibirConfirmacao = true;
}

  fecharDialog() {
      this.exibirConfirmacao = false;
  }

  confirmarExclusao() {
      if (this.atividade.id) {
          this.cadastroAtividadeService.excluirAtividade(this.atividade.id).subscribe({
              next: () => {
                  this.toastr.success('Atividade excluída com sucesso!');
                  this.router.navigate(['/avaliacao']);
              },
              error: (err) => {
                  console.error('Erro ao atividade turma:', err);
                  this.toastr.error(err.error?.mensagem || 'Erro ao atividade turma.', 'Erro');
              }
          });
      }
      this.fecharDialog();
  }

  validarCampos() {
      this.nomeErro = !this.atividade.nome.trim();
  }

  cancelar() {
      this.router.navigate(['/avaliacao']);
  }
}
