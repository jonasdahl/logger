import { useLocation, useSearchParams } from "@remix-run/react";

export function useReturnToUrl() {
  const { pathname, search } = useLocation();
  return encodeURIComponent(`${pathname}${search}`);
}

export function useReturnToUrlParam() {
  const [searchParams] = useSearchParams();
  return searchParams.get("returnTo") || null;
}

export function HiddenReturnToInput() {
  const returnToUrl = useReturnToUrlParam();

  if (!returnToUrl) {
    return null;
  }
  return <input type="hidden" name="returnTo" value={returnToUrl} />;
}
