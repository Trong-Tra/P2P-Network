import { createLibp2p, type Libp2p } from 'libp2p'
import { type PubSub, type PrivateKey } from '@libp2p/interface'
import { tcp } from '@libp2p/tcp'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noice } from '@chainsafe/libp2p-noise'

import {
    type Identify,
    identify,
    type IdentifyPush,
    identifyPush
} from '@libp2p/identify'

import { gossipsub, type GossipsubEvents } from '@chainsafe/libp2p-gossipsub'
import { type KadDHT, kadDHT, passthroughMapper } from '@libp2p/kad-dht'
import { bootstrap } from '@libp2p/bootstrap'

import { PORT } from './config'

export type SwarmProps = Libp2p<{
    identify: Identify
    identifyPysh: IdentifyPush
    pubsub: PubSub<GossipsubEvents>
    dht: KadDHT
}>

export default class Swarm {
    constructor(public readonly swarm: SwarmProps) {
        this.swarm.addEventListener('start', () => {
            swarm.getMultiaddrs().forEach((addr) => {
                console.info('✅ The node is listening on', addr.toString())
            })
        })
    }
}