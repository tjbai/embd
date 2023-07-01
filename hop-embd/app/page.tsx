"use client";

import SearchBar from "@/lib/components/Search/SearchBar";
import { Flex, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      top={{ base: "50%", md: "45%" }}
      transform={{ base: "translate(0%, -40%)", md: "translate(0%, -45%)" }}
      height="calc(100svh - 45%)"
      position="relative"
      align="center"
      direction="column"
    >
      <Text
        fontSize={{ base: "40px", md: "70px", lg: "90px" }}
        lineHeight={{ base: "40px", md: "75px", lg: "100px" }}
        textAlign="center"
        w="100%"
        maxW={{ base: "80%", md: "min(75%, 1000px)" }}
        bgClip="text"
        bgGradient="linear(to-tl, #75878a 10%, #ffffff 60%)"
        letterSpacing={{ base: "-0px", md: "-2px", lg: "-3px" }}
        mb="4vh"
      >
        Deep course search at Johns Hopkins
      </Text>

      <SearchBar smaller />
    </Flex>
  );
}
