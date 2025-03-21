// patientor_frontend/src/components/EntryDetails.tsx
import { Entry, Diagnosis } from "../types";
import { Typography, Box } from "@mui/material";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetails = ({ entry, diagnoses }: Props) => {
  const getDiagnosisDescription = (code: string) => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? `${code} - ${diagnosis.name}` : code;
  };

  const renderEntryDetails = () => {
    switch (entry.type) {
      case "Hospital":
        return (
          <Box>
            <Typography><LocalHospitalIcon /> Hospital</Typography>
            <Typography>Date: {entry.date}</Typography>
            <Typography>Description: {entry.description}</Typography>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map(code => (
                  <li key={code}>{getDiagnosisDescription(code)}</li>
                ))}
              </ul>
            )}
            <Typography>Discharge: {entry.discharge.date} - {entry.discharge.criteria}</Typography>
            <Typography>Specialist: {entry.specialist}</Typography>
          </Box>
        );
      case "OccupationalHealthcare":
        return (
          <Box>
            <Typography><WorkIcon /> Occupational Healthcare</Typography>
            <Typography>Date: {entry.date}</Typography>
            <Typography>Description: {entry.description}</Typography>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map(code => (
                  <li key={code}>{getDiagnosisDescription(code)}</li>
                ))}
              </ul>
            )}
            <Typography>Employer: {entry.employerName}</Typography>
            {entry.sickLeave && (
              <Typography>Sick Leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</Typography>
            )}
            <Typography>Specialist: {entry.specialist}</Typography>
          </Box>
        );
      case "HealthCheck":
        return (
          <Box>
            <Typography><FavoriteIcon /> Health Check</Typography>
            <Typography>Date: {entry.date}</Typography>
            <Typography>Description: {entry.description}</Typography>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map(code => (
                  <li key={code}>{getDiagnosisDescription(code)}</li>
                ))}
              </ul>
            )}
            <Typography>Health Rating: {entry.healthCheckRating}</Typography>
            <Typography>Specialist: {entry.specialist}</Typography>
          </Box>
        );
      default:
        const _exhaustiveCheck: never = entry;
        return <Typography>Unknown entry type</Typography>;
    }
  };

  return <Box sx={{ marginBottom: 2 }}>{renderEntryDetails()}</Box>;
};

export default EntryDetails;