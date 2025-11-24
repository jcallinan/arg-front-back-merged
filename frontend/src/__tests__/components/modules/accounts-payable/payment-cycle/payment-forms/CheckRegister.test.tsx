import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import CheckRegister from '@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/CheckRegister';

describe('CheckRegister (lightweight)', () => {
  it('renders success message and finalization hint', () => {
    render(<CheckRegister />);
    expect(screen.getByText(/Checks have Successfully Printed/i)).toBeInTheDocument();
    expect(screen.getByText(/Finalize/i)).toBeInTheDocument();
  });
});


