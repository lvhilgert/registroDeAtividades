import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadastroTurmaService } from '../../services/cadastroTurma.service';
import { Turma } from '../../models/turma.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-cadastro-turma',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cadastroTurma.component.html',
    styleUrls: ['./cadastroTurma.component.css']
})
export class CadastroTurmaComponent implements OnInit {

  turma: Turma = { id: 0, nome: '', serie: '', anoVigente: new Date().getFullYear(), ativo: true };
  turmaId: number | null = null;
  anos: number[] = [];
  series: string[] = [
      '1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano',
      '1º ano ensino médio', '2º ano ensino médio', '3º ano ensino médio'
  ];
  nomeErro: boolean = false;
  serieErro: boolean = false;
  exibirConfirmacao = false; // Controla se o dialog está visível
  turmaParaExcluir: number | null = null; // Guarda o id da turma para excluir

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private cadastroTurmaService: CadastroTurmaService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
      this.popularAnos();

      const idParam = this.route.snapshot.paramMap.get('id');
      this.turmaId = idParam ? Number(idParam) : null;

      if (this.turmaId) {
          this.carregarTurma();
      }
  }

  popularAnos() {
      const anoAtual = new Date().getFullYear();
      for (let ano = 2020; ano <= anoAtual + 3; ano++) {
          this.anos.push(ano);
      }
  }

  carregarTurma() {
      this.cadastroTurmaService.buscarTurmaPorId(this.turmaId!).subscribe({
          next: (turma) => this.turma = turma,
          error: () => this.toastr.error('Erro ao carregar turma.', 'Erro')
      });
  }

  salvar() {
      this.validarCampos();

      if (this.nomeErro || this.serieErro) {
          return;
      }

      this.cadastroTurmaService.salvarTurma(this.turma).subscribe({
          next: () => {
              this.toastr.success('Turma salva com sucesso!');
              this.router.navigate(['/turma']);
          },
          error: (err) => {
              console.error('Erro ao salvar turma:', err);
              this.toastr.error('Erro ao salvar turma.', 'Erro');
          }
      });
  }

  excluir() {
    this.exibirConfirmacao = true;
}

  fecharDialog() {
      this.exibirConfirmacao = false;
  }

  confirmarExclusao() {
      if (this.turma.id) {
          this.cadastroTurmaService.excluirTurma(this.turma.id).subscribe({
              next: () => {
                  this.toastr.success('Turma excluída com sucesso!');
                  this.router.navigate(['/turma']);
              },
              error: (err) => {
                  console.error('Erro ao excluir turma:', err);
                  this.toastr.error(err.error?.mensagem || 'Erro ao excluir turma.', 'Erro');
              }
          });
      }
      this.fecharDialog();
  }


  validarCampos() {
      this.nomeErro = !this.turma.nome.trim();
      this.serieErro = !this.turma.serie.trim();
  }

  cancelar() {
      this.router.navigate(['/turma']);
  }
}
