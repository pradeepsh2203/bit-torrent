import { Buffer } from "buffer";
import { LocalStorage } from "../data/LocalStorage";

export const buildHandshakePacket = () => {
    const localStorage = new LocalStorage();

    const buffer = Buffer.alloc(68);
    buffer.writeUInt8(19, 0); //protocol string len
    buffer.write('BitTorrent protocol', 1); //protocol string
    buffer.writeBigInt64BE(BigInt(0), 20); // reserved bits

    if (localStorage.data.torrentInfo) {
        Buffer.from(localStorage.data.torrentInfo.InfoHash.data).copy(buffer, 28);
    } else {
        throw new Error("TCP connection to clients Requires a InfoHash");
    }
    if (localStorage.data.peerId) {
        Buffer.from(localStorage.data.peerId.data).copy(buffer, 48);
    }
    else {
        throw new Error("TCP connection to clients requires a PeerId");
    }
    return buffer;
}

export const buildKeepAlive = () => {  //id=0
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(0, 0);
    return buffer;
}

export const buildChoke = () => {
    const buffer = Buffer.alloc(5);
    buffer.writeInt32BE(1, 0);//length
    buffer.writeInt8(0, 4)
    return buffer;
}

export const buildUnChoke = () => {
    const buffer = Buffer.alloc(5);
    buffer.writeInt32BE(1, 0);//length
    buffer.writeInt8(1, 4)
    return buffer;
}

export const buildInterested = () => {
    const buffer = Buffer.alloc(5);
    buffer.writeInt32BE(1, 0);//length
    buffer.writeInt8(2, 4)
    return buffer;
}

export const buildNotInterested = () => {
    const buffer = Buffer.alloc(5);
    buffer.writeInt32BE(1, 0);//length
    buffer.writeInt8(3, 4)
    return buffer;
}
