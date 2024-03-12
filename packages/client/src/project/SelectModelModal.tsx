import styled from '@emotion/styled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@mui/material';
import { Model } from '@scrrap/core';
import { useState } from 'react';
import Button from '../ui/Button';

interface SelectModelModalProps {
  open: boolean;
  onCancel: () => void;
  onClose: () => void;
  onModelSelection: () => void;
  models: Model[] | undefined;
  setModelSelected: (model: Model | undefined) => void;
  modelSelected: Model | undefined;
}

const ProjectTypesContainer = styled.div`
  display: flex;
  gap: 16px;
`;

interface StyledPaperProps {
  selected: boolean;
}

const StyledPaper = styled(Paper)<StyledPaperProps>`
  position: relative;
  width: 350px;
  flex: 1;
  padding: 5px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  &:hover {
    ${({ selected }) => !selected && `background-color: #dddddd;`}
    .model-title {
      ${({ selected }) => !selected && `font-weight: bold;`}
    }
  }
  .model-title {
    margin: 24px 0 16px;
  }
  .check-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    color: black; /* Green color */
    font-size: 36px;
    z-index: 1;
  }
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  svg {
    align-self: center;
    width: 100px;
  }
`;

const SelectModelModal = ({
  open,
  onCancel,
  onClose,
  onModelSelection,
  models,
  setModelSelected,
  modelSelected: defaultSelectedModel,
}: SelectModelModalProps) => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(
    defaultSelectedModel || null,
  );

  const handleClose = () => {
    onClose();
    setModelSelected(undefined);
  };

  const handleSave = () => {
    if (!selectedModel) {
      throw new Error('Project model not found');
    }
    setModelSelected(selectedModel);
    onClose();
    onModelSelection();
  };

  const handleCardClick = (model: Model) => {
    setSelectedModel(model);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle
        id="scroll-dialog-title"
        sx={{ backgroundColor: 'black', color: 'white' }}
      >
        Selection of activity type
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          sx={{
            fontWeight: '400',
            fontSize: '16px',
            margin: '16px 0 32px',
          }}
        >
          Click on the activity type you want to create.
        </DialogContentText>
        {models && (
          <ProjectTypesContainer>
            {models.map((model) => (
              <StyledPaper
                square
                elevation={2}
                key={model._id.toString()}
                onClick={() => handleCardClick(model)}
                variant={
                  selectedModel?._id.toString() === model._id.toString()
                    ? 'outlined'
                    : 'elevation'
                }
                sx={{
                  backgroundColor:
                    selectedModel?._id.toString() === model._id.toString()
                      ? '#A5A5A5'
                      : 'white',
                }}
                selected={
                  selectedModel?._id.toString() === model._id.toString()
                }
              >
                {selectedModel?._id.toString() === model._id.toString() && (
                  <CheckCircleIcon className="check-icon" />
                )}
                <StyledCardContent>
                  <p className="model-title h4b">{model.singularName}</p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: model.description,
                    }}
                  />
                </StyledCardContent>
              </StyledPaper>
            ))}
          </ProjectTypesContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSave} color="primary" disabled={!selectedModel}>
          Suivant
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectModelModal;
