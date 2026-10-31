import { isRouteErrorResponse, useRouteError } from "react-router";

export function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>Le router a remonté une erreur</h1>
        <p>Plus d'informations:</p>
        <ul>
          <li>Status: {error.status}</li>
          {/* ⚠️: plante si `data` contient un objet. Ne throw que des strings ! */}
          <li>Data: {error.data}</li>
        </ul>
      </>
    );
  }

  if (error instanceof Error) {
    return (
      <>
        <h1>Une erreur imprévue est apparemment survenue</h1>
        {import.meta.env.DEV && (
          <>
            <p>Plus d'informations:</p>
            <ul>
              <li>Name: {error.name}</li>
              <li>Message: {error.message}</li>
            </ul>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <h1>... Dafuq ?</h1>
      <p>On ne devrait jamais passer ici, quelque chose a vraiment pété</p>
    </>
  );
}
