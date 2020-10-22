import express from 'express';
import patientService from '../services/patientService';
import { toNewEntry, toNewPatient } from '../utils';

const router = express.Router();

router.get('/:id/entries', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient && patient.entries) {
    res.json(patient.entries);
  } else {
    res.sendStatus(404);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);

    const addedEntry = patientService.addEntryToPatient(
      newEntry,
      req.params.id
    );
    res.status(201).json(addedEntry);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json({ error: e.message });
    }
  }
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

router.get('/', (_req, res) => {
  res.json(patientService.getPatientsPublic());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);

    const addedPatient = patientService.addPatient(newPatient);
    res.status(201).json(addedPatient);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json({ error: e.message });
    }
  }
});

export default router;
