import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileManager } from '../../components/Files/FileManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('FileManager', () => {
  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <FileManager />
      </QueryClientProvider>
    );
  });

  it('renders file upload input', () => {
    expect(screen.getByRole('input', { type: 'file' })).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('input', { type: 'file' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });
  });
});