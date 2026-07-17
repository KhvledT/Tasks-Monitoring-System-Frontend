import { z } from 'zod';

export const createVesselSchema = z.object({
  name: z.string().min(1, 'Vessel name is required'),
  type: z.string().min(1, 'Vessel type is required'),
  grt: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number().nonnegative('GRT must be a non-negative number').optional()
  ),
  dwt: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number().nonnegative('DWT must be a non-negative number').optional()
  ),
});

export type CreateVesselFormValues = z.infer<typeof createVesselSchema>;
