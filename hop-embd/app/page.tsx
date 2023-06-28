"use client";

import Header from "@/lib/components/Common/Header";
import {
  Flex,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/search?q=${query}`);
  };

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
        height="fit-content"
        top="30%"
        transform="translate(0%, -30%)"
        position="relative"
        align="center"
        direction="column"
      >
        <Text
          fontSize={{ base: "50px", md: "6vw" }}
          lineHeight={{ base: "55px", md: "6.5vw" }}
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

        <form
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
          onSubmit={handleSubmit}
        >
          <InputGroup maxW={{ base: "70%", md: "min(60%, 900px)" }}>
            <Input
              variant="outline"
              bg="#F7FAFC"
              h={{ base: "40px", md: "50px" }}
              placeholder="Show me courses about..."
              fontSize={{ base: "15px", md: "20px" }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              _focus={{ boxShadow: "none" }}
              onSubmit={() => console.log("input")}
            />
            <InputRightElement
              h={{ base: "40px", md: "50px" }}
              w={{ base: "40px", md: "50px" }}
              bg={query.length ? "#0072CE" : "#F7FAFC"}
              borderRightRadius="5px"
              _hover={{ cursor: query.length ? "pointer" : "auto" }}
              onClick={query.length ? handleSubmit : () => {}}
            >
              <Icon
                color={query.length ? "white" : "black"}
                fontSize={{ base: "17px", md: "25px" }}
                as={BsSearch}
              />
            </InputRightElement>
          </InputGroup>
        </form>
      </Flex>
    </Flex>
  );
}
