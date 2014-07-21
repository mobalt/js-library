var replace = require( './replaceChars' );
/**
 * Takes all dangerous characters in <i>str</i> and converts them into the HTML codes, thereby preventing them from breaking anything.
 * @params str To be diffused
 * @returns {string}
 */
module.exports = replace( {'&'    : '&amp;',
	                           '"' : '&quot;',
	                           "'" : '&#39',
	                           '<' : '&lt',
	                           '>' : '&gt'} );
