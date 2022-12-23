import TorrentStruct from "../datastructures/TorrentStruct";
import { URLSearchParams } from "url";
import dgram from "dgram";

const udp = dgram.createSocket("udp4");
udp.bind(3001);

udp.on("listening", () => {
	const add = udp.address();
	console.log(`listening on${add.address}:${add.port}`);
});

export const getPeerList = async (
	torrent: TorrentStruct,
	peerId: Buffer,
	port: number
) => {
	console.log(port);
	const params = new URLSearchParams();
	params.append("info_hash", torrent.InfoHash.toString());
	params.append("peer_id", peerId.toString());
	params.append("port", port.toString());
	params.append("uploaded", "0");
	params.append("downloaded", "0");
	// params.append("compact", "1");
	params.append("left", torrent.Length.toString());

	const url = torrent.AnnounceUDP[2].split(/[:/]/);
	console.log(...url);
	let host = url[3];
	const trPort = parseInt(url[4]);
	const route = url[5];

	const protocolId = 0x41727101980;
	const action = 0;
	const transaction_id = 12345;

	const connectMessage = Buffer.alloc(16);
	connectMessage.writeBigUInt64BE(BigInt(protocolId), 0);
	connectMessage.writeInt32BE(action, 8);
	connectMessage.writeInt32BE(transaction_id, 12);
	console.log("ConnectMessage", connectMessage);

	udp.on("message", (msg, rinfo) => {
		console.log(`The response came from ${rinfo.address}:${rinfo.port}`);
		console.log(msg, msg.length);
	});

	udp.send(connectMessage, trPort, host, (err, bytes) => {
		if (err) {
			console.log("Error");
			console.log(err);
		} else {
			console.log("Message Sent!!");
		}
		console.log(bytes);
		console.log(host);
	});

	setTimeout(() => {
		udp.removeAllListeners();
		console.log("Now the udp listeners are terminated");
	}, 10000);
};

export const generatePeerId = () => {
	const peer_id = "PP0000-" + Date.now();
	return Buffer.from(peer_id, "utf-8");
};
