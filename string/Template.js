/**
 * Created by Moises on 6/26/14.
 */
var Template = {};
var previouslyEncountered = {};
var fs = require( 'fs' );

/**
 * Compiles a template string, caches it, and executes it immediately
 * @param {string} templateStr The template string from which to create a function
 * @param {{}} object The object to be passed to the Template
 * @returns {string} The template result
 */
Template.exec = function exec (templateStr, object) {
	return (previouslyEncountered[templateStr] || (previouslyEncountered[templateStr] =
	  compile( templateStr )))( object );
};

Template.renderFile = function renderFile (filename, options, callback) {
	if (previouslyEncountered[filename]) {
		return previouslyEncountered[filename]( options );
	} else {
		fs.readFile( '/etc/hosts', 'utf8', function (err, data) {
			if (err) {
				return callback( err );
			} else {
				previouslyEncountered[filename] = Template.compile( data );
				return previouslyEncountered[filename]( options );
			}
		} );
	}
};

/**
 * Creates a template function. Sample string
 * % simplePropertyName %
 * %# commented out %
 * %! complex code % -- eg, if/then, loops, function calls, to add to output "x+='string'"
 * %@ _.propertyInPlace %"
 * @param {String} str The template from which to create the template function.
 * @returns {Function} This function takes in a single 'p' object, and outputs the template string.
 */
Template.compile = function compile (str) {
	var strLength = str.length, out = "var x='", c, c2, i;
	for (var start = 0; start < strLength;) {
		for (c = str.charCodeAt( start ), i = 1 + start; c !== 37 && i <= strLength; i++) {
			if (c >= 9 && c <= 13 || c === 39) {
				out += str.substr( start, i - start - 1 ) +
				  (c === 10 ? '\\n' : c === 13 ? '\\r' : c === 39 ? "\\'" : '\\t');
				start = i;
			}
			c = str.charCodeAt( i );
		}
		out += str.substr( start, i - start - 1 );

		if (i <= strLength) {
			c2 = str.charCodeAt( i++ );
			if (c2 === 37) {
				//%% = escaped '%'
				out += '%';
			} else {
				start = i - (c2 === 32);
				for (c = str.charCodeAt( i ); c !== 37 && i <= strLength; i++) { c = str.charCodeAt( i ); }

				if (c2 !== 35) {

					//%  -32--> autoFinish
					//%! -33--> complex
					//%@ -64--> inplace
					//%# -35--> comment
					//%$ -36-->
					//%% -37--> escaped


					var ss = str.substr( start, i - start - 1 ).trim();
					if (c2 === 32) {
						out += "'+(p['" + ss + "']||'')+'";
					} else if (c2 === 33) {
						out += "';" + ss + ";x+='";
						/*
						 } else if (c2 === 35) {
						 //ignore command, do nothing
						 } else if (c2 === 36) {
						 //not set
						 */
					} else {
						out += "'+(" + ss + ")+'";
					}
				}
			}
		}
		start = i;
	}
	out += "';return x;";

	try {
		var f = new Function( 'p', out );
		//f.code = out;
		return f;
	} catch (n) {
		throw new Error( "Invalid template" );
	}
};

module.exports = Template;