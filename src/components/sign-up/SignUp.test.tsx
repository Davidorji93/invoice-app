// Signup.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';
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

describe('Signup', () => {
  const mockCreateUser = jest.fn();
  const mockUserLoggedIn = false;

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ userLoggedIn: mockUserLoggedIn });
    jest.clearAllMocks();
  });

  test('renders the signup form', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByText(/Create a New Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  test('allows users to fill in the form and submits successfully', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      userLoggedIn: mockUserLoggedIn,
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Mock the function to simulate successful registration
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(toast.success).toHaveBeenCalledWith("Account created successfully!");
    });
  });

  test('displays error message on registration failure', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      userLoggedIn: mockUserLoggedIn,
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    // Simulate a failed registration
    mockCreateUser.mockImplementationOnce(() => {
      throw new Error("User already exists");
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("User already exists");
    });
  });

  test('redirects if user is already logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({ userLoggedIn: true });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Create a New Account/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
  });
});
