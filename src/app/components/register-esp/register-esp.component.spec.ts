import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEspComponent } from './register-esp.component';

describe('RegisterEspComponent', () => {
  let component: RegisterEspComponent;
  let fixture: ComponentFixture<RegisterEspComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterEspComponent]
    });
    fixture = TestBed.createComponent(RegisterEspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
