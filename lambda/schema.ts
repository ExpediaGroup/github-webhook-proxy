import { z } from 'zod';

export const urlSchema = z.string().url();

export const bodySchema = z.object({
  payload: z.string()
});

export const CONTENT_TYPES = {
  JSON: 'application/json',
  URL_ENCODED: 'application/x-www-form-urlencoded'
} as const;

// headerSchema that supports either 'Content-Type' or 'content-type'
export const headersSchema = z.object({
  'content-type': z.string().optional(),
  'Content-Type': z.string().optional()
}).refine((headers) => {
  return headers['content-type'] || headers['Content-Type'];
}, {
  message: 'Missing Content-Type header'
});

export const axiosErrorSchema = z.object({
  response: z.object({
    status: z.number(),
    headers: z.any(),
    data: z.any()
  })
});
