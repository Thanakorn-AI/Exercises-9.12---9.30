// patientor_frontend/src/components/PatientDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, List, ListItem, ListItemText, Button } from "@mui/material";
import patientService from "../services/patients";
import { Patient, Diagnosis, Entry } from "../types";
import EntryDetails from "./EntryDetails";
import AddEntryModal from "./AddEntryModal";
import axios from "axios";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patientData = await patientService.getById(id);
        setPatient(patientData);
      }
    };
    const fetchDiagnoses = async () => {
      const { data } = await axios.get<Diagnosis[]>(`http://localhost:3001/api/diagnoses`);
      setDiagnoses(data);
    };
    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: Entry) => {
    try {
      if (!id) throw new Error("Patient ID missing");
      const newEntry = await patientService.createEntry(id, values);
      if (patient) {
        setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
      }
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography>Gender: {patient.gender}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography variant="h6" style={{ marginTop: "1em" }}>Entries</Typography>
      <List>
        {patient.entries.map(entry => (
          <ListItem key={entry.id}>
            <ListItemText>
              <EntryDetails entry={entry} diagnoses={diagnoses} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        onClose={closeModal}
        error={error}
        diagnoses={diagnoses}
      />
      <Button variant="contained" onClick={openModal}>
        Add New Entry
      </Button>
    </Box>
  );
};

export default PatientDetailPage;