// patientor_backend/src/routes/patients.ts
import express from 'express';
import patientsService from '../services/patientsService';
import { toNewPatient } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientsService.getPatients());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.getPatientById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send('Patient not found');
  }
});

router.post('/', (req, res) => {
  try {
    const newPatientData = toNewPatient(req.body);
    const addedPatient = patientsService.addPatient(newPatientData);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof z.ZodError) {
      errorMessage = error.issues.map(issue => `${issue.path}: ${issue.message}`).join(', ');
    } else if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

const parseDiagnosisCodes = (object: unknown): Array<string> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [];
  }
  return object.diagnosisCodes as Array<string>;
};

router.post('/:id/entries', (req, res) => {
  try {
    const patientId = req.params.id;
    const { type } = req.body;

    const baseEntrySchema = z.object({
      description: z.string().min(1, 'Description is required'), // Enforce non-empty
      date: z.string().refine(date => !isNaN(Date.parse(date)), { message: 'Invalid date format' }),
      specialist: z.string().min(1, 'Specialist is required'), // Enforce non-empty
      diagnosisCodes: z.array(z.string()).optional()
    });

    let entrySchema;
    switch (type) {
      case 'Hospital':
        entrySchema = baseEntrySchema.extend({
          type: z.literal('Hospital'),
          discharge: z.object({
            date: z.string().refine(date => !isNaN(Date.parse(date)), { message: 'Invalid discharge date' }),
            criteria: z.string().min(1, 'Discharge criteria is required') // Enforce non-empty
          })
        });
        break;
      case 'OccupationalHealthcare':
        entrySchema = baseEntrySchema.extend({
          type: z.literal('OccupationalHealthcare'),
          employerName: z.string().min(1, 'Employer name is required'), // Enforce non-empty
          sickLeave: z.object({
            startDate: z.string().refine(date => !isNaN(Date.parse(date)), { message: 'Invalid start date' }),
            endDate: z.string().refine(date => !isNaN(Date.parse(date)), { message: 'Invalid end date' })
          }).optional()
        });
        break;
      case 'HealthCheck':
        entrySchema = baseEntrySchema.extend({
          type: z.literal('HealthCheck'),
          healthCheckRating: z.number().int().min(0).max(3)
        });
        break;
      default:
        throw new Error('Invalid entry type');
    }

    const newEntry = entrySchema.parse({ ...req.body, diagnosisCodes: parseDiagnosisCodes(req.body) });
    const addedEntry = patientsService.addEntry(patientId, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof z.ZodError) {
      errorMessage = error.issues.map(issue => `${issue.path}: ${issue.message}`).join(', ');
    } else if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;