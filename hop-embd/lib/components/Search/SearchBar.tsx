"use client";

import {
  Button,
  Collapse,
  Flex,
  Grid,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { MiddlewareNotFoundError } from "next/dist/shared/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { IoMdOptions } from "react-icons/io";

const TERMS = ["Fall", "Intersession", "Spring"];
const YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017];

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? undefined);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query === searchParams.get("q")) return;
    router.push(`/search?q=${query}`);
  };

  const handleMouseSubmit = () => {
    if (query === searchParams.get("q")) return;
    router.push(`/search?q=${query}`);
  };

  return (
    <Flex w="100%" justify="center" align="center" mb="30px" direction="column">
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          width: "min(90%, 1000px)",
        }}
        onSubmit={query?.length ? handleSubmit : () => {}}
      >
        <InputGroup w="100%">
          <Input
            variant="outline"
            bg="#F7FAFC"
            h={{ base: "40px", md: "50px" }}
            placeholder="Show me courses about..."
            fontSize={{ base: "15px", md: "20px" }}
            _focus={{ boxShadow: "none" }}
            onSubmit={() => console.log("input")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputRightElement
            h={{ base: "40px", md: "50px" }}
            w={{ base: "40px", md: "50px" }}
            bg={query?.length ? "#0072CE" : "transparent"}
            borderRightRadius="5px"
            transition="0.3s background"
            onClick={query?.length ? handleMouseSubmit : () => {}}
            _hover={{ cursor: query?.length ? "pointer" : "auto" }}
          >
            <Icon
              color={query?.length ? "white" : "black"}
              fontSize={{ base: "17px", md: "25px" }}
              as={BsSearch}
            />
          </InputRightElement>
        </InputGroup>

        <Button
          h={{ base: "40px", md: "50px" }}
          w={{ base: "40px", md: "50px" }}
          ml="10px"
          bg={optionsOpen ? "#0072CE" : "#F7FAFC"}
          color={optionsOpen ? "white" : "black"}
          onClick={() => setOptionsOpen((p) => !p)}
          transition="0.25s"
          _hover={{
            bg: optionsOpen ? "#0072CE" : "#F7FAFC",
          }}
        >
          <Icon as={IoMdOptions} fontSize={{ base: "17px", md: "25px" }} />
        </Button>
      </form>

      <Collapse in={optionsOpen} animateOpacity></Collapse>
    </Flex>
  );
}
