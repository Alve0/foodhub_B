import { ROLE } from "../../generated/prisma/enums";

export interface IUserData {
  name: string;
  email: string;
  password: string;
  image?: string;
}
