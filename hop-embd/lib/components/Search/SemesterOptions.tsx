import {
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  VStack,
} from "@chakra-ui/react";

const TERMS = ["Fall", "Intersession", "Spring"];
const YEARS = ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];

export default function SelectOptions() {
  return (
    <Flex w="100%" bg="white">
      <CheckboxGroup colorScheme="blue" defaultValue={["Fall 2023"]}>
        <VStack>
          {YEARS.map((y) => (
            <VStack key={y}>
              {TERMS.map((t) => (
                <Checkbox key={t + y} value={t + " " + y}>
                  {t.charAt(0) + y.substring(2)}
                </Checkbox>
              ))}
            </VStack>
          ))}
        </VStack>
      </CheckboxGroup>
    </Flex>
  );
}
