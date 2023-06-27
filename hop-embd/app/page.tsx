"use client";

import Header from "@/lib/components/Common/Header";
import { Flex, Input, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      flex={1}
      m={0}
      h="100vh"
      direction="column"
      bgGradient={{
        base: "linear(to-b, rgba(25,25,50,0.97) 15%, rgba(4,4,14,1) 75%)",
        md: "radial(at top, rgba(25,25,50,0.97) 15%, rgba(4,4,14,1) 75%)",
      }}
    >
      <Header />
      <Flex
        flex={1}
        position="relative"
        top="20%"
        align="center"
        direction="column"
      >
        <Text
          fontWeight="extrabold"
          fontSize={{ base: "50px", md: "6vw" }}
          lineHeight={{ base: "55px", md: "6.5vw" }}
          textAlign="center"
          w="100%"
          maxW={{ base: "70%", md: "1200px" }}
          bgClip="text"
          bgGradient="linear(to-tl, #8a7575 10%, #fcf5f5 60%)"
        >
          Deep course search at Johns Hopkins
        </Text>
      </Flex>
    </Flex>
  );
}
