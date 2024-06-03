import net from "net"
import { Queue } from "../datastructures/Queue";

export interface connectionProperties {
    chocked:boolean,
    havePieces:number[]
}

export const chokeHandler = (socket:net.Socket) => {
    // choke: <len=0001><id=0>
    socket.end()
}

export const unchokeHandler = (socket:net.Socket,queue:Queue,connectionProperties:connectionProperties) => {
    // unchoke: <len=0001><id=1>
    connectionProperties.chocked=false;
    requestPiece(socket,connectionProperties,queue)
}

export const haveHandler = (payload: Buffer, socket:net.Socket, connectionProperties:connectionProperties,queue:Queue) => {
    // have: <len=0005><id=4><piece index>
    const pieceIndex = payload.readUInt32BE(0);
    connectionProperties.havePieces.push(pieceIndex)

    if(connectionProperties.havePieces.length===1){ // Doing this so it's called only once for a peer
        requestPiece(socket,connectionProperties,queue)
    }
}

export const bitFieldHandler = (payload: Buffer, connectionProperties:connectionProperties) => {
    // bitfield: <len=0001+X><id=5><bitfield>
    payload.forEach((bit, pieceIndex) => {
        if (bit === 1) {
            connectionProperties.havePieces.push(pieceIndex);
        }
    })
}

export const requestHandler = () => {
    // request: <len=0013><id=6><index><begin><length>
}

export const pieceHandler = () => {
    // piece: <len=0009+X><id=7><index><begin><block>
}

export const cancelHandler = () => {
    // cancel: <len=0013><id=8><index><begin><length>
}
export const portHandler = () => {
    // port: <len=0003><id=9><listen-port>
}

export const defaultHandler = () => {

}

const requestPiece = (socket:net.Socket, connectionProperties:connectionProperties,queue:Queue) =>{
    // Have to handle the request piece functionality

    if(connectionProperties.chocked) return null;
    
    while(connectionProperties.havePieces.length){
        const pieceIndex = connectionProperties.havePieces.shift()
        if(pieceIndex && !queue.isRequested(pieceIndex)){
            //socket.write(message.buildRequest(pieceIndex))
            queue.setRequested(pieceIndex)
        }
    }
}
