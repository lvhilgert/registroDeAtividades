import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadeAlunoComponent } from './atividadeAluno.component';

describe('AtividadeAlunoComponent', () => {
  let component: AtividadeAlunoComponent;
  let fixture: ComponentFixture<AtividadeAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtividadeAlunoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtividadeAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
