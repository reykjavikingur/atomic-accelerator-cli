const should = require('should');
const Template = require('../lib/template');

describe('Template', () => {

	it('should exist', () => {
		should(Template).be.ok();
	});

	describe('instance from empty string', () => {
		var instance;
		beforeEach(() => {
			instance = Template.fromString(``);
		});
		it('should be ok', () => {
			should(instance).be.ok();
		});
	});

	it('should be able to rename normal include', () => {
		var instance = Template.fromString(`{{>initial}}`);
		instance.rename('initial', 'final');
		should(instance.toString()).eql(`{{>final}}`);
	});

	it('should be able to rename multiple includes', () => {
		var instance = Template.fromString(`abc{{>initial}}def{{>initial}}ghi`);
		instance.rename('initial', 'final');
		should(instance.toString()).eql(`abc{{>final}}def{{>final}}ghi`);
	});

	it('should be able to rename include with syntactically ignored space', () => {
		var instance = Template.fromString(`{{> initial}}`);
		instance.rename('initial', 'final');
		should(instance.toString()).eql(`{{> final}}`);
	});

	it('should rename include with params', () => {
		var instance = Template.fromString(`{{>initial x=1 }}`);
		instance.rename('initial', 'final');
		should(instance.toString()).eql(`{{>final x=1 }}`);
	});

	it('should rename block partial include', () => {
		var instance = Template.fromString(`{{#>initial}}stuff{{/initial}}`);
		instance.rename('initial', 'final');
		should(instance.toString()).eql(`{{#>final}}stuff{{/final}}`);
	});

	it('should rename block partial include with parameters', () => {
		var instance = Template.fromString(`{{#>initial x=1}}content{{/initial}}`);
		instance.rename('initial', 'final');
		should(instance.toString()).eql(`{{#>final x=1}}content{{/final}}`);
	});

	it('should not rename include with initial substring', () => {
		var instance = Template.fromString(`{{>initialx}}`);
		instance.rename('initial', 'final');
		should(instance.toString()).eql(`{{>initialx}}`);
	});

	it('should not rename include with initial word part', () => {
		var instance = Template.fromString(`{{>initial-part}}`);
		instance.rename('initial', 'final');
		should(instance.toString()).eql(`{{>initial-part}}`);
	});

	it('should not rename include with regular expression special character', () => {
		var instance = Template.fromString(`{{>initial}}`);
		instance.rename('initi.l', 'final');
		should(instance.toString()).eql(`{{>initial}}`);
	});

	it('should rename include with path containing all allowed characters', () => {
		var instance = Template.fromString(`{{>site-comp/365.search_form}}`);
		instance.rename('site-comp/365.search_form', 'simple');
		should(instance.toString()).eql(`{{>simple}}`);
	});

	it('should rename block partial include with path containing all allowed characters', () => {
		var instance = Template.fromString(`{{#>site-comp/365.search_form}}content{{/site-comp/365.search_form}}`);
		instance.rename('site-comp/365.search_form', 'simple');
		should(instance.toString()).eql(`{{#>simple}}content{{/simple}}`);
	});

	it('should rename block partial include to path containing all allowed characters', () => {
		var instance = Template.fromString(`{{#>simple}}content{{/simple}}`);
		instance.rename('simple', 'site-comp/365.search_form');
		should(instance.toString()).eql(`{{#>site-comp/365.search_form}}content{{/site-comp/365.search_form}}`);
	});

	describe('instance from string with one include flanked by other content and line breaks', () => {
		var instance;
		beforeEach(() => {
			instance = Template.fromString(`<h1>page</h1>\n{{>foo}}\n<footer>&copy;</footer>`);
		});
		describe('.toString', () => {
			it('should return same', () => {
				should(instance.toString()).eql(`<h1>page</h1>\n{{>foo}}\n<footer>&copy;</footer>`);
			});
		});
		describe('rename', () => {
			beforeEach(() => {
				instance.rename('foo', 'comp');
			});
			it('should return with renamed include', () => {
				should(instance.toString()).eql(`<h1>page</h1>\n{{>comp}}\n<footer>&copy;</footer>`);
			});
		});
		it('should throw error trying to rename path with space in it', () => {
			should(() => {
				instance.rename('foo ', 'comp');
			}).throw();
		});
		it('should throw error trying to inject escape', () => {
			should(() => {
				instance.rename('foo', 'comp}}');
			}).throw();
		});
	});

});
