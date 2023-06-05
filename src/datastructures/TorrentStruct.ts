import crypto from "crypto";
import Bencode from "bencoder";
import { LocalStorage } from "../data/LocalStorage";

interface torrentFile {
	announce: string;
	"announce-list"?: Array<Array<string>>;
	comment?: string;
	"created by": string;
	"creation date": number;
	info: {
		length: number;
		files: Array<{
			length: number;
			path: Array<string>;
		}>;
		name: string;
		"piece length": number;
		pieces: string;
		source?: string;
	};
}

class TorrentStruct {
	public Announce: string;
	public AnnounceList: Array<string>;
	public InfoHash: Buffer;
	public PieceHashes: Array<Array<any>>;
	public PieceLength: number;
	public Length: number;
	public Name: string;

	constructor(val: torrentFile) {
		this.Announce = val.announce;
		this.AnnounceList = [];
		if (val["announce-list"] !== undefined) {
			val["announce-list"].forEach((ele) => {
				this.AnnounceList.push(...ele);
			});
		}
		const hash = crypto.createHash("sha1");
		this.InfoHash = hash.update(Bencode.encode(val.info)).digest();
		this.PieceLength = val.info["piece length"];
		this.Name = val.info.name;
		this.PieceHashes = [[]];
		for (let index = 0; index < val.info.pieces.length; index++) {
			const arrLen = this.PieceHashes.length;
			// legnth of a SHA1 hash is 160bits i.e 20 bytes...
			if (this.PieceHashes[arrLen - 1].length < 20) {
				this.PieceHashes[arrLen - 1].push(val.info.pieces.charCodeAt(index));
			} else {
				this.PieceHashes.push([val.info.pieces.charCodeAt(index)]);
			}
		}
		this.Length = val.info.length;
		// Adding the content to local file...
		const data = new LocalStorage();
		data.data.torrentInfo = this;
		data.writeToFile();
	}
}

export default TorrentStruct;
