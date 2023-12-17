import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
} from "@chakra-ui/react";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Combobox } from "@headlessui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { ComponentExerciseTypeSelectorDocument } from "~/graphql/generated/documents";
import { gql } from "~/graphql/graphql.server";

export async function action({ request, params }: LoaderFunctionArgs) {
  const search = z
    .string()
    .parse(await request.formData().then((formData) => formData.get("search")));
  const { data } = await gql({
    document: ComponentExerciseTypeSelectorDocument,
    variables: { search },
    request,
  });

  return json(data?.exerciseTypes);
}

type Value = { id: string; name: string };

export function ExerciseCombobox({
  defaultValue,
  onChange,
  value,
}: {
  defaultValue?: Value;
  onChange?: (value: Value | undefined) => void;
  value?: Value;
}) {
  const fetcher = useFetcher<typeof action>();
  const suggestions = fetcher.data?.edges ?? [];

  return (
    <Box>
      <Combobox
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        as={Box}
        position="relative"
      >
        {({}) => (
          <>
            <InputGroup>
              <Combobox.Input
                onChange={(event) => {
                  fetcher.submit(
                    { search: event.target.value },
                    {
                      method: "POST",
                      action: "/components/exercise-type-selector",
                    }
                  );
                }}
                displayValue={(value) =>
                  value &&
                  typeof value === "object" &&
                  "name" in value &&
                  typeof value.name === "string"
                    ? value.name
                    : ""
                }
                as={Input}
              />
              <InputRightElement>
                <IconButton
                  icon={<FontAwesomeIcon icon={faTimesCircle} />}
                  aria-label="Återställ"
                  variant="unstyled"
                  onClick={() => {
                    onChange?.(undefined);
                  }}
                />
              </InputRightElement>
            </InputGroup>
            <Combobox.Options
              position="absolute"
              bg="white"
              width="100%"
              zIndex={1}
              as={List}
              boxShadow="md"
              borderRadius="md"
              p={1}
              maxH="50vh"
              overflowY="auto"
            >
              {suggestions.map(({ node }) => (
                <Combobox.Option key={node?.id} value={node} as={ListItem}>
                  {({ active, disabled, selected }) => (
                    <Box
                      bg={active ? "gray.50" : undefined}
                      fontWeight={selected ? "bold" : undefined}
                      px={2}
                      py={1}
                      opacity={disabled ? 0.5 : undefined}
                    >
                      {node?.name}
                    </Box>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </>
        )}
      </Combobox>
    </Box>
  );
}
