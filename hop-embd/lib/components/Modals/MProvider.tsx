import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import OptionsModal from "./OptionsModal";

export interface ModalContext {
  optionsOpen: boolean;
  setOptionsOpen: Dispatch<SetStateAction<boolean>>;
  filters: string[];
  setFilters: Dispatch<SetStateAction<any>>;
}

const modalContext = createContext({} as ModalContext);

export default function MProvider({ children }: { children: ReactNode }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [filters, setFilters] = useState([]);

  return (
    <modalContext.Provider
      value={{ optionsOpen, setOptionsOpen, filters, setFilters }}
    >
      <OptionsModal />
      {children}
    </modalContext.Provider>
  );
}

export const useMContext = () => useContext(modalContext);
