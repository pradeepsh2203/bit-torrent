import { objTypes } from "../data/BenCodeStructure";
import Stack from "../datastructures/Stack";

const bufferToString = (ele: number) => {
	let decoder = new TextDecoder("utf-8");
	return decoder.decode(new Uint8Array([ele]), { stream: false });
};

const decryptBuffer = (content: Buffer) => {
	let objectStack = new Stack(); // Stores what block we are working with.
	let DataStack = new Stack();
	let keyValStack = new Stack();
	objectStack.push("FINAL");
	let byteScore = 0;
	let key: any;

	content.forEach((ele, i) => {
		let char = bufferToString(ele);
		if (byteScore !== 0 && objectStack.peek() === "STRING") {
			DataStack.update(DataStack.peek() + char);
			byteScore--;
			if (byteScore === 0) {
				char = "e";
			}
		} else if (char in objTypes) {
			if (char === "d") {
				keyValStack.push(0);
				DataStack.push({});
				objectStack.push("DICT");
			} else if (char === "i") {
				DataStack.push(0);
				objectStack.push("NUMBER");
			} else if (char === "l") {
				DataStack.push([]);
				objectStack.push("LIST");
			} else {
				DataStack.push("");
				objectStack.push("STRING");
			}
		} else if (!isNaN(char as any)) {
			if (objectStack.peek() === "NUMBER")
				DataStack.update(
					(DataStack.peek() * 10 + parseInt(char)) as any
				);
			else byteScore = byteScore * 10 + parseInt(char);
		} else {
		}

		if (char === "e") {
			let val = DataStack.peek();
			if (objectStack.peek() === "DICT") keyValStack.pop();
			objectStack.pop();
			DataStack.pop();

			if (objectStack.peek() === "FINAL") return val;
			else if (objectStack.peek() === "DICT") {
				if (keyValStack.peek() % 2 === 1) {
					// Means its a value
					let data = DataStack.peek();
					data[key] = val;
					DataStack.update(data);
				} else {
					// Meaning it's a key
					key = val;
				}
				keyValStack.update(keyValStack.peek() + 1);
			} else if (objectStack.peek() === "LIST") {
				let list: Array<any> = DataStack.peek();
				list.push(val);
				DataStack.update(list);
			}
		}
	});

	return undefined;
};

module.exports = { decryptBuffer };
