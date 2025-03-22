// patientor_backend/__tests__/patients.test.ts
import request from 'supertest';
import app from '../src/index'; // Adjust if your app export is different

describe('POST /api/patients/:id/entries', () => {
  const patientId = 'd2773336-f723-11e9-8f0b-362b9e155667'; // John McClane

  test('rejects entry with wrong date format', async () => {
    const invalidEntry = {
      type: 'Hospital',
      description: 'Test invalid date',
      date: 'not-a-date',
      specialist: 'Dr. Test',
      discharge: { date: '2023-10-02', criteria: 'Test discharge' }
    };

    const response = await request(app)
      .post(`/api/patients/${patientId}/entries`)
      .send(invalidEntry)
      .expect(400);

    expect(response.text).toContain('date: Invalid date format');
  });

  test('rejects HealthCheck entry with invalid health rating', async () => {
    const invalidEntry = {
      type: 'HealthCheck',
      description: 'Test invalid rating',
      date: '2023-10-01',
      specialist: 'Dr. Test',
      healthCheckRating: 5 // Outside 0-3 range
    };

    const response = await request(app)
      .post(`/api/patients/${patientId}/entries`)
      .send(invalidEntry)
      .expect(400);

    expect(response.text).toContain('healthCheckRating: Number must be less than or equal to 3');
  });
});