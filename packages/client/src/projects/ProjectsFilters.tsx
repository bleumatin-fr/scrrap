import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import Button from '../ui/Button';

interface Props {
  open: boolean;
  onClose: () => void;
  activityTypes: string[];
  selectedActivityTypes: string[];
  onChange: (selectedActivityTypes: string[]) => void;
}

const ProjectsFilters = ({
  open,
  onClose,
  activityTypes,
  selectedActivityTypes,
  onChange,
}: Props) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    selectedActivityTypes,
  );

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    if (event.target.checked) {
      setSelectedTypes((prev) => [...prev, type]);
    } else {
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    }
  };

  const applyFilters = () => {
    onChange(selectedTypes);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: 'black', color: 'white' }}>
        Filtres
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            marginTop: '16px',
          }}
        >
          Filtrez la liste des activités en utilisant les possibilités suivantes
        </DialogContentText>
        <DialogContentText
          sx={{
            color: 'black',
            fontWeight: '600',
            fontSize: '16px',
            marginTop: '16px',
          }}
        >
          Types d'activité
        </DialogContentText>
        {activityTypes.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedTypes.includes(type)}
                onChange={(e) => handleCheckboxChange(e, type)}
                value={type}
              />
            }
            label={type}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={applyFilters} color="primary">
          Appliquer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectsFilters;
