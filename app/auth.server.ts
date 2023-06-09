import type { User as PrismaUser } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { unauthorized } from "remix-utils";
import { z } from "zod";
import { db } from "./db.server";
import { session } from "./session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<Pick<User, "id">>(session, {
  sessionKey: "user",
  sessionErrorKey: "auth-error",
});

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const { email, password } = z
      .object({ email: z.string().min(1), password: z.string().min(1) })
      .parse(Object.fromEntries(form.entries()));
    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.deletedAt) {
      throw new Error("Login failed");
    }
    const correctPassword =
      !!user.password && (await compare(password, user.password));
    if (!correctPassword) {
      throw new Error("Login failed");
    }
    return user;
  }),
  "user-pass"
);

export async function isAdmin(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (user?.email === "jonas@jdahl.se") {
    return true;
  }
  return false;
}

export async function assertIsAdmin(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (user?.email !== "jonas@jdahl.se") {
    throw unauthorized({ user });
  }
}

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await db.user.create({
    data: { email: email, password: await hash(password, 10) },
  });

  return user;
}

export type User = PrismaUser;
