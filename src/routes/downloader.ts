import express, { Request } from "express";
import Bencode from "bencoder";
import TorrentStruct from "../datastructures/TorrentStruct";
import { generatePeerId, getPeerList } from "../helper/Peers";
const router = express.Router();
const parseMP = require("express-parse-multipart");
require("dotenv").config();

interface RequestMP extends Request {
	formData: Array<{
		data: Buffer;
		name: string;
		filename?: string;
		type?: string;
	}>;
}

router.post("/", parseMP, (req, res) => {
	let reqModified = req as RequestMP;
	const torrentFile = reqModified.formData.filter(
		(ele) => ele.type === "application/x-bittorrent"
	);
	// console.log(Bencode.decode(torrentFile[0].data));
	const torrent = new TorrentStruct(Bencode.decode(torrentFile[0].data));
	const myPeerId = generatePeerId();
	const portNo =
		process.env.UDP_PORT === undefined
			? 6881
			: parseInt(process.env.UDP_PORT);
	const peers = getPeerList(torrent, myPeerId, portNo);
	res.send("");
});

router.get("/", (req, res) => {
	res.send("Router Works!!");
});

module.exports = router;
