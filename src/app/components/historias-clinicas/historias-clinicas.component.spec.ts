import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriasClinicasComponent } from './historias-clinicas.component';

describe('HistoriasClinicasComponent', () => {
  let component: HistoriasClinicasComponent;
  let fixture: ComponentFixture<HistoriasClinicasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriasClinicasComponent]
    });
    fixture = TestBed.createComponent(HistoriasClinicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
