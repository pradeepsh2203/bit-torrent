import { Socket } from "dgram";
import { buildHandshakePacket, buildInterested } from "../Packets/handshake_packets";
import { LocalStorage } from "../data/LocalStorage"
import net from "net";

export const initiateHandShake = () => {
    const localStorgae = new LocalStorage();
    const peers = localStorgae.data.peers;
    const handShakePacket = buildHandshakePacket();
    peers.forEach(peer => connectToPeer(peer, handShakePacket))
}

const connectToPeer = (peer: { ipAddress: string, portNo: number }, handShakePacket: Buffer) => {
    const socket = new net.Socket();
    socket.on('error', (err) => {
        console.log(err);
    })

    socket.connect(peer.portNo, peer.ipAddress, () => {
        socket.write(handShakePacket);
    })

    aggregrateInputBuffer(socket, respHandler);
}

const aggregrateInputBuffer = (socket: net.Socket, callback: (buffer: Buffer, socket: net.Socket) => void) => {
    let savedBuffer = Buffer.alloc(0);
    let handshake = true;

    socket.on('data', recBuffer => {
        savedBuffer = Buffer.concat([savedBuffer, recBuffer]);
        let msgLen = handshake ? savedBuffer.readUInt8(0) + 49 : savedBuffer.readInt32BE(0) + 4;

        if (savedBuffer.length >= msgLen) {
            callback(savedBuffer.subarray(0, msgLen), socket);
            savedBuffer = savedBuffer.subarray(msgLen);
            handshake = false;
        }

    })
}

const respHandler = (msg: Buffer, socket: net.Socket) => {
    console.log(msg.toString('utf-8'))
    if (isHandshake(msg)) {
        socket.write(buildInterested());
    }
}

const isHandshake = (msg: Buffer) => {
    return (msg.length === msg.readUInt8(0) + 49) && (msg.toString('utf-8', 1, msg.readUInt8(0)) === 'BitTorrent protocol');
}