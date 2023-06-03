import TorrentStruct from "../datastructures/TorrentStruct";
import {
	generateTransactionID,
	getTransactionID,
	setPeerId,
	setTorrentInfo,
	setTrackerHost,
	setTrackerPort,
	setTrackerRoute,
	socket,
} from "../udp";
import { createConnectMessage } from "./Tracker";

export const getPeerList = async (torrent: TorrentStruct) => {
	const url = torrent.AnnounceList[2].split(/[:/]/);
	let protocol = url[0];
	let host = url[3];
	const serverPort = parseInt(url[4]);
	const route = url[5];

	switch (protocol) {
		case "udp":
			// UDP Connect request
			generateTransactionID();
			const connectMessage = createConnectMessage(getTransactionID());
			console.log("ConnectMessage", connectMessage);
			setTrackerHost(host);
			setTrackerPort(serverPort);
			setTrackerRoute(route);
			setTorrentInfo(torrent);
			setPeerId(generatePeerId());

			socket.send(connectMessage, serverPort, host, (err, bytes) => {
				if (err) {
					console.log("Error");
					console.log(err);
				} else {
					console.log("Message Sent!!");
				}
				console.log(bytes);
				console.log(host);
			});
			break;
		case "http":
		case "https":
		// HTTP GET request
	}
};

export const generatePeerId = () => {
	const peer_id = "PP0000-" + Date.now();
	return Buffer.from(peer_id, "utf-8");
};
