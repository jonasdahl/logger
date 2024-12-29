import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { config } from "@fortawesome/fontawesome-svg-core";
import faStyles from "@fortawesome/fontawesome-svg-core/styles.css?url";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { H1 } from "./components/headings";
import { BottomMenu } from "./routes/__dashboard/bottom-menu";
import styles from "./tailwind.css?url";

config.autoAddCss = false;

export const meta: MetaFunction = () => [
  { charSet: "utf-8" },
  { title: "Träningsdagbok" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
];

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: faStyles, type: "text/css" },
    { rel: "stylesheet", href: styles },
  ];
};

export default function App() {
  return (
    <html lang="en" style={{ height: "100%", minHeight: "100%" }}>
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ height: "100%", minHeight: "100%" }}>
        <ChakraProvider theme={theme}>
          <Outlet />
          <ColorModeScript />
        </ChakraProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en" style={{ height: "100%", minHeight: "100%" }}>
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ height: "100%", minHeight: "100%" }}>
        <div className="container mx-auto py-6 px-4 max-w-screen-md flex flex-col gap-5">
          <H1 className="text-2xl font-bold">Ett fel uppstod</H1>
          <p>
            Den här sidan verkar inte vara tillgänglig just nu. Försök igen
            senare.
          </p>
          {isRouteErrorResponse(error) ? (
            <p>
              Felkod: {error.status || -1} - {error.statusText || "Okänt fel"}
            </p>
          ) : null}
        </div>
        <BottomMenu />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const theme = extendTheme({
  // fonts: {
  //   heading: `'StagSans', sans-serif`,
  //   body: `'StagSans', sans-serif`,
  // },

  components: {
    Alert: {
      baseStyle: {
        container: { borderRadius: "md" },
      },
    },
  },

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
