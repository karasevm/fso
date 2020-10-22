import patients from '../../data/patients';
import { v4 as uuid } from 'uuid';

import { Patient, PublicPatient, NewPatient, NewEntry, Entry } from '../types';

const getPatients = (): Array<Patient> => {
  return patients;
};

const getPatientsPublic = (): Array<PublicPatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntryToPatient = (entry: NewEntry, patientId: string): Entry => {
  const patient = patients.find(patient => patient.id === patientId);
  if (!patient) {
    throw new Error('malformed patient id');
  }
  const newEntry = {
    id: uuid(),
    date: new Date().toISOString().slice(0, 10),
    ...entry
  };
  patient.entries.push(newEntry);
  return newEntry;
};

const findById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export default {
  getPatients,
  getPatientsPublic,
  addPatient,
  findById,
  addEntryToPatient
};
