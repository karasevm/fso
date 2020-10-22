import React, { useState } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Field, Formik, Form } from 'formik';

import { DiagnosisSelection, TextField } from '../AddPatientModal/FormField';
import { HealthCheckRating, NewEntry } from '../types';
import { useStateValue } from '../state';
import {
  TypeSelectField,
  HealthSelectField,
  HealthRatingOptions
} from './SelectFields';
import { isDate } from '../helpers';

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const healthRatingOptions: HealthRatingOptions[] = [
  { value: HealthCheckRating.Healthy, label: 'Healthy' },
  { value: HealthCheckRating.LowRisk, label: 'Low Risk' },
  { value: HealthCheckRating.HighRisk, label: 'High Risk' },
  { value: HealthCheckRating.CriticalRisk, label: 'Critical Risk' }
];

const entryTypes: { value: string; label: string }[] = [
  { value: 'HealthCheck', label: 'Health Check' },
  { value: 'Hospital', label: 'Hospital' },
  { value: 'OccupationalHealthcare', label: 'Occupational Healthcare' }
];

const getConditionalFields = (type: NewEntry['type']) => {
  switch (type) {
    case 'Hospital':
      return (
        <React.Fragment>
          <Field
            label="Discharge Date"
            placeholder="Discharge Date"
            name="discharge.date"
            component={TextField}
          />
          <Field
            label="Discharge Criteria"
            placeholder="Discharge Criteria"
            name="discharge.criteria"
            component={TextField}
          />
        </React.Fragment>
      );
    case 'HealthCheck':
      return (
        <HealthSelectField
          label="Health Rating"
          name="healthCheckRating"
          options={healthRatingOptions}
        />
      );
    case 'OccupationalHealthcare':
      return (
        <React.Fragment>
          <Field
            label="Employer"
            placeholder="Employer"
            name="employerName"
            component={TextField}
          />
          <Field
            label="Sick Leave Start Date"
            placeholder="Start Date"
            name="sickLeave.startDate"
            component={TextField}
          />
          <Field
            label="Sick Leave End Date"
            placeholder="End Date"
            name="sickLeave.endDate"
            component={TextField}
          />
        </React.Fragment>
      );
  }
};

const getInitialValues = (type: NewEntry['type']): NewEntry => {
  switch (type) {
    case 'Hospital':
      return {
        type: 'Hospital',
        description: '',
        specialist: '',
        diagnosisCodes: [],
        discharge: {
          date: '',
          criteria: ''
        }
      };
    case 'HealthCheck':
      return {
        type: 'HealthCheck',
        description: '',
        specialist: '',
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.Healthy
      };
    case 'OccupationalHealthcare':
      return {
        type: 'OccupationalHealthcare',
        description: '',
        specialist: '',
        diagnosisCodes: [],
        employerName: '',
        sickLeave: {
          startDate: '',
          endDate: ''
        }
      };
  }
};

const validate = (values: NewEntry) => {
  const requiredError = 'Field is required';
  const invalidError = 'Invalid format';

  const errors: {
    [field: string]: string | { [field: string]: string };
  } = {};
  if (!values.description) {
    errors.description = requiredError;
  }
  if (!values.specialist) {
    errors.specialist = requiredError;
  }

  switch (values.type) {
    case 'Hospital':
      const discharge: { [field: string]: string } = {};

      if (!values.discharge.date) {
        discharge.date = requiredError;
      }
      if (!values.discharge.criteria) {
        discharge.criteria = requiredError;
      }
      if (values.discharge.date && !isDate(values.discharge.date)) {
        discharge.date = invalidError;
      }

      if (Object.keys(discharge).length) {
        errors.discharge = discharge;
      }

      return errors;
    case 'HealthCheck':
      return errors;
    case 'OccupationalHealthcare':
      const sickLeave: { [field: string]: string } = {};
      if (!values.employerName) {
        errors.employerName = requiredError;
      }

      if (values.sickLeave?.startDate && !isDate(values.sickLeave?.startDate)) {
        sickLeave.startDate = invalidError;
      }
      if (values.sickLeave?.endDate && !isDate(values.sickLeave?.endDate)) {
        sickLeave.endDate = invalidError;
      }

      if (Object.keys(sickLeave).length) {
        errors.sickLeave = sickLeave;
      }

      return errors;
  }
};

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();

  const [entryType, setEntryType] = useState('HealthCheck' as NewEntry['type']);
  return (
    <div>
      <Formik
        initialValues={getInitialValues(entryType)}
        onSubmit={onSubmit}
        enableReinitialize
        validate={validate}
      >
        {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
          return (
            <Form className="form ui">
              <TypeSelectField
                label="Entry Type"
                name="type"
                options={entryTypes}
                setEntryType={setEntryType}
                value={entryType}
              />
              <Field
                label="Description"
                placeholder="Description"
                name="description"
                component={TextField}
              />
              <Field
                label="Specialist"
                placeholder="Specialist"
                name="specialist"
                component={TextField}
              />
              <DiagnosisSelection
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                diagnoses={Object.values(diagnoses)}
              />
              {getConditionalFields(values.type)}
              <Grid>
                <Grid.Column floated="left" width={5}>
                  <Button type="button" onClick={onCancel} color="red">
                    Cancel
                  </Button>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                  <Button
                    type="submit"
                    floated="right"
                    color="green"
                    disabled={!dirty || !isValid}
                  >
                    Add
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddEntryForm;
