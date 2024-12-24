import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { InlineLink } from "~/components/ui/inline-link";

export function FogisSyncAlert() {
  return (
    <Alert>
      <AlertTitle>
        Det var mer än en vecka sedan du synkade mot Fogis.
      </AlertTitle>
      <AlertDescription>
        <InlineLink to="/connections/fogis">Gör det nu.</InlineLink>
      </AlertDescription>
    </Alert>
  );
}
