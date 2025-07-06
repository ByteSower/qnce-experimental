// Jest setup file for testing environment
import '@testing-library/jest-dom';

// Mock browser APIs that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Document Visibility API
let mockVisibilityState = 'visible';
Object.defineProperty(document, 'visibilityState', {
  get() { return mockVisibilityState; },
  configurable: true
});

Object.defineProperty(document, 'hidden', {
  get() { return mockVisibilityState === 'hidden'; },
  configurable: true
});

// Helper to control visibility in tests
(global as any).setDocumentVisibility = (state: 'visible' | 'hidden') => {
  mockVisibilityState = state;
  document.dispatchEvent(new Event('visibilitychange'));
};

// Reset visibility to visible before each test
beforeEach(() => {
  mockVisibilityState = 'visible';
});
