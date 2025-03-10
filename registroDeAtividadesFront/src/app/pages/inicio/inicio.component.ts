import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  constructor(private router: Router) {}

  irParaTurmas() {
    this.router.navigate(['/turma']);
  }

  irParaAlunos() {
    this.router.navigate(['/aluno']);
  }

  irParaAvaliacoes() {
    this.router.navigate(['/avaliacao']);
  }
}
