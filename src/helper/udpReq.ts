import { getTransactionID, setConnectionID, socket } from "../udp";
import { createAnnounceMessage } from "./Tracker";

export const ValidConnectRes = (msg: Buffer, size: number) => {
	if (size < 16) {
		return false;
	}

	const action = msg.readInt32BE(0);
	const transaction_id = msg.readInt32BE(4);
	const connection_id = msg.readBigInt64BE(8);
	const sentTransactionID = getTransactionID();

	if (action === 0 && transaction_id === sentTransactionID) {
		setConnectionID(connection_id);
		return true;
	} else {
		return false;
	}
};

export const ValidAnnounceRes = (msg: Buffer, size: number) => {
	if (size < 20) {
		return false;
	}

	const action = msg.readInt32BE(0);
	const transaction_id = msg.readInt32BE(4);
	const interval = msg.readInt32BE(8);
	const leecher = msg.readInt32BE(12);
	const seeder = msg.readInt32BE(16);

	const reqTransactionId = getTransactionID();

	if (action === 1 && transaction_id === reqTransactionId) {
		console.log(interval, leecher, seeder);
		return true;
	} else {
		return false;
	}
};

export const announceReq = (
	connection_id: bigint,
	transaction_id: number,
	info_hash: Buffer,
	peer_id: Buffer,
	downloaded: bigint,
	left: bigint,
	uploaded: bigint,
	event: "none" | "Completed" | "Started" | "Stopped", //0:none,1:completed,2:Started,3:Stopped
	IP: number, //0:default
	key: number,
	num_want: number, //-1:default
	port: number,
	trackerPort: number,
	trackerhost: string
) => {
	const announceMessage = createAnnounceMessage(
		connection_id,
		transaction_id,
		info_hash,
		peer_id,
		downloaded,
		left,
		uploaded,
		event,
		IP,
		key,
		num_want,
		port
	);
	console.log(announceMessage.length);
	socket.send(announceMessage, trackerPort, trackerhost, (err, bytes) => {
		if (err) {
			console.log("Error", err);
		} else {
			console.log(
				"The announce Message was sent succesfully!!",
				trackerhost,
				trackerPort
			);
		}
	});
};
