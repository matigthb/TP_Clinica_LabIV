import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPacComponent } from './register-pac.component';

describe('RegisterPacComponent', () => {
  let component: RegisterPacComponent;
  let fixture: ComponentFixture<RegisterPacComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPacComponent]
    });
    fixture = TestBed.createComponent(RegisterPacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
