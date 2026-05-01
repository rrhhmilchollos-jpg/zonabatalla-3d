import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainMenu } from '../src/components/MainMenu';

describe('MainMenu', () => {
  it('renders main menu heading', () => {
    render(<MainMenu />);
    const heading = screen.getByText(/Vortex Royale/i);
    expect(heading).toBeInTheDocument();
  });
});
