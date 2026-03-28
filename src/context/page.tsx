import { createContext } from "react";

type PageContextType = Record<string, never>;

export const PageContext = createContext<PageContextType>({});
