// patientor_frontend/src/components/AddEntryModal/AddEntryForm.tsx
import { useState, SyntheticEvent } from "react";
import { TextField, Select, MenuItem, InputLabel, Grid, Button, FormControl, SelectChangeEvent } from "@mui/material";
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
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={(e) => setDiagnosisCodes(e.target.value as string[])}
          >
            {diagnoses.map(d => (
              <MenuItem key={d.code} value={d.code}>{d.code} - {d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

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

        <Grid container spacing={2}>
          <Grid item>
            <Button color="secondary" variant="contained" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default AddEntryForm;