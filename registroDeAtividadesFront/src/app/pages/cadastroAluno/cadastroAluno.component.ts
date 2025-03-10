import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadastroAlunoService } from '../../services/cadastroAluno.service';
import { TurmaService } from '../../services/turma.service';
import { Aluno } from '../../models/aluno.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastroAluno.component.html',
  styleUrls: ['./cadastroAluno.component.css']
})
export class CadastroAlunoComponent implements OnInit {

  aluno: Aluno = { 
    id: 0, 
    nome: '', 
    turmaId: 0, 
    turmaNome: '', 
    turmaSerie: '', 
    anoVigente: new Date().getFullYear(), 
    ativo: true 
  };

  alunoId: number | null = null;
  nomesInput: string = ''; // 🔹 Adicionando a propriedade correta
  anos: number[] = [];
  turmas: any[] = [];
  nomeErro: boolean = false;
  turmaErro: boolean = false;
  exibirConfirmacao = false;
  alunoParaExcluir: number | null = null;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private cadastroAlunoService: CadastroAlunoService,
      private turmaService: TurmaService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.popularAnos();
    this.alunoId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.alunoId && this.alunoId > 0) {  // ✅ Só busca se for um ID válido
        this.carregarAluno();
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
      this.turmaService.buscarTurmasPorAno(this.aluno.anoVigente).subscribe({
          next: turmas => this.turmas = turmas,
          error: () => this.toastr.error('Erro ao carregar turmas.', 'Erro')
      });
  }

  

carregarAluno() {
    if (!this.alunoId || this.alunoId <= 0) return; // ✅ Garante que só chama se tiver ID válido

    this.cadastroAlunoService.buscarAlunoPorId(this.alunoId).subscribe({
        next: (aluno) => {
            if (aluno) {
                this.aluno = aluno;
                this.nomesInput = aluno.nome; // ✅ Preenche o campo de nome ao editar
            } else {
                this.toastr.error('Aluno não encontrado.', 'Erro');
            }
        },
        error: () => this.toastr.error('Erro ao carregar aluno.', 'Erro')
    });
}


  salvar() {
    this.validarCampos();

    if (this.nomeErro || this.turmaErro) {
        return;
    }

    const nomes = this.nomesInput.split(/[,;\n]/)
        .map(nome => nome.trim())
        .filter(nome => nome.length > 0);

    if (nomes.length === 0) {
        this.toastr.warning('Nenhum nome válido inserido.', 'Aviso');
        return;
    }

    let alunosNaoCadastrados: string[] = [];
    let alunosParaCadastrar: { nome: string, turmaId: number, anoVigente: number, ativo: boolean }[] = [];

    let totalVerificacoes = 0;
    let totalRespostas = 0;

    nomes.forEach(nome => {
        totalVerificacoes++;
        this.cadastroAlunoService.verificarAlunoExistente(nome, this.aluno.turmaId).subscribe({
            next: (resposta) => {
                totalRespostas++;
                if (resposta.existe) {
                    alunosNaoCadastrados.push(nome);
                } else {
                    alunosParaCadastrar.push({ 
                        nome, 
                        turmaId: this.aluno.turmaId, 
                        anoVigente: this.aluno.anoVigente,  // ✅ Agora sempre envia anoVigente!
                        ativo: this.aluno.ativo 
                    });
                }

                if (totalRespostas === totalVerificacoes) {
                    if (alunosParaCadastrar.length > 0) {
                        this.cadastroAlunoService.salvarVariosAlunos(alunosParaCadastrar).subscribe({
                            next: () => {
                                this.toastr.success(`${alunosParaCadastrar.length} aluno(s) salvo(s) com sucesso!`, 'Sucesso');
                                if (alunosNaoCadastrados.length > 0) {
                                    this.toastr.info(`Os seguintes alunos já existiam e não foram cadastrados: ${alunosNaoCadastrados.join(', ')}`, 'Aviso');
                                }
                                this.router.navigate(['/aluno']);
                            },
                            error: () => this.toastr.error('Erro ao cadastrar alunos.', 'Erro')
                        });
                    } else {
                        this.toastr.info(`Nenhum aluno foi cadastrado, pois todos já existiam.`, 'Aviso');
                    }
                }
            },
            error: () => {
                this.toastr.error('Erro ao verificar aluno existente.', 'Erro');
            }
        });
    });
    }



  excluir() {
      this.exibirConfirmacao = true;
  }

  fecharDialog() {
      this.exibirConfirmacao = false;
  }

  confirmarExclusao() {
      if (this.aluno.id) {
          this.cadastroAlunoService.excluirAluno(this.aluno.id).subscribe({
              next: () => {
                  this.toastr.success('Aluno excluído com sucesso!');
                  this.router.navigate(['/aluno']);
              },
              error: (err) => {
                  console.error('Erro ao excluir aluno:', err);
                  this.toastr.error(err.error?.mensagem || 'Erro ao excluir aluno.', 'Erro');
              }
          });
      }
      this.fecharDialog();
  }

  validarCampos() {
      this.nomeErro = !this.nomesInput.trim();
      this.turmaErro = !this.aluno.turmaId;
  }

  cancelar() {
      this.router.navigate(['/aluno']);
  }
}
