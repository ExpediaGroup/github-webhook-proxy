import { z } from 'zod';

export const urlSchema = z.string().url();

export const bodySchema = z.object({
  payload: z.string()
});

export const CONTENT_TYPES = {
  JSON: 'application/json',
  URL_ENCODED: 'application/x-www-form-urlencoded'
} as const;

export const headersSchema = z.object({
  'content-type': z.nativeEnum(CONTENT_TYPES)
});

export const axiosErrorSchema = z.object({
  response: z.object({
    status: z.number(),
    headers: z.any(),
    data: z.any()
  })
});