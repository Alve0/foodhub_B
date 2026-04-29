import { betterAuth } from "better-auth";
import { ROLE } from "../generated/prisma/enums";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: ROLE.CUSTOMER,
      },
    },
  },
});
