/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Diagnosis,
  Discharge,
  Gender,
  HealthCheckRating,
  NewEntry,
  NewPatient,
  SickLeave
} from './types';

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name: ' + name);
  }
  return name;
};

const parseDOB = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date of birth: ' + date);
  }
  return date;
};

const parseSSN = (ssn: any): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrenct or missing ssn: ' + ssn);
  }
  return ssn;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrenct or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrenct or missing occupation: ' + occupation);
  }
  return occupation;
};

export const toNewPatient = (object: any): NewPatient => {
  return {
    name: parseName(object.name),
    dateOfBirth: parseDOB(object.dateOfBirth),
    ssn: parseSSN(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: []
  };
};

const parseDescription = (description: any): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrenct or missing description: ' + description);
  }
  return description;
};

const parseSpecialist = (specialist: any): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrenct or missing specialist: ' + specialist);
  }
  return specialist;
};

const parseDiagnosisCodes = (codes: any): Array<Diagnosis['code']> => {
  if (!(codes instanceof Array)) {
    throw new Error('Incorrenct or missing diagnosis codes: ' + codes);
  }
  for (const code of codes) {
    if (!code || !isString(code)) {
      throw new Error('Incorrenct diagnosis code: ' + code);
    }
  }
  return codes;
};

const parseDischarge = (discharge: any): Discharge => {
  if (
    !discharge ||
    !discharge.date ||
    !discharge.criteria ||
    !isDate(discharge.date) ||
    !isString(discharge.criteria)
  ) {
    throw new Error('Incorrect or missing discharge: ' + discharge);
  }
  return {
    date: discharge.date,
    criteria: discharge.criteria
  };
};

const parseHealthCheckRating = (rating: any): HealthCheckRating => {
  if (!Object.values(HealthCheckRating).includes(Number(rating))) {
    throw new Error('Incorrect or missing health rating: ' + rating);
  }
  return rating;
};

const parseEmployerName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrenct or missing employer name: ' + name);
  }
  return name;
};

const parseSickLeave = (leave: any): SickLeave => {
  if (
    !leave ||
    !leave.startDate ||
    !leave.endDate ||
    !isString(leave.startDate) ||
    !isString(leave.endDate) ||
    !isDate(leave.startDate) ||
    !isDate(leave.endDate)
  ) {
    throw new Error('Incorrenct or missing sick leave: ' + leave);
  }
  return {
    startDate: leave.startDate,
    endDate: leave.endDate
  };
};

export const toNewEntry = (entry: any): NewEntry => {
  switch (entry.type) {
    case 'Hospital':
      return {
        type: 'Hospital',
        description: parseDescription(entry.description),
        specialist: parseSpecialist(entry.specialist),
        ...(entry.diagnosisCodes &&
          entry.diagnosisCodes.length && {
            diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes)
          }),
        discharge: parseDischarge(entry.discharge)
      };
    case 'HealthCheck':
      return {
        type: 'HealthCheck',
        description: parseDescription(entry.description),
        specialist: parseSpecialist(entry.specialist),
        ...(entry.diagnosisCodes &&
          entry.diagnosisCodes.length && {
            diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes)
          }),
        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating)
      };
    case 'OccupationalHealthcare':
      return {
        type: 'OccupationalHealthcare',
        description: parseDescription(entry.description),
        specialist: parseSpecialist(entry.specialist),
        ...(entry.diagnosisCodes &&
          entry.diagnosisCodes.length && {
            diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes)
          }),
        employerName: parseEmployerName(entry.employerName),
        ...(entry.sickLeave &&
          entry.sickLeave.startDate &&
          entry.sickLeave.endDate && {
            sickLeave: parseSickLeave(entry.sickLeave)
          })
      };
    default:
      throw new Error('Unknown entry type' + entry.type);
  }
};
