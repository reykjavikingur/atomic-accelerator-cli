const should = require('should');
const Stylesheet = require('../lib/stylesheet');

describe('Stylesheet', () => {
	it('should exist', () => {
		should(Stylesheet).be.ok();
	});

	describe('from empty string', () => {
		var instance;
		beforeEach(() => {
			instance = Stylesheet.fromString('');
		});
		it('should be ok', () => {
			should(instance).be.ok();
		});
		describe('.toString', () => {
			it('should return empty string', () => {
				should(instance.toString()).eql('');
			});
		});
		describe('add path', () => {
			beforeEach(() => {
				instance.add('comp');
			});
			describe('.toString', () => {
				it('should include comp', () => {
					should(instance.toString()).eql(`@import 'comp';`);
				});
			});
		});
		describe('.exists', () => {
			it('should return false', () => {
				should(instance.exists('anything')).not.be.ok();
			});
		});
		describe('add invalid path', () => {
			it('should throw error', () => {
				should(() => {
					instance.add('don\'t');
				}).throw();
			});
		});
	});

	describe('from string with one import', () => {
		var instance;
		beforeEach(() => {
			instance = Stylesheet.fromString(`@import 'foo';`);
		});
		describe('.toString', () => {
			it('should return same as input', () => {
				should(instance.toString()).eql(`@import 'foo';`);
			})
		});
		describe('.exists', () => {
			it('should return true for existing import', () => {
				should(instance.exists('foo')).be.ok();
			});
		});
		describe('add other', () => {
			beforeEach(() => {
				instance.add('other');
			});
			describe('.toString', () => {
				it('should include other', () => {
					should(instance.toString()).eql(`@import 'foo';\n@import 'other';`);
				});
			});
		});
	});

	describe('from string with two imports', () => {
		var instance;
		beforeEach(() => {
			instance = Stylesheet.fromString(`@import 'foo';\n@import 'bar';`);
		});
		describe('.toString', () => {
			it('should return same as input', () => {
				should(instance.toString()).eql(`@import 'foo';\n@import 'bar';`);
			})
		});
		describe('.sort', () => {
			beforeEach(() => {
				instance.sort();
			});
			describe('.toString', () => {
				it('should return string with import statements sorted', () => {
					should(instance.toString()).eql(`@import 'bar';\n@import 'foo';`);
				});
			});
		});
	});

	describe('from string with extraneous line', () => {
		var instance;
		beforeEach(() => {
			instance = Stylesheet.fromString(`.asdf {}`);
		});
		describe('.sort', () => {
			beforeEach(() => {
				instance.sort();
			});
			describe('.toString', () => {
				it('should return empty string', () => {
					should(instance.toString()).eql('');
				});
			});
		});
	});

	describe('from string with import statements and extraneous lines', () => {
		var instance;
		beforeEach(() => {
			instance = Stylesheet.fromString(`@import 'foo';\n.asdf{}\n@import 'bar';`);
			instance.sort();
		});
		describe('.toString', () => {
			it('should remove extraneous line', () => {
				should(instance.toString()).eql(`@import 'bar';\n@import 'foo';`);
			});
		});
	});
});
