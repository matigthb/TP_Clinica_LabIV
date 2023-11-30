import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SoloNumerosDirective } from './solo-numeros.directive';

@Component({
  template: `<input appSoloNumeros>`
})
class TestComponent {}

describe('SoloNumerosDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoloNumerosDirective, TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    inputEl = fixture.debugElement.query(By.css('input'));

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new SoloNumerosDirective(inputEl);
    expect(directive).toBeTruthy();
  });
});