import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

describe('Common UI Components', () => {
  it('renders Button correctly and handles user click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Apply Now</Button>);

    const btn = screen.getByRole('button', { name: /apply now/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button during loading state', () => {
    render(<Button isLoading>Submitting</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('renders Badge with correct variant styling', () => {
    render(<Badge variant="success">Verified</Badge>);
    const badge = screen.getByText('Verified');
    expect(badge).toBeInTheDocument();
  });
});
