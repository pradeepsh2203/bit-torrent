import { join } from "node:path";
import TorrentStruct from "../datastructures/TorrentStruct";
import { readFileSync, writeFileSync } from "node:fs";

// db.json file path
const file = join(__dirname, "db.json");
type Data = {
	transactionID?: number;
	connectionID?: string;
	torrentInfo?: TorrentStruct;
	trackerPort?: number;
	trackerHost?: string;
	peer_id?: Buffer;
	trackerRoute?: string;
	peerId?: Buffer;
	downloaded?: string;
	left?: string;
	uploaded?: string;
	event?: "none" | "Completed" | "Started" | "Stopped";
	ip?: number;
	numWant?: number;
	port?: number; // this is the udp port do we need it here?? if yes then update the announce packet to update the port no.
};

export class LocalStorage {
	public data: Data;
	constructor() {
		this.data = JSON.parse(readFileSync(file, { encoding: "utf-8" }));
	}
	public writeToFile() {
		writeFileSync(file, JSON.stringify(this.data));
	}
}
