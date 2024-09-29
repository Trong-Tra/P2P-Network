import { keys } from '@libp2p/crypto'

import { PRIVATE_KEY } from './config'

const privKey = keys.privateKeyFromRaw(Buffer.from(PRIVATE_KEY, 'hex'))

console.log(privKey)