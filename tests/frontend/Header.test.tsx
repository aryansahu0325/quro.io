import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../../src/components/layout/Header';
import { BrowserRouter } from 'react-router-dom';

// Mock the store
vi.mock('../../src/store/appStore', () => ({
  useAppStore: () => ({
    uploadedFile: null,
    reset: vi.fn(),
    setIsModalOpen: vi.fn(),
  }),
}));

describe('Header', () => {
  it('renders the logo correctly', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText(/quro/i)).toBeInTheDocument();
    expect(screen.getByText(/quro/i).textContent).toMatch(/quro\.io/i);
  });

  it('renders the sign in button', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('renders the deploy button', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText(/deploy/i)).toBeInTheDocument();
  });
});
