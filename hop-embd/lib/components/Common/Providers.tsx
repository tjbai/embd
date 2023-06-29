"use client";

import theme from "@/lib/chakra/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./Header";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      {children}
    </ChakraProvider>
  );
}
