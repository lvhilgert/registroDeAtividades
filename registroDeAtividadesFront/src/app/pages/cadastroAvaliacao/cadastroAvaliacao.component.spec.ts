import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAvaliacaoComponent } from './cadastroAvaliacao.component';

describe('CadastroAvaliacaoComponent', () => {
  let component: CadastroAvaliacaoComponent;
  let fixture: ComponentFixture<CadastroAvaliacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAvaliacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
