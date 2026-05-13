import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/store/appStore';

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.getState().reset();
  });

  it('should initialize with default values', () => {
    const state = useAppStore.getState();
    expect(state.sessionId).toBe(null);
    expect(state.uploadedFile).toBe(null);
    expect(state.messages).toEqual([]);
    expect(state.activeTab).toBe('summary');
  });

  it('should update active tab', () => {
    const { setActiveTab } = useAppStore.getState();
    setActiveTab('challenge');
    expect(useAppStore.getState().activeTab).toBe('challenge');
  });

  it('should add messages', () => {
    const { addMessage } = useAppStore.getState();
    const msg = { id: '1', text: 'hello', sender: 'user' as const, timestamp: new Date() };
    addMessage(msg);
    expect(useAppStore.getState().messages).toHaveLength(1);
    expect(useAppStore.getState().messages[0].text).toBe('hello');
  });

  it('should reset state', () => {
    const { setActiveTab, reset } = useAppStore.getState();
    setActiveTab('challenge');
    reset();
    expect(useAppStore.getState().activeTab).toBe('summary');
    expect(useAppStore.getState().uploadedFile).toBe(null);
  });
});
