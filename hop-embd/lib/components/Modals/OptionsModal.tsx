import {
  Button,
  Checkbox,
  CheckboxGroup,
  filter,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useMContext } from "./MProvider";

const TERMS = ["Fall", "Intersession", "Spring"];
const YEARS = ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];

export default function OptionsModal() {
  const { optionsOpen, setOptionsOpen, filters, setFilters } = useMContext();

  const closeWithoutApply = () => {
    setOptionsOpen(false);
    // todo: reset state
  };

  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      setFilters((p: string[]) => [...p, value]);
    } else {
      setFilters((p: string[]) => p.filter((item) => item != value));
    }
  };

  const handleReset = () => {};

  return (
    <Modal isOpen={optionsOpen} onClose={closeWithoutApply} size="lg">
      <ModalOverlay />
      <ModalContent fontFamily="heading">
        <ModalHeader>
          <Text fontSize="30px" fontWeight="bold">
            Filter by Semester
          </Text>
          <Text fontWeight="normal" fontSize="17px">
            (Shows results for all semesters by default)
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flex={1} direction="column" w="90%" justify="center">
            {YEARS.map((y) => (
              <Flex key={y} justify="space-between" mb="5px">
                {TERMS.map((t) => (
                  <Checkbox
                    key={t + y}
                    name={t + " " + y}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.checked)
                    }
                    checked={filters.includes(t + " " + y)}
                  >
                    <Text w="60px" fontSize="17px">
                      {t.charAt(0) + " " + y.substring(2)}
                    </Text>
                  </Checkbox>
                ))}
              </Flex>
            ))}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            border="2px solid"
            borderColor="lightgrey"
            mr={3}
          >
            Reset
          </Button>
          <Button colorScheme="blue" onClick={() => setOptionsOpen(false)}>
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
