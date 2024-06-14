export const requestPacket = (index: number, begin: number, length: number) => {
	const req = Buffer.alloc(13);
	req.writeUInt8(6, 0);
	req.writeUInt32LE(index, 1);
	req.writeUInt32LE(begin, 5);
	req.writeUInt32LE(length, 9);

	return req;
};
