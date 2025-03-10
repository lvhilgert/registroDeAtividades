import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurmaComponent } from './turma.component';

describe('TurmaComponent', () => {
  let component: TurmaComponent;
  let fixture: ComponentFixture<TurmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurmaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
