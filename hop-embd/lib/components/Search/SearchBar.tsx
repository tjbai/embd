"use client";

import {
  Button,
  Collapse,
  filter,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Spinner,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { IoMdOptions } from "react-icons/io";

const labelStyles = {
  mt: "5px",
  ml: "-5px",
  color: "white",
  transform: "rotate(-50deg)",
  fontSize: { base: "10px", md: "15px" },
  fontWeight: "bold",
};

const defaultFilter = [2017, 2023];

export default function SearchBar({ smaller }: { smaller?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? undefined);
  const [filter, setFilter] = useState(defaultFilter);
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
    setOptionsOpen(false);
    if (filter[0] === defaultFilter[0] && filter[1] === defaultFilter[1])
      router.push(`/search?q=${query}`);
    else router.push(`/search?q=${query}&s=${filter[0]}&e=${filter[1]}`);
  };

  const handleMouseSubmit = () => {
    if (query === searchParams.get("q")) return;
    setLoading(true);
    setOptionsOpen(false);
    if (filter[0] === defaultFilter[0] && filter[1] === defaultFilter[1])
      router.push(`/search?q=${query}`);
    else router.push(`/search?q=${query}&s=${filter[0]}&e=${filter[1]}`);
  };

  return (
    <Flex w="100%" justify="center" align="center" direction="column">
      <form
        style={
          smaller
            ? {
                display: "flex",
                justifyContent: "center",
                width: "min(70%, 1000px)",
                boxShadow: "0 2px 4px rgba(0,0,0,1)",
              }
            : {
                display: "flex",
                justifyContent: "center",
                width: "min(90%, 1000px)",
                boxShadow: "0 5px 30px rgba(0,0,0,1)",
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

      <Collapse in={optionsOpen} animateOpacity>
        <Flex
          maxW="100vw"
          width={smaller ? "min(70vw, 1000px)" : "min(90vw, 1000px)"}
          borderRadius="5px"
          bg="transparent"
          px={{ base: "20px", md: "40px" }}
          pb="30px"
          mt="30px"
          direction="column"
          justify="center"
          h="40px"
        >
          <RangeSlider
            min={defaultFilter[0]}
            max={defaultFilter[1]}
            step={1}
            defaultValue={filter}
            onChangeEnd={(v) => setFilter(v)}
          >
            <RangeSliderTrack bg="#F7FAFC" h={{ base: "5px", md: "10px" }}>
              <RangeSliderFilledTrack bg="#0072CE" />
            </RangeSliderTrack>
            <RangeSliderThumb
              boxSize={{ base: "10px", md: "20px" }}
              index={0}
            />
            <RangeSliderThumb
              boxSize={{ base: "10px", md: "20px" }}
              index={1}
            />

            <RangeSliderMark value={2017} {...labelStyles}>
              2017
            </RangeSliderMark>
            <RangeSliderMark value={2018} {...labelStyles}>
              2018
            </RangeSliderMark>
            <RangeSliderMark value={2019} {...labelStyles}>
              2019
            </RangeSliderMark>
            <RangeSliderMark value={2020} {...labelStyles}>
              2020
            </RangeSliderMark>
            <RangeSliderMark value={2021} {...labelStyles}>
              2021
            </RangeSliderMark>
            <RangeSliderMark value={2022} {...labelStyles}>
              2022
            </RangeSliderMark>
            <RangeSliderMark value={2023} {...labelStyles}>
              2023
            </RangeSliderMark>
          </RangeSlider>
        </Flex>
      </Collapse>
    </Flex>
  );
}
