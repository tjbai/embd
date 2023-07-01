"use client";

import PageWrapper from "@/lib/components/Common/PageWrapper";
import ResultsWrapper from "@/lib/components/Common/ResultsWrapper";
import { Flex, Heading, Text } from "@chakra-ui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <PageWrapper>
      <ResultsWrapper>
        <Flex direction="column" color="white">
          <Text>Something went wrong!</Text>
          <Text>{error.message}</Text>
          <button onClick={() => reset()}>Try again</button>
        </Flex>
      </ResultsWrapper>
    </PageWrapper>
  );
}
