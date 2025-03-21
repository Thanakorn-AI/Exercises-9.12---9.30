// patientor_backend/src/services/patientsService.ts
import patientsData from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient, Entry, EntryWithoutId } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientsData;

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
    entries: []
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) throw new Error('Patient not found');
  const newEntry: Entry = { ...entry, id: uuid() } as Entry; // Cast to Entry since id is added
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatientById,
  addPatient,
  addEntry
};