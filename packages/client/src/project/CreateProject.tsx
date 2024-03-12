import { Model, ParameterInput } from '@scrrap/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../ui/Loader';
import useModels from './context/useModels';
import CreateProjectModal from './CreateProjectModal';
import SelectModelModal from './SelectModelModal';

const CreateProject = ({ onClose }: { onClose: () => void }) => {
  const [openModelSelection, setOpenModelSelection] = useState(false);
  const [openProjectCreation, setOpenProjectCreation] = useState(false);
  const [modelSelected, setModelSelected] = useState<Model | undefined>(
    undefined,
  );

  const { models, loading } = useModels();
  const navigate = useNavigate();

  //ESCAPE MODEL SELECTION IF ONLY ONE MODEL
  useEffect(() => {
    if (models?.length === 1) {
      setModelSelected(models[0]);
      setOpenProjectCreation(true)
    }
    else {
      setOpenModelSelection(true)
    }
  }, [models])
  

  if (loading) {
    return <Loader fullPage />;
  }

  const handleCancelSelectModal = () => {
    setOpenModelSelection(false);
    onClose();
  };

  const handleModelSelection = () => {
    setOpenProjectCreation(true);
  };

  const handleBackToModelSelection = () => {
    setOpenProjectCreation(false);
    setOpenModelSelection(true);
  };

  const handleCloseProjectCreation = () => {
    setOpenProjectCreation(false);
    setModelSelected(undefined);
    onClose();
  };

  const handleCreateProject = (values: ParameterInput[], modelType: string) => {
    navigate(`/project?values=${JSON.stringify(values)}&type=${modelType}`);
  };

  return (
    <>
      {openModelSelection && (
        <SelectModelModal
          open={openModelSelection}
          onCancel={handleCancelSelectModal}
          onClose={() => setOpenModelSelection(false)}
          models={models}
          onModelSelection={handleModelSelection}
          setModelSelected={setModelSelected}
          modelSelected={modelSelected}
        />
      )}
      {openProjectCreation && modelSelected && (
        <CreateProjectModal
          open={openProjectCreation}
          onClose={handleCloseProjectCreation}
          onPrevious={handleBackToModelSelection}
          onSave={handleCreateProject}
          model={modelSelected}
          models={models}
        />
      )}
    </>
  );
};

export default CreateProject;
