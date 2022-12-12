const objTypes = {
	d: "DICT",
	i: "NUMBER",
	l: "LIST",
	":": "STRING",
};

const objReplace = {
	d: "{",
	i: "",
	l: "[",
	":": "",
};

const eReplace = {
	DICT: "}",
	LIST: "]",
	STRING: "",
	NUMBER: "",
};

module.exports = { objTypes, objReplace, eReplace };
