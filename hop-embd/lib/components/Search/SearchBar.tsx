"use client";

import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { IoMdOptions } from "react-icons/io";
import { useMContext } from "../Modals/MProvider";

export default function SearchBar({ smaller }: { smaller?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { optionsOpen, setOptionsOpen } = useMContext();

  const [query, setQuery] = useState(searchParams.get("q") ?? undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading && query === searchParams.get("q")) {
      setLoading(false);
    }
  }, [query, searchParams]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query === searchParams.get("q")) return;
    setLoading(true);
    router.push(`/search?q=${query}`);
  };

  const handleMouseSubmit = () => {
    if (query === searchParams.get("q")) return;
    setLoading(true);
    router.push(`/search?q=${query}`);
  };

  return (
    <Flex w="100%" justify="center" align="center" mb="30px" direction="column">
      <form
        style={
          smaller
            ? {
                display: "flex",
                justifyContent: "center",
                width: "min(70%, 1000px)",
              }
            : {
                display: "flex",
                justifyContent: "center",
                width: "min(90%, 1000px)",
              }
        }
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
            value={query}
            onChange={(e) => {
              if (!loading) setQuery(e.target.value);
            }}
            disabled={loading}
            _disabled={{ bg: "lightgrey" }}
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
            {loading ? (
              <Spinner
                size={{ base: "sm", md: "md" }}
                color="white"
                thickness="2px"
              />
            ) : (
              <Icon
                color={query?.length ? "white" : "black"}
                fontSize={{ base: "17px", md: "25px" }}
                as={BsSearch}
              />
            )}
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
    </Flex>
  );
}
