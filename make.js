#!/usr/bin/env node
try {
	require('fs').mkdirSync('build');
} catch (e){ ; }
try {
	require('fs').unlinkSync('build/preprocessed.js');
} catch (e){ ; }
try {
	require('fs').unlinkSync('build/prod.js');
} catch (e){ ; }
try {
	require('fs').unlinkSync('build/prod.html');
} catch (e){ ; }


var UglifyJS = require('uglify-js');

var source = require('fs').readFileSync('entry.js', 'utf-8');

// Determine constants

var constants = {};

// Sandbox js environment for running code
var sandbox = require('vm').createContext({});

source = source.replace(/\b(?:var|const)\s+([A-Z0-9][A-Z0-9_]{2,})\s*=[^;]*;?/g, function(code, varname){
	console.log('Constant expression: ' + code);
	require('vm').runInContext(code, sandbox, '((entry code))');
	constants[varname] = sandbox[varname];
	console.log('Evaluated into: (' + typeof constants[varname] + ') '  + constants[varname]);
	return '';
});


// Inlines

while (true){
	var varname = '';
	var expression = '';
	source = source.replace(/(?:\bvar\s+)?\b(__inline_\w+)\s*=\s*([^;]*);?/, function(_, $1, $2){
		varname = $1;
		expression = $2;
		return '';
	});
	if (!varname){
		break;
	}
	console.log('Inlining ' + varname + '...');

	var matches = 0;
	source = source.replace(new RegExp('\\b' + varname + '\\b'), function(){
		matches++;
		return ' (' + expression + ') ';
	});
	if (matches < 1){
		console.error('Inline expression ' + varname + ' was defined, but no insertion point found');
		process.exit(1);
	}
	if (matches > 1){
		console.error('Inline expression ' + varname + ' has multiple insertion points');
		process.exit(1);
	}
}


require('fs').writeFileSync('build/preprocessed.js', source);

// Uglify
var result = UglifyJS.minify(source, {
	fromString: true,
	mangle: {
		toplevel: true
	},
	compress: {
		hoist_vars: true,
		global_defs: constants
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

require('fs').writeFileSync('build/prod.html', inlined);
require('fs').writeFileSync('build/prod.js', minified);

console.log(Buffer.byteLength(minified) + ' bytes');