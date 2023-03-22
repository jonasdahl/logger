import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { authSessionStorage } from "./session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(authSessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");
    let user = await login(email, password);
    return user;
  }),
  "user-pass"
);

function login() {
  return {};
}
