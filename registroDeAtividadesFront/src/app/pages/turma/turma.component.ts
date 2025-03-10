import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurmaService } from '../../services/turma.service';



@Component({
    selector: 'app-turmas',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './turma.component.html',
    styleUrls: ['./turma.component.css']
})
export class TurmaComponent implements OnInit {

    turmas: any[] = [];
    anos: number[] = [];
    anoSelecionado: number = new Date().getFullYear();

    constructor(private router: Router, private turmaService: TurmaService) {}

    ngOnInit() {
      if (typeof window !== 'undefined') {
          this.popularAnos();
          this.buscarTurmas();
      }
  }

    popularAnos() {
        const anoAtual = new Date().getFullYear();
        for (let ano = 2020; ano <= anoAtual + 3; ano++) {
            this.anos.push(ano);
        }
    }

    buscarTurmas() {
        this.turmaService.buscarTurmasPorAno(this.anoSelecionado).subscribe({
            next: (turmas) => this.turmas = turmas,
            error: () => alert('Erro ao buscar turmas.')
        });
    }

    irParaCadastroTurma() {
        this.router.navigate(['/cadastro-turma']);
    }

    editarTurma(turmaId: number) {
        this.router.navigate(['/cadastro-turma', turmaId]);
    }

    voltarParaInicio() {
        this.router.navigate(['/inicio']);
    }
    
  
}
