import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { InlineLink } from "~/components/ui/inline-link";

export function OnboardingAlert() {
  return (
    <Alert>
      <AlertTitle>
        Börja med att sätta upp anslutningar till tredjepartsappar.
      </AlertTitle>
      <AlertDescription>
        <InlineLink to="/connections">Kom igång</InlineLink>
      </AlertDescription>
    </Alert>
  );
}
