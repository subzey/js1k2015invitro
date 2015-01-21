#!/usr/bin/env node


function runRegPack(formParams, withMath){

	formParams = formParams || {};

	var defaultFormParams = {
		originalString: "",
		paramOHash2D: true,
		paramOHashWebGL: true,
		paramOHashAudio: true,
		paramOGlobalDefined: true,
		paramOGlobalVariable: "c",
		paramOGlobalType: "0",
		paramOReassignVars: true,
		paramOExcludedVars: "a b c",
		paramFGain: "1",
		paramFLength: "0",
		paramFCopies: "0",
		paramFTiebreaker: "1",
		stage0Output: "",
		stage0Details: "",
		stage1Output: "",
		stage1Details: "",
		stage2Output: "",
		stage2Details: ""
	};

	function KindaElement(){
		this.style = {};
		this.attributes = {};
	}

	KindaElement.prototype.value = '';
	Object.defineProperty(KindaElement.prototype, 'checked', {
		get: function(){
			return !!this.value;
		}
	});

	KindaElement.prototype.getAttribute = function(name){
		return this.attributes[name] || '';
	};

	KindaElement.prototype.setAttribute = function(name, value){
		this.attributes[name] = value || '';
	};

	var elementsById = {};

	var kindaDocument = {
		getElementById: function(id){
			if (!elementsById[id]){
				var element = new KindaElement();
				if (id in formParams){
					element.value = formParams[id];
				} else if (id in defaultFormParams){
					element.value = defaultFormParams[id];
				}
				elementsById[id] = element;
			}
			return elementsById[id];
		}
	};

	var sandbox = require('vm').createContext({
		document: kindaDocument,
		console: console
	});

	require('fs').readFileSync(__dirname  + '/regPack.html', 'utf-8').replace(/<script>([^]*?)<\/script>/g, function(_, code){
		require('vm').runInContext(code, sandbox, 'regpack.html/script');
	});

	sandbox.callRegPack(!withMath);

	if (!elementsById.stage2Output){
		throw new Error('something went wrong with RegPack');
	}
	return elementsById.stage2Output.value;
}

module.exports = runRegPack;
