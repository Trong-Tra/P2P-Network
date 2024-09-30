import 'dotenv/config'
import { z } from 'zod'

const config = z
    .object({
        PRIVATE_KEY: z.string().optional(),
        PORT: z.string().transform((val) => parseInt(val, 10)).default('3000')
    })
    .parse(process.env)

export const { PRIVATE_KEY, PORT } = config