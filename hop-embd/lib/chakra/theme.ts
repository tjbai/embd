import { extendTheme } from "@chakra-ui/react";

import "@fontsource/roboto";
import "@fontsource/kanit";

const theme = extendTheme({
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
