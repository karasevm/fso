import React from 'react';
import { Divider, Feed, Header, Icon, List, Segment } from 'semantic-ui-react';
import { assertNever } from '../helpers';
import { useStateValue } from '../state';
import {
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry
} from '../types';

const DiagnosisList: React.FC<{
  codes: string[];
}> = ({ codes }) => {
  const [{ diagnoses }] = useStateValue();

  if (!Object.keys(diagnoses).length) {
    return null;
  }

  return (
    <div>
      <Divider horizontal>
        <Header as="h3">Diagnoses</Header>
      </Divider>
      <List>
        {codes.map(code => (
          <List.Item key={code}>
            <List.Header>{code}</List.Header>
            {diagnoses[code].name}
          </List.Item>
        ))}
      </List>
    </div>
  );
};

const HealthCheckEntryDetails: React.FC<{
  entry: HealthCheckEntry;
}> = ({ entry }) => {
  const getHealthIcon = (
    rating: HealthCheckRating
  ): JSX.Element | undefined => {
    console.log('Drawing rating icons:', rating);

    switch (Number(rating)) {
      case 0:
        return (
          <div>
            <Icon name="heart" />
            <Icon name="heart" />
            <Icon name="heart" />
            <Icon name="heart" />
          </div>
        );
      case 1:
        return (
          <div>
            <Icon name="heart" />
            <Icon name="heart" />
            <Icon name="heart" />
            <Icon name="heart outline" />
          </div>
        );
      case 2:
        return (
          <div>
            <Icon name="heart" />
            <Icon name="heart" />
            <Icon name="heart outline" />
            <Icon name="heart outline" />
          </div>
        );
      case 3:
        return (
          <div>
            <Icon name="heart" />
            <Icon name="heart outline" />
            <Icon name="heart outline" />
            <Icon name="heart outline" />
          </div>
        );
    }
  };
  return (
    <Segment>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <Icon name="doctor" />
          </Feed.Label>
          <Feed.Content>
            <Feed.Date>{entry.date}</Feed.Date>
            <Feed.Summary>
              {entry.specialist}: {entry.description}
            </Feed.Summary>
            {entry.diagnosisCodes ? (
              <Feed.Extra text>
                <DiagnosisList codes={entry.diagnosisCodes} />
              </Feed.Extra>
            ) : null}
            <Feed.Extra images>
              {getHealthIcon(entry.healthCheckRating)}
            </Feed.Extra>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </Segment>
  );
};

const HospitalEntryDetails: React.FC<{
  entry: HospitalEntry;
}> = ({ entry }) => {
  return (
    <Segment>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <Icon name="hospital" />
          </Feed.Label>
          <Feed.Content>
            <Feed.Date>{entry.date}</Feed.Date>
            <Feed.Summary>
              {entry.specialist}: {entry.description}
            </Feed.Summary>
            {entry.diagnosisCodes ? (
              <Feed.Extra text>
                <DiagnosisList codes={entry.diagnosisCodes} />
              </Feed.Extra>
            ) : null}
            {entry.discharge ? (
              <Feed.Extra text>
                <Divider horizontal>
                  <Header as="h3">Discharge</Header>
                </Divider>
                Discharged on {entry.discharge.date}: {entry.discharge.criteria}
              </Feed.Extra>
            ) : null}
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </Segment>
  );
};

const OccupationalHealthcareEntryDetails: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <Segment>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <Icon name="stethoscope" />
          </Feed.Label>
          <Feed.Content>
            <Feed.Date>{entry.date}</Feed.Date>
            <Feed.Date>{entry.employerName}</Feed.Date>
            <Feed.Summary>
              {entry.specialist}: {entry.description}
            </Feed.Summary>
            {entry.diagnosisCodes ? (
              <Feed.Extra text>
                <DiagnosisList codes={entry.diagnosisCodes} />
              </Feed.Extra>
            ) : null}
            {entry.sickLeave ? (
              <Feed.Extra text>
                <Divider horizontal>
                  <Header as="h3">Sick leave</Header>
                </Divider>
                From {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
              </Feed.Extra>
            ) : null}
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </Segment>
  );
};

const EntryDetails: React.FC<{
  entry: Entry;
}> = ({ entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheckEntryDetails entry={entry} />;
    case 'Hospital':
      return <HospitalEntryDetails entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
