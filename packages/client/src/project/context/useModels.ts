import { Model } from '@scrrap/core';
import { useQuery } from 'react-query';
import { authenticatedFetch } from '../../authentication/authenticatedFetch';

const getModels = async (): Promise<Model[]> => {
  const response = await authenticatedFetch(
    `${process.env.REACT_APP_API_URL}/models`,
  );
  return await response.json();
};

const useModels = () => {
  const modelsQuery = useQuery('models', getModels, {
    useErrorBoundary: true,
  });
  return {
    models: modelsQuery.data,
    loading: modelsQuery.isLoading,
  };
};

export default useModels;
