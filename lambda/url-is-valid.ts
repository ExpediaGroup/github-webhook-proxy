import { urlSchema } from './schema';

export function urlIsValid(url: string) {
  return urlSchema.safeParse(url).success;
}
