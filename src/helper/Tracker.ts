export const createConnectMessage = (transaction_id: number) => {
	const protocolId = 0x41727101980;
	const action = 0; //connect
	const connectMessage = Buffer.alloc(16);
	connectMessage.writeBigUInt64BE(BigInt(protocolId), 0);
	connectMessage.writeInt32BE(action, 8);
	connectMessage.writeInt32BE(transaction_id, 12);
	return connectMessage;
};

export const createAnnounceMessage = (
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
	port: number
) => {
	const action = 1; //announce
	const eventMap = { none: 0, Completed: 1, Started: 2, Stopped: 3 };

	const announceMessage = Buffer.alloc(98);
	announceMessage.writeBigInt64BE(connection_id, 0);
	announceMessage.writeInt32BE(action, 8);
	announceMessage.writeInt32BE(transaction_id, 12);
	info_hash.copy(announceMessage, 16, 0, 20);
	peer_id.copy(announceMessage, 36, 0, 20);
	announceMessage.writeBigInt64BE(downloaded, 56);
	announceMessage.writeBigInt64BE(left, 64);
	announceMessage.writeBigInt64BE(uploaded, 72);
	announceMessage.writeInt32BE(eventMap[event], 80);
	announceMessage.writeInt32BE(IP, 84);
	announceMessage.writeInt32BE(key, 88);
	announceMessage.writeInt32BE(num_want, 92);
	announceMessage.writeInt16BE(port, 96);

	return announceMessage;
};
