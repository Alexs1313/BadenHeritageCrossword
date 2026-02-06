import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import Sound from 'react-native-sound';

type StoreContextValue = {
  isEnabledVibration: boolean;
  setIsEnabledVibration: React.Dispatch<React.SetStateAction<boolean>>;

  isEnabledSound: boolean;
  setIsEnabledSound: React.Dispatch<React.SetStateAction<boolean>>;

  isEnabledNotifications: boolean;
  setIsEnabledNotifications: React.Dispatch<React.SetStateAction<boolean>>;

  winClick: () => void;
  loseClick: () => void;
};

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined,
);

export const useBadenStore = (): StoreContextValue => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within ContextProvider');
  }
  return ctx;
};

export const ContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isEnabledVibration, setIsEnabledVibration] = useState<boolean>(false);
  const [isEnabledSound, setIsEnabledSound] = useState<boolean>(false);
  const [isEnabledNotifications, setIsEnabledNotifications] =
    useState<boolean>(false);

  const values = {
    isEnabledVibration,
    setIsEnabledVibration,
    isEnabledSound,
    setIsEnabledSound,
    isEnabledNotifications,
    setIsEnabledNotifications,
  } as StoreContextValue;

  return (
    <StoreContext.Provider value={values}>{children}</StoreContext.Provider>
  );
};
