import { randomInt } from "crypto";
import dgram from "dgram";
import { ValidConnectRes } from "./helper/udpReq";
require("dotenv").config;

let transactionID: number;
let connectionID: bigint;
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
