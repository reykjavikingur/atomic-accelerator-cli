class Stylesheet {
	static fromString(string) {
		return new Stylesheet(string);
	}

	constructor(string) {
		this.lines = String(string).split(/\n/);
	}

	add(path) {
		if (!this.isPathValid(path)) {
			throw new Error('cannot add invalid path to stylesheet');
		}
		var line = this.pathToLine(path);
		if (this.lines.length === 1 && this.lines[0] === '') {
			this.lines[0] = line;
		}
		else {
			this.lines.push(this.pathToLine(path));
		}
	}

	sort() {
		var paths = this.lines
				.map(line => this.lineToPath(line))
				.filter(path => Boolean(path))
				.sort()
			;
		this.lines = paths
			.map(path => this.pathToLine(path));
	}

	toString() {
		return this.lines.join('\n');
	}

	lineToPath(line) {
		var pattern = /^@import '(.*?)';?/;
		var matches = line.match(pattern);
		if (matches) {
			return matches[1];
		}
	}

	pathToLine(path) {
		return `@import '${path}';`;
	}

	isPathValid(path) {
		var pattern = /^[\w\/-]+$/;
		return pattern.test(path);
	}
}

module.exports = Stylesheet;
