export const chokeHandler = () => {
    // choke: <len=0001><id=0>
}

export const unchokeHandler = () => {
    // unchoke: <len=0001><id=1>
}

export const haveHandler = (payload: Buffer, havePiece: number[]) => {
    // have: <len=0005><id=4><piece index>
    const pieceIndex = payload.readUInt32BE(0);
    havePiece.push(pieceIndex)
}

export const bitFieldHandler = (payload: Buffer, havePiece: number[]) => {
    // bitfield: <len=0001+X><id=5><bitfield>
    payload.forEach((bit, pieceIndex) => {
        if (bit === 1) {
            havePiece.push(pieceIndex);
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