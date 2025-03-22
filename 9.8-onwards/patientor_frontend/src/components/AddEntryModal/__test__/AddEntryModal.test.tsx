// patientor_frontend/src/components/AddEntryModal/__tests__/AddEntryModal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddEntryModal from '../index';
import patientService from '../../../services/patients';
import { Diagnosis } from '../../../types';

// Mock the patientService
jest.mock('../../../services/patients', () => ({
  createEntry: jest.fn()
}));

const mockDiagnoses: Diagnosis[] = [
  { code: 'M24.2', name: 'Disorder of ligament', latin: 'Morbositas ligamenti' }
];

describe('AddEntryModal', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays error for wrong date format', async () => {
    (patientService.createEntry as jest.Mock).mockRejectedValue({
      response: { data: 'date: Invalid date format' }
    });

    render(
      <AddEntryModal
        modalOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        diagnoses={mockDiagnoses}
      />
    );

    // Temporarily assume TextField for date (since DatePicker is harder to mock)
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: 'not-a-date' } });
    fireEvent.change(screen.getByLabelText(/specialist/i), { target: { value: 'Dr. Test' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('date: Invalid date format')).toBeInTheDocument();
    });
  });

  test('displays error for invalid health rating', async () => {
    (patientService.createEntry as jest.Mock).mockRejectedValue({
      response: { data: 'healthCheckRating: Number must be less than or equal to 3' }
    });

    render(
      <AddEntryModal
        modalOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        diagnoses={mockDiagnoses}
      />
    );

    fireEvent.change(screen.getByLabelText(/type/i), { target: { value: 'HealthCheck' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-10-01' } });
    fireEvent.change(screen.getByLabelText(/specialist/i), { target: { value: 'Dr. Test' } });
    // Temporarily assume TextField for healthCheckRating
    fireEvent.change(screen.getByLabelText(/health check rating/i), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('healthCheckRating: Number must be less than or equal to 3')).toBeInTheDocument();
    });
  });
});