import { ResaltarDirective } from './resaltar.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('ResaltarDirective', () => {
  it('should create an instance', () => {
    const elMock = {} as ElementRef;
    const rendererMock = {} as Renderer2;

    const directive = new ResaltarDirective(elMock, rendererMock);
    expect(directive).toBeTruthy();
  });
});