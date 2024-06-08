import { join } from "node:path";
import TorrentStruct from "../datastructures/TorrentStruct";
import { readFileSync, writeFileSync } from "node:fs";

// db.json file path
const file = join(__dirname, "db.json");
interface BufferJSON {
	type: "Buffer";
	data: number[];
}
export interface torrentInfo {
	Announce: string;
	AnnounceList: Array<string>;
	InfoHash: BufferJSON;
	PieceHashes: Array<Array<any>>;
	PieceLength: number;
	Length: number;
	Name: string;
}
interface PeerDetails {
	ipAddress: string;
	portNo: number;
}
type Data = {
	transactionID?: number;
	connectionID?: string;
	torrentInfo?: torrentInfo;
	trackerPort?: number;
	trackerHost?: string;
	trackerRoute?: string;
	peerId?: BufferJSON;
	downloaded?: string;
	left?: string;
	uploaded?: string;
	event?: "none" | "Completed" | "Started" | "Stopped";
	ip?: number;
	numWant?: number;
	port?: number; // this is the udp port do we need it here?? if yes then update the announce packet to update the port no.
	interval?: number;
	leechers?: number;
	seeders?: number;
	peers: PeerDetails[];
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
