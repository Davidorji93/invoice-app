
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InvoiceOverview from "./InvoiceOverview"; 
import { useAuth } from "../../context/auth-context"; 
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";
import '@testing-library/jest-dom';

// Mocking useAuth context
jest.mock("../../context/auth-context");

const mockAxios = new MockAdapter(axios);

describe("InvoiceOverview", () => {
  const mockUser = { displayName: "John Doe" };

  beforeEach(() => {
    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    // Clear previous mocks
    mockAxios.reset();
  });

  test("renders loading state", () => {
    render(<InvoiceOverview />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("displays invoices and activities after fetching", async () => {
    // Mocking axios responses
    mockAxios
      .onGet("http://localhost:5000/invoices")
      .reply(200, [
        { id: "1", dueDate: "2024-10-10", amount: "100", status: "Paid", dateGroup: "October" },
        { id: "2", dueDate: "2024-10-12", amount: "200", status: "Overdue", dateGroup: "October" },
      ]);

    mockAxios
      .onGet("http://localhost:5000/activities")
      .reply(200, [
        { avatar: "avatar1.png", name: "User 1", time: "10 mins ago", description: "Created invoice #1" },
        { avatar: "avatar2.png", name: "User 2", time: "15 mins ago", description: "Paid invoice #1" },
      ]);

    render(<InvoiceOverview />);

    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());

    expect(screen.getByText("Recent Invoices")).toBeInTheDocument();
    expect(screen.getByText("Invoice #1")).toBeInTheDocument();
    expect(screen.getByText("Invoice #2")).toBeInTheDocument();
    expect(screen.getByText("Recent Activities")).toBeInTheDocument();
    expect(screen.getByText("Created invoice #1")).toBeInTheDocument();
  });

  test("handles logout", async () => {
    const mockSignOut = jest.fn().mockResolvedValueOnce(undefined);
    (useAuth as jest.Mock).mockReturnValueOnce({ user: mockUser, signOut: mockSignOut });

    render(<InvoiceOverview />);

    // Open user dropdown
    fireEvent.click(screen.getByRole("button", { name: /JD/i }));

    // Click on logout
    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => expect(mockSignOut).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith("Successfully logged out!");
  });

  test("opens and closes invoice details modal", async () => {
    mockAxios
      .onGet("http://localhost:5000/invoices")
      .reply(200, [{ id: "1", dueDate: "2024-10-10", amount: "100", status: "Paid", dateGroup: "October" }]);

    render(<InvoiceOverview />);

    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());

    // Click on the invoice to open the modal
    fireEvent.click(screen.getByText("Invoice #1"));

    expect(screen.getByText(/Invoice Details/i)).toBeInTheDocument(); // Adjust based on your InvoiceDetails component

    // Close the modal
    fireEvent.click(screen.getByRole("button", { name: /close/i })); // Ensure this matches your modal close button

    expect(screen.queryByText(/Invoice Details/i)).not.toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    mockAxios
      .onGet("http://localhost:5000/invoices")
      .reply(500);

    render(<InvoiceOverview />);

    await waitFor(() => expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument());
  });
});
