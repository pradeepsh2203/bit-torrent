import { objReplace, objTypes, eReplace } from "../data/BenCodeStructure.js";
import Stack from "../datastructures/Stack";

type KEYWORD = keyof typeof objTypes;

const getString = (content: string, ind: number, length: number) => {
	let str = "";
	let quotes;
	if (content[ind + 1] === '"') quotes = "";
	else quotes = '"';
	while (length != 0) {
		ind++;
		str += content[ind];
		length--;
	}
	return quotes + str + quotes;
};

const decrypt = (content: string) => {
	let data = "";
	const objectStack = new Stack(); // Stores what block we are working with.
	let byteScore = 0;
	let keyValStack = new Stack();

	for (let i = 0; i < content.length; i++) {
		const char = content[i];
		if (char in objTypes) {
			// Store what type of block we are working with and find a correct replace value for it
			if (keyValStack.getSize() !== 0) {
				const currFlag = keyValStack.peek();
				if (keyValStack.peek() != 0) {
					if (objectStack.peek() === "DICT")
						data += currFlag & 1 ? ":" : ","; // For Dict add : and ,
					if (objectStack.peek() === "LIST") data += ","; // For List you need to add only ,
				}
				keyValStack.update(currFlag + 1);
			}

			objectStack.push(objTypes[char as KEYWORD]);
			data += objReplace[char as KEYWORD];
			const currBlock = objectStack.peek();
			if (currBlock === "DICT" || currBlock === "LIST") {
				// Added a flag to check for key values...
				keyValStack.push(0);
			}

			if (objectStack.peek() === "STRING") {
				data += getString(content, i, byteScore);
				i += byteScore;
				byteScore = 0;
				objectStack.pop();
			}
		} else if (!isNaN(char as any)) {
			// If the current byte is a number store it in the buffer or add it to the result.
			if (objectStack.peek() === "NUMBER") data += parseInt(char);
			else byteScore = byteScore * 10 + parseInt(char);
		} else if (char == "e") {
			data += eReplace[objectStack.peek() as keyof typeof eReplace];
			if (
				objectStack.peek() === "DICT" ||
				objectStack.peek() === "LIST"
			) {
				keyValStack.pop();
			}
			objectStack.pop();
		}
	}

	return data;
};
