import { randomInt } from "crypto";
import dgram from "dgram";
import TorrentStruct from "./datastructures/TorrentStruct";
import {
	announceReq,
	ValidAnnounceRes,
	ValidConnectRes,
} from "./helper/udpReq";
require("dotenv").config;

let transactionID: number;
let connectionID: bigint;
let torrentInfo: TorrentStruct;
let trackerPort: number;
let trackerHost: string;
let peer_id: Buffer;
let trackerRoute: string;

const udpPort: number =
	process.env.UDP_PORT !== undefined ? parseInt(process.env.UDP_PORT) : 6881;
export const socket = dgram.createSocket("udp4");
socket.bind(udpPort);

socket.on("listening", () => {
	const addrs = socket.address();
	console.log(
		`The udp server is listening on ${addrs.address}:${addrs.port}`
	);
});

socket.on("close", () => {
	socket.removeAllListeners();
	console.log("The udp socket is closed succesfully");
});

socket.on("message", (msg, rinfo) => {
	if (ValidConnectRes(msg, rinfo.size)) {
		console.log(`The connectionID is ${connectionID}`);
		announceReq(
			connectionID,
			transactionID,
			torrentInfo.InfoHash,
			peer_id,
			BigInt(0),
			BigInt(torrentInfo.Length),
			BigInt(0),
			"Started",
			0,
			transactionID,
			50,
			udpPort,
			trackerPort,
			trackerHost
		);
	} else if (ValidAnnounceRes(msg, rinfo.size)) {
		const n = (msg.length - 20) / 6;
		console.log("The number of peers are", n);
	} else {
		console.log("A message come ", msg);
	}
});

export const generateTransactionID = () => {
	transactionID = randomInt(1, 1e5);
	return transactionID;
};
export const getTransactionID = () => {
	return transactionID;
};
export const setConnectionID = (id: bigint) => {
	connectionID = id;
};
export const setTrackerHost = (Host: string) => {
	trackerHost = Host;
};
export const setTrackerPort = (Port: number) => {
	trackerPort = Port;
};
export const setTrackerRoute = (route: string) => {
	trackerRoute = route;
};
export const setTorrentInfo = (info: TorrentStruct) => {
	torrentInfo = info;
};
export const setPeerId = (id: Buffer) => {
	peer_id = id;
};
