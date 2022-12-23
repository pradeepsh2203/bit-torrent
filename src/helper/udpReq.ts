import { getTransactionID, setConnectionID } from "../udp";

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
