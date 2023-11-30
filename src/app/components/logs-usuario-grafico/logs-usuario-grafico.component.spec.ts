import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsUsuarioGraficoComponent } from './logs-usuario-grafico.component';

describe('LogsUsuarioGraficoComponent', () => {
  let component: LogsUsuarioGraficoComponent;
  let fixture: ComponentFixture<LogsUsuarioGraficoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogsUsuarioGraficoComponent]
    });
    fixture = TestBed.createComponent(LogsUsuarioGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
