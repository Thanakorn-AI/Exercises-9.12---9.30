import { useState, SyntheticEvent, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Button,
  FormControl,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Chip,
  Box,
  Typography
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Entry, Diagnosis, HealthCheckRating } from "../../types";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  onCancel: () => void;
  onSubmit: (values: Entry) => void;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [type, setType] = useState<"Hospital" | "OccupationalHealthcare" | "HealthCheck">("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(null);
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState<Dayjs | null>(null);
  const [sickLeaveEnd, setSickLeaveEnd] = useState<Dayjs | null>(null);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  
  // Diagnosis selection dialog state
  const [diagnosisDialogOpen, setDiagnosisDialogOpen] = useState(false);
  const [tempDiagnosisCodes, setTempDiagnosisCodes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize temporary diagnosis codes when the dialog opens
  useEffect(() => {
    if (diagnosisDialogOpen) {
      setTempDiagnosisCodes([...diagnosisCodes]);
    }
  }, [diagnosisDialogOpen]);
  
  // Filter diagnoses based on search term
  const filteredDiagnoses = diagnoses.filter(
    (d) => 
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    let entry: Entry;
    switch (type) {
      case "Hospital":
        entry = {
          type: "Hospital",
          description,
          date: date?.format("YYYY-MM-DD") || "",
          specialist,
          diagnosisCodes,
          discharge: {
            date: dischargeDate?.format("YYYY-MM-DD") || "",
            criteria: dischargeCriteria
          }
        };
        break;
      case "OccupationalHealthcare":
        entry = {
          type: "OccupationalHealthcare",
          description,
          date: date?.format("YYYY-MM-DD") || "",
          specialist,
          diagnosisCodes,
          employerName,
          sickLeave: sickLeaveStart && sickLeaveEnd ? {
            startDate: sickLeaveStart.format("YYYY-MM-DD"),
            endDate: sickLeaveEnd.format("YYYY-MM-DD")
          } : undefined
        };
        break;
      case "HealthCheck":
        entry = {
          type: "HealthCheck",
          description,
          date: date?.format("YYYY-MM-DD") || "",
          specialist,
          diagnosisCodes,
          healthCheckRating
        };
        break;
      default:
        return;
    }
    onSubmit(entry);
  };
  
  // Diagnoses dialog handlers
  const handleOpenDiagnosisDialog = () => {
    setDiagnosisDialogOpen(true);
  };
  
  const handleCloseDiagnosisDialog = () => {
    setDiagnosisDialogOpen(false);
    setSearchTerm("");
  };
  
  const handleConfirmDiagnoses = () => {
    setDiagnosisCodes(tempDiagnosisCodes);
    handleCloseDiagnosisDialog();
  };
  
  const handleToggleDiagnosis = (code: string) => {
    setTempDiagnosisCodes((prev) => 
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };
  
  const handleRemoveDiagnosis = (code: string) => {
    setDiagnosisCodes((prev) => prev.filter((c) => c !== code));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e: SelectChangeEvent<string>) => setType(e.target.value as typeof type)}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <DatePicker
          label="Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          sx={{ mb: 2, width: "100%" }}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {/* Enhanced Diagnosis Selection */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Diagnosis Codes
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {diagnosisCodes.length > 0 ? (
              diagnosisCodes.map((code) => {
                const diagnosis = diagnoses.find((d) => d.code === code);
                return (
                  <Chip
                    key={code}
                    label={`${code} - ${diagnosis?.name || ''}`}
                    onDelete={() => handleRemoveDiagnosis(code)}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No diagnoses selected
              </Typography>
            )}
          </Box>
          
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleOpenDiagnosisDialog}
            fullWidth
          >
            Select Diagnoses
          </Button>
        </Box>

        {type === "Hospital" && (
          <>
            <DatePicker
              label="Discharge Date"
              value={dischargeDate}
              onChange={(newValue) => setDischargeDate(newValue)}
              sx={{ mb: 2, width: "100%" }}
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={(e) => setDischargeCriteria(e.target.value)}
              sx={{ mb: 2 }}
            />
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <DatePicker
              label="Sick Leave Start"
              value={sickLeaveStart}
              onChange={(newValue) => setSickLeaveStart(newValue)}
              sx={{ mb: 2, width: "100%" }}
            />
            <DatePicker
              label="Sick Leave End"
              value={sickLeaveEnd}
              onChange={(newValue) => setSickLeaveEnd(newValue)}
              sx={{ mb: 2, width: "100%" }}
            />
          </>
        )}

        {type === "HealthCheck" && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Health Check Rating</InputLabel>
            <Select
              value={healthCheckRating}
              onChange={(e) => setHealthCheckRating(e.target.value as HealthCheckRating)}
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>Critical Risk</MenuItem>
            </Select>
          </FormControl>
        )}

        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Button color="secondary" variant="contained" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      
      {/* Diagnosis Selection Dialog */}
      <Dialog 
        open={diagnosisDialogOpen} 
        onClose={handleCloseDiagnosisDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select Diagnoses</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search diagnoses"
            type="text"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
            {filteredDiagnoses.map((diagnosis) => (
              <ListItem key={diagnosis.code} disablePadding>
                <MenuItem 
                  onClick={() => handleToggleDiagnosis(diagnosis.code)}
                  sx={{ width: '100%' }}
                >
                  <Checkbox 
                    checked={tempDiagnosisCodes.includes(diagnosis.code)} 
                  />
                  <ListItemText 
                    primary={`${diagnosis.code} - ${diagnosis.name}`} 
                  />
                </MenuItem>
              </ListItem>
            ))}
          </List>
          
          {filteredDiagnoses.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
              No diagnoses found matching your search
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDiagnosisDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDiagnoses} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddEntryForm;