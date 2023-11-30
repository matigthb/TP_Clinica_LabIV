import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsUsuarioComponent } from './logs-usuario.component';

describe('LogsUsuarioComponent', () => {
  let component: LogsUsuarioComponent;
  let fixture: ComponentFixture<LogsUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogsUsuarioComponent]
    });
    fixture = TestBed.createComponent(LogsUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
