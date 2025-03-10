import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotaService } from '../../services/nota.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-nota',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './nota.component.html',
    styleUrls: ['./nota.component.css']
})
export class NotaComponent implements OnInit {
    avaliacaoId!: number;
    nomeAvaliacao = '';
    alunos: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private notaService: NotaService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.avaliacaoId = Number(this.route.snapshot.paramMap.get('avaliacaoId'));
        console.log('Id da avaliação!', this.avaliacaoId);
        this.carregarNotas();
    }

    carregarNotas() {
        this.notaService.buscarNotasPorAvaliacao(this.avaliacaoId).subscribe({
            next: (dados) => {
                this.alunos = dados;
                if (dados.length > 0) {
                    this.nomeAvaliacao = dados[0].nomeAvaliacao; // Define o nome da avaliação com base no primeiro retorno
                }
            },
            error: () => this.toastr.error('Erro ao carregar notas.', 'Erro')
        });
    }

    voltar() {
        this.router.navigate(['/avaliacao']);
    }
}
