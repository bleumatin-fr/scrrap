import { createContext, ReactNode, useContext } from 'react';
import { useSessionStorage } from 'usehooks-ts';

export interface StateType {
  pathname: string | null;
  index: number;
  value?: any;
  name: string;
}
interface BackToContextType {
  state: StateType | null;
  setState: (state: StateType | null) => void;
}

export const BackToContext = createContext<BackToContextType>({
  state: null,
  setState: () => {},
});
BackToContext.displayName = 'BackToContext';

export const Provider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useSessionStorage<StateType | null>(
    'back-to',
    null,
  );
  const value = { state, setState: setState };
  return (
    <BackToContext.Provider value={value}>{children}</BackToContext.Provider>
  );
};

const useStep = () => useContext(BackToContext);

export default useStep;
