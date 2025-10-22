import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { AuthProvider } from '../../../context/AuthContext';
import { I18nProvider } from '../../../context/I18nContext';

const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </I18nProvider>
);

describe('LoginForm Component', () => {
  const mockOnSwitchToRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <MockWrapper>
        <LoginForm onSwitchToRegister={mockOnSwitchToRegister} />
      </MockWrapper>
    );

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <MockWrapper>
        <LoginForm onSwitchToRegister={mockOnSwitchToRegister} />
      </MockWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // Form should not submit without required fields
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInvalid();
  });

  it('toggles password visibility', () => {
    render(
      <MockWrapper>
        <LoginForm onSwitchToRegister={mockOnSwitchToRegister} />
      </MockWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const toggleButton = screen.getByLabelText(/toggle password visibility/i) || 
                        passwordInput.parentElement?.querySelector('button');

    expect(passwordInput).toHaveAttribute('type', 'password');

    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });

  it('calls onSwitchToRegister when register link is clicked', () => {
    render(
      <MockWrapper>
        <LoginForm onSwitchToRegister={mockOnSwitchToRegister} />
      </MockWrapper>
    );

    const registerLink = screen.getByText(/register here/i);
    fireEvent.click(registerLink);

    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it('shows demo credentials', () => {
    render(
      <MockWrapper>
        <LoginForm onSwitchToRegister={mockOnSwitchToRegister} />
      </MockWrapper>
    );

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/alice\.smith@university\.edu/i)).toBeInTheDocument();
  });
});