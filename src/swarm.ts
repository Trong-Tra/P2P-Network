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
    identifyPush: IdentifyPush
    pubsub: PubSub<GossipsubEvents>
    dht: KadDHT
}>

/**
 * @description Swarm representing a P2P node
 */
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

    /**
     * @dev this method create a new Swarm
     * @note node listen on a specific IP and port using TCP
     * @note node descover and connect peers via bootstrap
     * @note method using noise for encryption and yamux for multiplexing
     * @param privateKey for establishing the node's identiry
     */
    static new = async <E extends PrivateKey>(privateKey: E) => {
        const swarm = await createLibp2p({
            start: false, // manually start 
            privateKey,
            addresses: {
                listen: ['/ip4/0.0.0.0/tcp/${PORT}'] // use tcp protocol
            },
            transports: [tcp()],
            streamMuxers: [yamux()],
            connectionEncrypters: [noise()],
            peerDiscovery: [
                bootstrap({
                    list: [
                        '/ip4/13.238.141.54/tcp/8000/p2p/16Uiu2HAmDeYxA7kGADGhPBHeQTCheqB6qfpWFc1GHJu1niosGyRK',
                    ],
                }),
            ],
            services: {
                identify: identify(),
                identifyPush: identifyPush(),
                pubsub: gossipsub(),
                dht: kadDHT({
                    clientMode: false,
                    peerInfoMapper: passthroughMapper,
                }),
            },
        })

        return new Swarm(swarm)
    }
}