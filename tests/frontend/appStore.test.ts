import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/store/appStore';

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.getState().reset();
  });

  it('should initialize with default values', () => {
    const state = useAppStore.getState();
    expect(state.sessionId).toBe(null);
    expect(state.uploadedFiles).toBe(null);
    expect(state.messages).toEqual([]);
    expect(state.activeTab).toBe('summary');
  });

  it('should update active tab', () => {
    const { setActiveTab } = useAppStore.getState();
    setActiveTab('synthesis');
    expect(useAppStore.getState().activeTab).toBe('synthesis');
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
    setActiveTab('synthesis');
    reset();
    expect(useAppStore.getState().activeTab).toBe('summary');
    expect(useAppStore.getState().uploadedFiles).toBe(null);
  });
});
