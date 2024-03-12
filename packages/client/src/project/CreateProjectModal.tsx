import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { useSnackbar } from 'notistack';

import { useEffect } from 'react';
import { useSessionStorage } from 'usehooks-ts';

import { useTour } from '@reactour/tour';
import { IndexParameterInput, Model, Parameter, Value } from '@scrrap/core';
import { FormEvent, useRef, useState } from 'react';
import Button from '../ui/Button';
import Parameters from './Parameters';

interface CreateProjectModalProps {
  open: boolean;
  onClose: any;
  onPrevious?: () => void;
  onSave?: (values: IndexParameterInput[], modelType: string) => void;
  model: Model;
  models?: Model[] | undefined;
}

const CreateProjectModal = ({
  open,
  onSave,
  onClose,
  onPrevious,
  model,
  models
}: CreateProjectModalProps) => {
  const [initialParameters, setInitialParameters] = useState([] as Parameter[]);
  const [parameterValues, setParameterValues] = useState(
    [] as IndexParameterInput[],
  );
  const [missingParameters, setMissingParameters] = useState([] as Parameter[]);

  const [savedParameters, setSavedParameters] = useSessionStorage<
    string | null
  >(`new_project_${model.type}`, null);

  const called = useRef(false);
  const autofocusFirst = useRef(true);
  const { enqueueSnackbar } = useSnackbar();

  const { isOpen, currentStep, setCurrentStep } = useTour();

  useEffect(() => {
    if (isOpen && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [isOpen, currentStep, setCurrentStep]);

  useEffect(() => {
    let parameters: Parameter[] = JSON.parse(JSON.stringify(model?.parameters));
    if (savedParameters) {
      const savedParametersValues: IndexParameterInput[] =
        JSON.parse(savedParameters);
      parameters.map((parameter) => {
        const savedParameter = savedParametersValues.find(
          (savedParameterValues) =>
            savedParameterValues.index === parameter.index,
        );
        if (savedParameter) {
          parameter.value = savedParameter.value;
        }
        return parameter;
      });
    }
    setInitialParameters(parameters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const missingParams = initialParameters.filter(
      (param) =>
        param.displayOnCreate &&
        !parameterValues.find((value) => value.index === param.index),
    );
    setMissingParameters(missingParams);
  }, [initialParameters, parameterValues]);

  if (initialParameters.length === 0) return null;

  const handleClose = () => {
    called.current = false;
    autofocusFirst.current = true;
    onClose();
  };

  const handleCancel = () => {
    setSavedParameters(null);
    handleClose();
  };

  const handleSave = () => {
    if (missingParameters.length > 0) {
      const listOfParams = missingParameters.map((p) => p.name).join(', ');
      enqueueSnackbar(
        `Les paramètres suivants n'ont pas été renseignés : ${listOfParams}.`,
        {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        },
      );
      return;
    } else {
      called.current = false;
      autofocusFirst.current = true;
      setSavedParameters(null);
      setCurrentStep(2);
      onSave && onSave(parameterValues, model.type);
    }
  };

  const handleParameterUpdated = (index: number, value: Value) => {
    if (autofocusFirst) {
      autofocusFirst.current = false;
    }
    const parameterValuesUpdated: IndexParameterInput[] = [
      ...parameterValues.filter((p) => p.index !== index),
      { type: 'index', index, value },
    ];
    setParameterValues(parameterValuesUpdated);
    setSavedParameters(JSON.stringify(parameterValuesUpdated));
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <Dialog open={open} onClose={handleClose} scroll="paper" id="create_modal">
      <form onSubmit={handleFormSubmit}>
        <DialogTitle
          id="scroll-dialog-title"
          sx={{ backgroundColor: 'black', color: 'white' }}
        >
          Nouvelle {model.singularName}
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            sx={{
              fontWeight: '400',
              fontSize: '16px',
              margin: '16px 0 32px',
            }}
          >
            Merci de répondre aux questions suivantes : un formulaire qui
            correspond aux caractéristiques de votre projet sera créé. <br />
            <br /> Vous pourrez revenir sur ces questions plus tard.
          </DialogContentText>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
            component="div"
          >
            <Parameters
              autofocusFirst={autofocusFirst.current}
              parameters={initialParameters || []}
              style={{ padding: 0 }}
              onUpdateParameter={handleParameterUpdated}
              debounced={false}
            ></Parameters>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ position: 'sticky', bottom: 0, background: 'white' }}
        >
          <Button onClick={handleCancel}>Annuler</Button>
          {models && models.length > 1 && <Button onClick={onPrevious}>Précédent</Button>}
          <Button type="submit" variant="contained" color="primary">
            Créer l'{model.singularName}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateProjectModal;
