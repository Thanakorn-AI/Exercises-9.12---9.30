// patientor_backend/src/utils.ts
import { z } from 'zod';
import { NewPatient, Gender } from './types';

const NewPatientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid date format' }
  ),
  ssn: z.string().min(1, 'SSN is required'),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'Invalid gender value' }) }),
  occupation: z.string().min(1, 'Occupation is required')
});

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};