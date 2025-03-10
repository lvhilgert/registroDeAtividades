import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroDeUsuarioComponent } from './pages/cadastroDeUsuario/cadastroDeUsuario.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AlunoComponent } from './pages/aluno/aluno.component';
import { CadastroAlunoComponent } from './pages/cadastroAluno/cadastroAluno.component';
import { RecuperarSenhaComponent } from './pages/recuperarSenha/recuperarSenha.component';
import { AvaliacaoComponent } from './pages/avaliacao/avaliacao.component';
import { CadastroAvaliacaoComponent } from './pages/cadastroAvaliacao/cadastroAvaliacao.component';
import { TurmaComponent } from './pages/turma/turma.component';
import { CadastroTurmaComponent } from './pages/cadastroTurma/cadastroTurma.component';
import { CadastroAtividadeComponent } from './pages/cadastroAtividade/cadastroAtividade.component';
import { AtividadeAlunoComponent } from './pages/atividadeAluno/atividadeAluno.component';
import { NotaComponent } from './pages/nota/nota.component';

export const routes: Routes = [
   // Login:
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'cadastro-usuario', component: CadastroDeUsuarioComponent},
  { path: 'inicio', component: InicioComponent },
   // Aluno
  { path: 'aluno', component: AlunoComponent },
  { path: 'cadastro-aluno', component: CadastroAlunoComponent },
  { path: 'cadastro-aluno/:id', component: CadastroAlunoComponent },
   // Avaliação
  { path: 'avaliacao', component: AvaliacaoComponent },
  { path: 'cadastro-avaliacao', component: CadastroAvaliacaoComponent },
  { path: 'cadastro-avaliacao/:id', component: CadastroAvaliacaoComponent },
    // Turma
  { path: 'turma', component: TurmaComponent },
  { path: 'cadastro-turma', component: CadastroTurmaComponent },
  { path: 'cadastro-turma/:id', component: CadastroTurmaComponent },
   // Atividade
  { path: 'cadastro-atividade', component: CadastroAtividadeComponent },
  { path: 'cadastro-atividade/:avaliacaoId', component: CadastroAtividadeComponent },
  { path: 'cadastro-atividade/:avaliacaoId/:id', component: CadastroAtividadeComponent },
  // Aluno x atividade
  { path: 'atividade-aluno', component: AtividadeAlunoComponent },
  { path: 'atividade-aluno/:atividadeId', component: AtividadeAlunoComponent },

  // Nota
  { path: 'nota/:avaliacaoId', component: NotaComponent }
];


/* r.registrodeatividades@gmail.com "TuTubarao123" "tvqx vdbd cgpl kqhu" */