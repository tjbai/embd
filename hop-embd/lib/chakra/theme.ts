import { extendTheme } from "@chakra-ui/react";

import "@fontsource/roboto";
import "@fontsource/kanit";

const variantOutlined = () => ({
  field: {
    _focus: {
      borderColor: "red",
      boxShadow: "0 0 0 2px red",
    },
  },
});

const theme = extendTheme({
  components: {
    Input: {
      variants: {
        outline: variantOutlined,
      },
    },
  },
  fonts: {
    body: `'Roboto', sans-serif`,
  },
  textStyles: {
    head: {
      fontFamily: `'Kanit', sans-serif`,
    },
    alt: {
      fontFamily: `'Roboto', sans-serif`,
    },
  },
});

export default theme;
