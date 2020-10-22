import React from 'react';
import { Form } from 'semantic-ui-react';
import { HealthCheckRating, NewEntry } from '../types';
import { Field } from 'formik';

export type HealthRatingOptions = {
  value: HealthCheckRating;
  label: string;
};

type HealthSelectFieldProps = {
  name: string;
  label: string;
  options: HealthRatingOptions[];
};

export const HealthSelectField: React.FC<HealthSelectFieldProps> = ({
  name,
  label,
  options
}: HealthSelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);

type TypeSelectFieldProps = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  setEntryType: React.Dispatch<React.SetStateAction<NewEntry['type']>>;
  value: NewEntry['type'];
};

export const TypeSelectField: React.FC<TypeSelectFieldProps> = ({
  name,
  label,
  options,
  setEntryType,
  value
}: TypeSelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <select
      name={name}
      className="ui dropdown"
      value={value}
      onChange={(e: React.FormEvent<HTMLSelectElement>) => {
        setEntryType(e.currentTarget.value as NewEntry['type']);
      }}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </select>
  </Form.Field>
);
