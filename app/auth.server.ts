import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { authSessionStorage } from "./session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(authSessionStorage, {
  sessionKey: "user",
});

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");
    let user = await login(email as any, password as any);
    return user;
  }),
  "user-pass"
);

async function login(email: string, password: string): User {
  throw new Error("Invalid user");
}

export type User = {
  id: string;
};
