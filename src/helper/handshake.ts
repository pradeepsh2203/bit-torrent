import {
	buildHandshakePacket,
	buildInterested,
} from "../Packets/handshake_packets";
import {
	bitFieldHandler,
	cancelHandler,
	chokeHandler,
	connectionProperties,
	defaultHandler,
	haveHandler,
	pieceHandler,
	portHandler,
	requestHandler,
	unchokeHandler,
} from "./messageHandler";
import { LocalStorage } from "../data/LocalStorage";
import net from "net";
import { Queue } from "../datastructures/Queue";

export const initiateHandShake = () => {
	const localStorage = new LocalStorage();
	const peers = localStorage.data.peers;
	const handShakePacket = buildHandshakePacket();
	const queue = new Queue(localStorage.data.torrentInfo?.PieceHashes.length); // storing all the items that have been requested and recieved
	peers.forEach((peer) => connectToPeer(peer, handShakePacket, queue));
};

const connectToPeer = (
	peer: { ipAddress: string; portNo: number },
	handShakePacket: Buffer,
	queue: Queue
) => {
	const socket = new net.Socket();
	const concProps: connectionProperties = {
		chocked: true,
		havePieces: [],
		PiecesRequest: false,
	}; // this store the piece index of pieces that the peer have
	socket.on("error", (err) => {
		console.log(err);
	});

	socket.connect(peer.portNo, peer.ipAddress, () => {
		socket.write(handShakePacket);
	});

	aggregrateInputBuffer(socket, respHandler, queue, concProps);
};

const aggregrateInputBuffer = (
	socket: net.Socket,
	callback: (
		buffer: Buffer,
		socket: net.Socket,
		queue: Queue,
		conncProps: connectionProperties
	) => void,
	queue: Queue,
	connectionProperties: connectionProperties
) => {
	let savedBuffer = Buffer.alloc(0);
	let handshake = true;

	socket.on("data", (recBuffer) => {
		savedBuffer = Buffer.concat([savedBuffer, recBuffer]);
		let msgLen = handshake
			? savedBuffer.readUInt8(0) + 49
			: savedBuffer.readInt32BE(0) + 4;

		if (savedBuffer.length >= msgLen) {
			callback(
				savedBuffer.subarray(0, msgLen),
				socket,
				queue,
				connectionProperties
			);
			savedBuffer = savedBuffer.subarray(msgLen);
			handshake = false;
		}
	});
};

const respHandler = (
	msg: Buffer,
	socket: net.Socket,
	queue: Queue,
	connectionProperties: connectionProperties
) => {
	// console.log(msg.toString('utf-8'))
	if (isHandshake(msg)) {
		socket.write(buildInterested());
	} else {
		const res = parseMessage(msg);

		switch (res.id) {
			case 0:
				chokeHandler(socket);
			case 1:
				unchokeHandler(socket, queue, connectionProperties);
			case 4:
				if (res.payload) {
					haveHandler(
						res.payload,
						socket,
						connectionProperties,
						queue
					);
				}
			case 5:
				if (res.payload)
					bitFieldHandler(
						res.payload,
						socket,
						connectionProperties,
						queue
					);
			case 6:
				requestHandler();
			case 7:
				pieceHandler();
			case 8:
				cancelHandler();
			case 9:
				portHandler();
			default:
				defaultHandler();
		}
	}
};

const isHandshake = (msg: Buffer) => {
	return (
		msg.length === msg.readUInt8(0) + 49 &&
		msg.toString("utf-8", 1, msg.readUInt8(0)) === "BitTorrent protocol"
	);
};

const parseMessage = (msg: Buffer) => {
	const id = msg.length > 4 ? msg.readUInt8(4) : null;
	const payload = msg.length > 5 ? msg.subarray(5) : null;
	let parsedMessage: {
		index?: number;
		begin?: number;
		length?: Buffer;
		block?: Buffer;
	} = {};

	if (payload && id && id >= 6) {
		const rest = payload.subarray(8);
		parsedMessage = {
			index: payload.readUint32BE(0),
			begin: payload.readUint32BE(4),
		};
		if (id == 7) parsedMessage["length"] = rest;
		if (id == 8) parsedMessage["block"] = rest;
	}

	return {
		size: msg.readUInt32BE(0),
		id: id,
		payload: payload,
		parsedMessage: parsedMessage,
	};
};
