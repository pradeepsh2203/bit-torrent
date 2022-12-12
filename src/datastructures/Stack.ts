class Stack {
	private items: Array<any>;
	private size: number;
	constructor() {
		this.items = [];
		this.size = 0;
	}

	push: (value: any) => void = (value: any) => {
		this.items[this.size] = value;
		this.size += 1;
	};

	pop: () => void = () => {
		if (this.size === 0) return undefined;
		this.size--;
	};

	getSize: () => number = () => {
		return this.size;
	};

	peek: () => any = () => {
		if (this.size === 0) return undefined;
		return this.items[this.size - 1];
	};

	update(val: string) {
		this.items[this.size - 1] = val;
	}
}

export default Stack;
