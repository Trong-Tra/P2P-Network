import { createLibp2p, type Libp2p } from 'libp2p'
import { type PubSub, type PrivateKey } from '@libp2p/interface'
import { tcp } from '@libp2p/tcp'
import { yamux } from '@chainsafe/libp2p-yamux'
import { noise } from '@chainsafe/libp2p-noise'

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
        // Start
        this.swarm.addEventListener('start', () => {
            swarm.getMultiaddrs().forEach((addr) => {
                console.info('✅ The node is listening on', addr.toString())
            })
        })

        // Connection
        this.swarm.addEventListener('peer:connect', ({ detail: peer }) => {
            console.info('🔗 Connected to', peer.toString())
        })

        // Discovery
        this.swarm.addEventListener('peer:discovery', async ({ detail }) => {
            console.info('🔍 Discovery:', detail.id.toString())
        })

        // Identification
        this.swarm.addEventListener('peer:identify', ({ detail }) => {
            console.info('🔑 Identified new peer:', detail.peerId.toString())
        })

        // Disconnect
        this.swarm.addEventListener('peer:disconnect', ({ detail }) => {
            console.info('💔 Disconnected to', detail.toString())
        })

        // Stop
        this.swarm.addEventListener('stop', () => {
            console.info('⛔️ The node is terminated')
        })
    }
}