import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Träningsdagbok",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ChakraProvider theme={theme}>
          <Outlet />
          <ColorModeScript />
        </ChakraProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const theme = extendTheme({
  // fonts: {
  //   heading: `'StagSans', sans-serif`,
  //   body: `'StagSans', sans-serif`,
  // },
  colors: {
    blue: {
      "50": "#E6F4FF",
      "100": "#B9DFFE",
      "200": "#8BCAFD",
      "300": "#5EB6FD",
      "400": "#31A1FC",
      "500": "#038CFC",
      "600": "#0370C9",
      "700": "#025293",
      "800": "#013865",
      "900": "#011C32",
    },
    yellow: {
      "50": "#FFFAE6",
      "100": "#FFF1B8",
      "200": "#FEE88A",
      "300": "#FEDE5D",
      "400": "#fed324",
      "500": "#FECC01",
      "600": "#CBA301",
      "700": "#987A01",
      "800": "#665200",
      "900": "#332900",
    },
  },
});
