import bcrypt from "bcryptjs";

export const hashPassword = (unHashPass: string) =>
  bcrypt.hash(unHashPass, 10).then((hash) => hash);

export const comparePassword = (unHashPass: string, hashPassword: string) =>
  bcrypt.compare(unHashPass, hashPassword).then((result) => result);
