import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAdmComponent } from './register-adm.component';

describe('RegisterAdmComponent', () => {
  let component: RegisterAdmComponent;
  let fixture: ComponentFixture<RegisterAdmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterAdmComponent]
    });
    fixture = TestBed.createComponent(RegisterAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
