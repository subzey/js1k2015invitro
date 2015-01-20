#!/usr/bin/env node
var UglifyJS = require('uglify-js');

var str = require('fs').readFileSync('entry.js', 'utf-8');

var result = UglifyJS.minify(str, {
	fromString: true,
	mangle: {
		toplevel: true
	},
	compress: {
		hoist_vars: true
	}
});

var minified = result.code;

if (false){
	minified = minified.replace(/\bvar\s+([^;]+)/g, function(_, vars){
		var cleaned = vars.split(',').filter(function(varDecl){
			return /=/.test(varDecl);
		}).join(',');
		console.log(vars);
		console.log(cleaned);
		return cleaned;
	});
}

var inlined = require('fs').readFileSync('shim-normal.html', 'utf-8');

inlined = inlined.replace(/(\t*)<script\s+src[^]*?<\/script>/, function(_, tab){
		return tab + '<script>\n// start of submission //\n' + minified + '\n// end of submission //\n' + tab + '</script>';
	}
);

try {
	require('fs').mkdirSync('build');
} catch (e){ ; }

require('fs').writeFileSync('build/prod.html', inlined);
require('fs').writeFileSync('build/prod.js', minified);

console.log(Buffer.byteLength(minified) + ' bytes');