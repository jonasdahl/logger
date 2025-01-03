import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ButtonLink } from "~/components/button-link";
import { H1 } from "~/components/headings";
import { Container } from "~/components/ui/container";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return json({
    success: new URL(request.url).searchParams.get("success") === "yes",
  });
}

export default function Question() {
  const { success } = useLoaderData<typeof loader>();

  return (
    <Container className="flex flex-col gap-5">
      <H1 className={success ? "text-green-700" : "text-red-600"}>
        {success ? "Rätt" : "Fel"}
      </H1>
      <div>
        <ButtonLink variant="outline" to="/laws/quiz">
          Nästa fråga
        </ButtonLink>
      </div>
    </Container>
  );
}
