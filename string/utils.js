var exports = {};

/**
 * <b>escapeHTML</b> scans <i>txt</i> and converts all ", &, <, > as well as any symbol who's ascii code > 127, into their escaped HTML equivalent
 * @param {string} txt
 * @returns {string}
 */
function escapeHTML (txt) {
	var i, txtLength, charCode, out = '', start = 0;
	for (i = 0, txtLength = txt.length; i < txtLength;) {
		charCode = txt.charCodeAt( i );
		//"&<>
		for (i++; i < txtLength && charCode !== 34 && charCode !== 38 && charCode !== 60 && charCode !== 62 && charCode < 127; i++) {
			charCode = txt.charCodeAt( i );
		}
		out += txt.slice( start, i - 1 ) + '&#' + charCode;
		start = i;
	}
	return out;
}
exports.escapeHTML = escapeHTML;

exports.pad_with_zeros = function (n, width) {
	n += '';
	return n.length < width ? new Array( width - n.length + 1 ).join( '0' ) + n : n;
};
/**
 * <b>repeat</b> takes <i>str</i> and repeats it <i>qty</i> times
 * @param {string} str
 * @param {number} qty
 * @returns {string}
 */
exports.repeat = function (str, qty) {
	var r = '';
	for (var i = 0; i < qty; i++) r += str;
	return r;
};

