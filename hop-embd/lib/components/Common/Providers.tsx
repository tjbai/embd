"use client";

import theme from "@/lib/chakra/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
