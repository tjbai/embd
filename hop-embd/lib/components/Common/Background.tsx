"use client";

import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Background({ children }: { children: ReactNode }) {
  return (
    <Flex
      w="100vw"
      h="100vh"
      direction="column"
      bgGradient={{
        base: "linear(to-b, rgba(25,25,50,0.97) 15%, rgba(4,4,14,1) 75%)",
        md: "radial(at top, rgba(25,25,50,0.97) 15%, rgba(4,4,14,1) 75%)",
      }}
    >
      {children}
    </Flex>
  );
}
