import { Outlet } from "@remix-run/react";
import { H1 } from "~/components/headings";
import { TitleHero } from "~/components/ui/title-hero";

export default function Activity() {
  return (
    <div>
      <TitleHero
        maxWidthClassName="max-w-screen-md"
        title={<H1>Träningspass</H1>}
      />
      <Outlet />
    </div>
  );
}
