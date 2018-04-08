class Stylesheet {
	static fromString(string) {
		return new Stylesheet(string);
	}

	constructor(string) {
		this.paths = String(string).split(/\n/)
			.map(line => this.lineToPath(line))
			.filter(path => Boolean(path))
		;
	}

	add(path) {
		if (!this.isValidPath(path)) {
			throw new Error('cannot add invalid path to stylesheet');
		}
		this.paths.push(path);
	}

	exists(path) {
		return this.paths.indexOf(path) >= 0;
	}

	sort() {
		this.paths = this.paths.sort();
	}

	remove(path) {
		var i = this.paths.indexOf(path);
		if (i >= 0) {
			this.paths.splice(i, 1);
		}
	}

	rename(path, path2) {
		var i = this.paths.indexOf(path);
		if (i >= 0) {
			this.paths[i] = path2;
		}
	}

	toString() {
		return this.paths.map(path => this.pathToLine(path)).join('\n');
	}

	lineToPath(line) {
		var pattern = /^@import '(.*?)';?$/;
		var matches = line.match(pattern);
		if (matches) {
			if (this.isValidPath(matches[1])) {
				return matches[1];
			}
		}
	}

	pathToLine(path) {
		return `@import '${path}';`;
	}

	isValidPath(path) {
		var pattern = /^[\w\/.-]+$/;
		return pattern.test(path);
	}
}

module.exports = Stylesheet;
