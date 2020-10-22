import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  addPatient,
  setDiagnosisList,
  updatePatient,
  useStateValue
} from '../state';
import { Diagnosis, Entry, Gender, NewEntry, Patient } from '../types';
import { apiBaseUrl } from '../constants';
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  List,
  Segment
} from 'semantic-ui-react';
import EntryDetails from './EntryDetails';
import AddEntryFormModal from './AddEntryFormModal';
const PatientDetailsPage: React.FC = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const currPatient = patients[id];

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: NewEntry) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );

      const newPatient = {
        ...patients[id],
        entries: patients[id].entries.concat(newEntry)
      };

      dispatch(updatePatient(newPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  useEffect(() => {
    const getPatientData = async (id: string) => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(addPatient(patient));
      } catch (e) {
        console.log('ERROR WHILE GETTING PATIENT DATA', e);
      }
    };

    const getDiagnosisList = async () => {
      try {
        const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosisList(diagnosisListFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    if (!Object.keys(diagnoses).length) {
      getDiagnosisList();
    }

    if (!currPatient || !currPatient.ssn) {
      getPatientData(id);
    }
  }, [currPatient, id, diagnoses, dispatch]);

  if (!currPatient || !currPatient.ssn) {
    return null;
  }
  const genderIcon = (gender: Gender): JSX.Element | null => {
    switch (gender) {
      case 'male':
        return <Icon name="mars" />;
      case 'female':
        return <Icon name="venus" />;
      case 'other':
        return <Icon name="other gender" />;
      default:
        return null;
    }
  };

  const entries = (entries: Array<Entry>): JSX.Element => {
    return (
      <div>
        <Header as="h2">Entries</Header>
        <Segment.Group>
          {entries.map(entry => (
            <EntryDetails key={entry.id} entry={entry} />
          ))}
        </Segment.Group>
      </div>
    );
  };

  return (
    <div className="App">
      <Container>
        <Header as="h2">
          {currPatient.name} {genderIcon(currPatient.gender)}
        </Header>
        <List>
          <List.Item>
            <List.Header>SSN</List.Header>
            {currPatient.ssn}
          </List.Item>
          <List.Item>
            <List.Header>Occupation</List.Header>
            {currPatient.occupation}
          </List.Item>
          <List.Item>
            <List.Header>Date of Birth</List.Header>
            {currPatient.dateOfBirth}
          </List.Item>
        </List>
        {currPatient.entries ? entries(currPatient.entries) : null}
        <Divider hidden />
        <AddEntryFormModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()}>Add New Entry</Button>
      </Container>
    </div>
  );
};

export default PatientDetailsPage;
