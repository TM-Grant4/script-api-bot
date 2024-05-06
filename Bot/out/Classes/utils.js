import Crypto from "crypto";
export const key = () => Crypto.randomBytes(8).toString("base64");
