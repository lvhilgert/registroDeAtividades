import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAlunoComponent } from './cadastroAluno.component';

describe('CadastroAlunoComponent', () => {
  let component: CadastroAlunoComponent;
  let fixture: ComponentFixture<CadastroAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAlunoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
