class Template {

	static fromString(string) {
		return new Template(string);
	}

	constructor(string) {
		this.string = String(string);
	}

	rename(path, path2) {
		if (!this.isValidPath(path)) {
			throw new Error('cannot rename invalid path');
		}
		if (!this.isValidPath(path2)) {
			throw new Error('cannot rename to invalid path');
		}
		var pattern = new RegExp('({{)(#?>|/)(\\s*)' + escapeRegex(path) + '([ }])', 'g');
		this.string = this.string.replace(pattern, '$1$2$3' + path2 + '$4');
	}

	toString() {
		return this.string;
	}

	isValidPath(path) {
		return /^[\w\/.-]+$/.test(path);
	}

}

// escape characters that may appear in filename for regex
function escapeRegex(path) {
	return path.replace(/[+.]/g, '\\$&');
}

module.exports = Template;
