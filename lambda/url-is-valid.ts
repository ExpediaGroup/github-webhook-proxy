import { urlSchema } from "./schema";

export function urlIsValid(url: string) {
  const urlIsValid = urlSchema.safeParse(url).success;
  if (!urlIsValid) {
    console.error("Invalid URL:", url);
  }
  return urlIsValid;
}
