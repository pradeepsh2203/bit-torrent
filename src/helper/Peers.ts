import TorrentStruct from "../datastructures/TorrentStruct";
import { generateTransactionID, getTransactionID, socket } from "../udp";
import { createConnectMessage } from "./Tracker";

export const getPeerList = async (torrent: TorrentStruct) => {
	const url = torrent.AnnounceUDP[2].split(/[:/]/);
	console.log(...url);
	let host = url[3];
	const trPort = parseInt(url[4]);
	// const route = url[5];

	generateTransactionID();
	const connectMessage = createConnectMessage(getTransactionID());
	console.log("ConnectMessage", connectMessage);

	socket.send(connectMessage, trPort, host, (err, bytes) => {
		if (err) {
			console.log("Error");
			console.log(err);
		} else {
			console.log("Message Sent!!");
		}
		console.log(bytes);
		console.log(host);
	});
};

export const generatePeerId = () => {
	const peer_id = "PP0000-" + Date.now();
	return Buffer.from(peer_id, "utf-8");
};
