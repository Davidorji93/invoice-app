
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../../context/auth-context';
import { toast } from 'react-toastify';

// Mock the useAuth hook
jest.mock('../../context/auth-context', () => ({
  useAuth: jest.fn(),
}));

// Mock the toast notification
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Login', () => {
  const mockSignIn = jest.fn();
  const mockUserLoggedIn = false;

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ userLoggedIn: mockUserLoggedIn });
    jest.clearAllMocks();
  });

  test('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('allows users to fill in the form and submit successfully', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Mock the function to simulate successful login
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(toast.success).toHaveBeenCalledWith("Login successful!");
    });
  });

  test('displays error message on login failure', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });

    // Simulate a failed login
    mockSignIn.mockImplementationOnce(() => {
      throw new Error("Invalid credentials");
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to sign in. Please try again./i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("Login failed. Please check your credentials.");
    });
  });

  test('redirects if user is already logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ userLoggedIn: true });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Welcome Back/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });
});
