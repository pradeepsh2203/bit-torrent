import express, { Request } from "express";
import Bencode from "bencoder";
import TorrentStruct from "../datastructures/TorrentStruct";
import { generatePeerId, getPeerList } from "../helper/Peers";
const router = express.Router();
const parseMP = require("express-parse-multipart");
require("dotenv").config();
import fs from "fs";
import path from "path";

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
	const torrentFiles = reqModified.formData.filter((ele) => ele.type === "application/x-bittorrent");
	console.log("Parsing the First torrentFile");
	const torrentInfo = Bencode.decode(torrentFiles[0].data);
	console.log("Done ✓✓✓");
	const torrent = new TorrentStruct(torrentInfo);
	const peers = getPeerList(torrent);
	res.send("");
});

router.get("/", (req, res) => {
	res.send("Router Works!!");
});

module.exports = router;
