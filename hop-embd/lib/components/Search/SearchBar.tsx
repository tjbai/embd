"use client";

import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { BsSearch } from "react-icons/bs";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? undefined);

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
    <form
      style={{ display: "flex", width: "100%", justifyContent: "center" }}
      onSubmit={query?.length ? handleMouseSubmit : () => {}}
    >
      <InputGroup w="100%" mb="30px">
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
        >
          <Icon
            color={query?.length ? "white" : "black"}
            fontSize={{ base: "17px", md: "25px" }}
            as={BsSearch}
          />
        </InputRightElement>
      </InputGroup>
    </form>
  );
}
