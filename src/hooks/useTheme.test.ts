import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useTheme } from './useTheme';

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  });
};

beforeEach(() => {
  localStorage.clear();
  mockMatchMedia(false); // default: system is light
});

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
});

describe('useTheme', () => {
  test('defaults to light when no stored preference and system is light', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  test('defaults to dark when system prefers dark and no stored preference', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  test('respects stored localStorage preference over system preference', () => {
    mockMatchMedia(true); // system dark
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  test('sets data-theme attribute on documentElement', () => {
    const { result } = renderHook(() => useTheme());
    expect(document.documentElement.dataset.theme).toBe(result.current.theme);
  });

  test('toggle switches from light to dark', () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.toggle(); });
    expect(result.current.theme).toBe('dark');
  });

  test('toggle switches from dark to light', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.toggle(); });
    expect(result.current.theme).toBe('light');
  });

  test('persists theme to localStorage on toggle', () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.toggle(); });
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('updates data-theme attribute on toggle', () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.toggle(); });
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
