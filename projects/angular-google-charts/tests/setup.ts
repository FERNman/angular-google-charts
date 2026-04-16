import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import JasmineDOM from '@testing-library/jasmine-dom';

beforeAll(() => {
  jasmine.addMatchers(JasmineDOM);
});

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
