import type { FormEvent } from "react";
import { Form } from "react-router";

export function UnsealButton() {
  const hSubmit = (evt: FormEvent<HTMLFormElement>) => {
    if (!window.confirm("Sur de vouloir desceller ce Scenario ?"))
      evt.preventDefault();
  };

  return (
    <Form method="POST" onSubmit={hSubmit}>
      <button type="submit">Ouvrir</button>
    </Form>
  );
}
