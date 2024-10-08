
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import InvoiceDetails from './InvoiceDetails';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Set up a mock for axios
const mockAxios = new MockAdapter(axios);

describe('InvoiceDetails', () => {
  const invoice = { id: '1', dueDate: '2024-10-10', amount: '100', status: 'Paid' };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  test('renders loading state', () => {
    render(<InvoiceDetails isOpen={true} invoice={invoice} onClose={() => {}} />);
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('fetches and displays activities', async () => {
    const activities = [
      { avatar: 'avatar1.png', name: 'User 1', time: '10 mins ago', description: 'Created invoice #1' },
      { avatar: 'avatar2.png', name: 'User 2', time: '15 mins ago', description: 'Paid invoice #1' },
    ];

    mockAxios.onGet('http://localhost:5000/activities').reply(200, activities);

    render(<InvoiceDetails isOpen={true} invoice={invoice} onClose={() => {}} />);

    // Wait for loading state to disappear and activities to be displayed
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Check if the activities are displayed
    expect(screen.getByText(/User 1/i)).toBeInTheDocument();
    expect(screen.getByText(/User 2/i)).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    mockAxios.onGet('http://localhost:5000/activities').reply(500);

    render(<InvoiceDetails isOpen={true} invoice={invoice} onClose={() => {}} />);

    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // You may have a specific error handling message. Adjust accordingly.
    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();
  });

  test('handles dropdown toggle', async () => {
    mockAxios.onGet('http://localhost:5000/activities').reply(200, []);

    render(<InvoiceDetails isOpen={true} invoice={invoice} onClose={() => {}} />);

    // Wait for activities to load
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Open dropdown
    fireEvent.click(screen.getByText(/More/i));

    // Check if dropdown options are visible
    expect(screen.getByText(/Duplicate Invoice/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Shareable Link/i)).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(screen.getByText(/More/i));
    expect(screen.queryByText(/Duplicate Invoice/i)).not.toBeInTheDocument();
  });

  test('closes the modal', () => {
    const onClose = jest.fn();

    render(<InvoiceDetails isOpen={true} invoice={invoice} onClose={onClose} />);

    // Close the modal
    fireEvent.click(screen.getByText(/×/i)); // Assuming the close button shows "×"
    
    expect(onClose).toHaveBeenCalled();
  });
});
