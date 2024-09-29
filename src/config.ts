import 'dotenv/config'
import { z } from 'zod'

const config = z
    .object({
        PRIVATE_KEY: z.string().optional(),
    })
    .parse(process.env)

export const { PRIVATE_KEY } = config