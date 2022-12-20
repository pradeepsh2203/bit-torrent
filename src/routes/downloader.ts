import express, { Request } from "express";
import fs from "fs";
import Bencode from "bencoder";
const router = express.Router();
const parseMP = require("express-parse-multipart");

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
	console.log(typeof torrentFile[0].data);
	fs.writeFileSync(
		__dirname + "/../../sample_data/input.json",
		JSON.stringify(Bencode.decode(torrentFile[0].data))
	);
	res.send("");
});

router.get("/", (req, res) => {
	res.send("Router Works!!");
});

module.exports = router;
