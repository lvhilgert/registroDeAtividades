import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDeUsuarioComponent } from './cadastroDeUsuario.component';

describe('CadastroDeUsuarioComponent', () => {
  let component: CadastroDeUsuarioComponent;
  let fixture: ComponentFixture<CadastroDeUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDeUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDeUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
