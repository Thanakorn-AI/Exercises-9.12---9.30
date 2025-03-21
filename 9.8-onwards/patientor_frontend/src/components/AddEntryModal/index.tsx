// patientor_frontend/src/components/AddEntryModal/index.tsx
import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';
import AddEntryForm from './AddEntryForm';
import { Entry, Diagnosis } from "../../types";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Entry) => void;
  error?: string;
  diagnoses: Diagnosis[];
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error, diagnoses }: Props) => (
  <Dialog fullWidth open={modalOpen} onClose={onClose}>
    <DialogTitle>Add a new entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnoses={diagnoses} />
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;