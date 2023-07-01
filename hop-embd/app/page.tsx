"use client";

import SearchBar from "@/lib/components/Search/SearchBar";
import { Flex, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      height="fit-content"
      top="30%"
      transform="translate(0%, -30%)"
      position="relative"
      align="center"
      direction="column"
    >
      <Text
        fontSize={{ base: "45px", md: "6vw" }}
        lineHeight={{ base: "50px", md: "6.5vw" }}
        textAlign="center"
        w="100%"
        maxW={{ base: "70%", md: "min(70%, 1200px)" }}
        bgClip="text"
        bgGradient="linear(to-tl, #75878a 10%, #ffffff 60%)"
        letterSpacing="-0.2vw"
        mb="4vh"
      >
        Deep course search at Johns Hopkins
      </Text>
      <SearchBar smaller />
    </Flex>
  );
}
