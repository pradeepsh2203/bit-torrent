import crypto from "crypto";
import Bencode from "bencoder";

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
	public AnnounceUDP: Array<string>;
	public InfoHash: Buffer;
	public PieceHashes: Array<Array<any>>;
	public PieceLength: number;
	public Length: number;
	public Name: string;

	constructor(val: torrentFile) {
		this.Announce = val.announce;
		this.AnnounceUDP = [];
		if (val["announce-list"] !== undefined) {
			val["announce-list"].forEach((ele) => {
				const arr = ele.filter((url) => url.search("udp*") !== -1);
				if (arr.length != 0) this.AnnounceUDP.push(...arr);
			});
		}
		const hash = crypto.createHash("sha1");
		this.InfoHash = hash.update(Bencode.encode(val.info)).digest();
		this.PieceLength = val.info["piece length"];
		this.Name = val.info.name;
		this.PieceHashes = [[]];
		for (let index = 0; index < val.info.pieces.length; index++) {
			const arrLen = this.PieceHashes.length;
			if (this.PieceHashes[arrLen - 1].length < 20) {
				this.PieceHashes[arrLen - 1].push(
					val.info.pieces.charCodeAt(index)
				);
			} else {
				this.PieceHashes.push([val.info.pieces.charCodeAt(index)]);
			}
		}
		this.Length = val.info.length;
	}
}

export default TorrentStruct;
