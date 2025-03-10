import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro-de-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastroDeUsuario.component.html',
  styleUrls: ['./cadastroDeUsuario.component.css']
})
export class CadastroDeUsuarioComponent {

  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  senhaVisivel = false;
  confirmarSenhaVisivel = false;
  mensagemErro = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  alternarVisibilidadeSenha() {
    this.senhaVisivel = !this.senhaVisivel;
  }

  alternarVisibilidadeConfirmarSenha() {
    this.confirmarSenhaVisivel = !this.confirmarSenhaVisivel;
}

  erros = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  limparMensagensErro() {
    this.erros = {
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    };
  }

  cadastrar() {
    this.limparMensagensErro();

    let erro = false;

    if (!this.nome.trim()) {
        this.erros.nome = 'Campo obrigatório.';
        erro = true;
    }

    if (!this.email.trim()) {
        this.erros.email = 'Campo obrigatório.';
        erro = true;
    }

    if (!this.senha.trim()) {
        this.erros.senha = 'Campo obrigatório.';
        erro = true;
    }

    if (!this.confirmarSenha.trim()) {
        this.erros.confirmarSenha = 'Campo obrigatório.';
        erro = true;
    }

    if (this.senha && this.confirmarSenha && this.senha !== this.confirmarSenha) {
        this.erros.confirmarSenha = 'As senhas não conferem.';
        erro = true;
    }

    if (erro) {
        return; // Se tem erro, para aqui.
    }

      this.usuarioService.cadastrarUsuario(this.nome, this.email, this.senha).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (erro) => {
          if (erro.status === 400 && erro.error?.mensagem === 'Usuário já cadastrado') {
            this.mensagemErro = 'Já existe um usuário com este e-mail.';
          } else {
            this.mensagemErro = 'Erro ao cadastrar. Tente novamente.';
          }
        }
      });
    }

  cancelar() {
    this.router.navigate(['/login']);
  }
}
