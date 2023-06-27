import { Flex, HStack, Icon, Text } from "@chakra-ui/react";

export default function Header() {
  return (
    <Flex
      w="100%"
      maxW="min(95%, 1200px)"
      position="fixed"
      borderBottom="1.5px solid"
      borderColor="#787777"
      left="50%"
      transform="translate(-50%)"
      color="white"
      h={{ base: "40px", md: "50px" }}
    >
      <Flex
        flex={1}
        fontWeight="bold"
        align="center"
        fontSize={{ base: "15px", md: "18px" }}
      >
        Embedded SIS
      </Flex>
      <Flex
        flex={1}
        justify="flex-end"
        align="center"
        fontWeight="light"
        fontSize={{ base: "12px", md: "15px" }}
      >
        <HStack>
          <Text>About</Text>
          <Icon />
        </HStack>
      </Flex>
    </Flex>
  );
}
