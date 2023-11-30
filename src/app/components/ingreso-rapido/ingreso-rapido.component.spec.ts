import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoRapidoComponent } from './ingreso-rapido.component';

describe('IngresoRapidoComponent', () => {
  let component: IngresoRapidoComponent;
  let fixture: ComponentFixture<IngresoRapidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresoRapidoComponent]
    });
    fixture = TestBed.createComponent(IngresoRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
