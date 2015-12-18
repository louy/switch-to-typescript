const dashdash = require('dashdash');
const pkg = require('./package.json');

import {Options} from './helpers';

var options = [
	{
		name: 'version',
		type: 'bool',
		help: 'Print tool version and exit.'
	},
	{
		names: ['help', 'h'],
		type: 'bool',
		help: 'Print this help and exit.'
	},
	{
		names: ['verbose', 'v'],
		type: 'arrayOfBool',
		help: 'Verbose output. Use multiple times for more verbose.'
	},
	{
		names: ['exclude', 'e'],
		type: 'arrayOfString',
		help: 'Paths to exclude. Can be used multiple times.',
		helpArg: 'PATH'
	}
];

var parser = dashdash.createParser({ options: options });
var opts: Options;
try {
	opts = parser.parse(process.argv);
} catch (e) {
	console.error('%s: error: %s', pkg.name, e.message);
	process.exit(1);
}

if (opts.version) {
	console.log('%s: v%s', pkg.name, pkg.version);
	process.exit(0);
}

if (opts.help) {
	var help = parser.help({ includeEnv: true }).trimRight();
	console.log('usage: ' + pkg.name + ' [OPTIONS]\n'
		+ 'options:\n'
		+ help);
	process.exit(0);
}

console.log('# opts:', opts);

import renameToTs from './tasks/rename-to-ts';
import * as Promise from 'bluebird';
import {red} from 'chalk';

Promise.resolve(options)
	.then(renameToTs)

	.catch(err => {
		console.error(
			red(
				// Prettier stack
				(<string>err.stack)
					.split('\n')
					.filter(str => str.indexOf(__dirname + '/node_modules') === -1)
					.filter(str => !/\([a-z]+\.js\:[\d]+\:[\d]+\)/.test(str))
					.filter(str => !/at\s[a-z]+\.js\:[\d]+\:[\d]+/.test(str))
					.map(str => str.replace(process.cwd(), '.'))
					.join('\n')
			)
		);
		process.exit(1);
	});
