import net from "net";
import { Queue } from "../datastructures/Queue";
import { LocalStorage, torrentInfo } from "../data/LocalStorage";

const BLOCK_LEN = Math.pow(2, 14);

export interface connectionProperties {
	chocked: boolean;
	havePieces: number[];
}

export const chokeHandler = (socket: net.Socket) => {
	// choke: <len=0001><id=0>
	socket.end();
};

export const unchokeHandler = (
	socket: net.Socket,
	queue: Queue,
	connectionProperties: connectionProperties
) => {
	// unchoke: <len=0001><id=1>
	connectionProperties.chocked = false;
	console.log("Recieved an unchocke request");
	// requestPiece(socket, connectionProperties, queue);
};

export const haveHandler = (
	payload: Buffer,
	socket: net.Socket,
	connectionProperties: connectionProperties,
	queue: Queue
) => {
	// have: <len=0005><id=4><piece index>
	const pieceIndex = payload.readUInt32BE(0);
	connectionProperties.havePieces.push(pieceIndex);

	if (connectionProperties.havePieces.length === 1) {
		// Doing this so it's called only once for a peer
		requestPiece(socket, connectionProperties, queue);
	}
	console.log(
		"Recieved an Have request",
		pieceIndex,
		connectionProperties.havePieces
	);
};

export const bitFieldHandler = (
	payload: Buffer,
	connectionProperties: connectionProperties
) => {
	// bitfield: <len=0001+X><id=5><bitfield>
	console.log("Recieve an bitfield Request", payload, payload.length);

	const len = payload.length;
	for (let i = 0; i < len; i++) {
		let num = payload.readUInt8();
		for (let j = 0; j < 8; j++) {
			if (num % 2 == 1) {
				connectionProperties.havePieces.push(i * 8 + 7 - j);
			}
			num = Math.floor(num / 2);
		}
	}

	console.log("BitField Have arr", connectionProperties.havePieces);
};

export const requestHandler = () => {
	// request: <len=0013><id=6><index><begin><length>
};

export const pieceHandler = () => {
	// piece: <len=0009+X><id=7><index><begin><block>
};

export const cancelHandler = () => {
	// cancel: <len=0013><id=8><index><begin><length>
};
export const portHandler = () => {
	// port: <len=0003><id=9><listen-port>
};

export const defaultHandler = () => {};

const pieceLength = (torrentInfo: torrentInfo, pieceIndex: number) => {
	const totLen = torrentInfo.Length;
	const pieceLen = torrentInfo.PieceLength;

	// Incase the pieceLen divides the totLen, the lastPieceInd would be +1 to the max possible piece ind and thus unatainable... So it should handle the edge case of the LastPieceLength to be zero;
	const lastPieceInd = Math.floor(totLen / pieceLen);
	const lastPieceLength = totLen % pieceLen;
	console.log(
		"Piece Information",
		totLen,
		pieceLen,
		lastPieceInd,
		lastPieceLength
	);
	return pieceIndex === lastPieceInd ? lastPieceLength : pieceLen;
};

const blocksPerPiece = (torrentInfo: torrentInfo, pieceInd: number) => {
	const pieceLen = pieceLength(torrentInfo, pieceInd);
	const blockSize = BLOCK_LEN;

	return Math.ceil(pieceLen / blockSize);
};

const blockLen = (
	torrentInfo: torrentInfo,
	pieceInd: number,
	blockInd: number
) => {
	const pieceLen = pieceLength(torrentInfo, pieceInd);
	const blockLen = BLOCK_LEN;

	const lastBlockInd = Math.floor(pieceLen / blockLen);
	const lastBlockLen = pieceLen % blockLen;

	console.log(
		"Blocks Information",
		blockLen,
		pieceLen,
		lastBlockInd,
		lastBlockLen
	);

	return blockInd == lastBlockInd ? lastBlockLen : blockLen;
};

const requestPiece = (
	socket: net.Socket,
	connectionProperties: connectionProperties,
	queue: Queue
) => {
	// Have to handle the request piece functionality

	if (connectionProperties.chocked) return null;
	console.log("Requesting Pieces from the peer");
	console.log(connectionProperties.havePieces);

	const data = new LocalStorage();
	const torrentinfo = data.data.torrentInfo;

	while (connectionProperties.havePieces.length) {
		const pieceIndex = connectionProperties.havePieces.shift();
		console.log("This piece is available", pieceIndex);
		const pieceLen = pieceLength(torrentinfo!, pieceIndex!); // you can append a non null operator to say that these variable will not be null durning runtime
		if (pieceIndex && !queue.isRequested(pieceIndex)) {
			const numOfBlocks = blocksPerPiece(torrentinfo!, pieceIndex);
			for (let i = 0; i < numOfBlocks; i++) {
				//socket.write(message.buildRequest(pieceIndex))
			}
			queue.setRequested(pieceIndex);
		}
	}
};
