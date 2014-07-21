/**
 * <b>replaceChars</b> creates a new function that will replace certain characters as specified in <i>replacements</i>
 * @param {{}} replacements The property names should be a single character that will be replaced with string from property values.
 * @returns {Function}
 */
function replaceChars(replacements){
	var code = 'var e,b=0,a,f=d.length,c="";for(a=0;a<f;a++)e=d.charCodeAt(a),';
	var keys = Object.keys(replacements), len = keys.length-1;
	for (var i = 0; i < len; i ++){
		code += keys[i].charCodeAt(0) + '===e?(c+=d.substring(b,a)+"' + replacements[keys[i]] +'",b=a+1):';
	}
	return new Function('d', code + keys[i].charCodeAt(0) + '===e&&(c+=d.substring(b,a)+"' + replacements[keys[i]] +'",b=a+1);return c+d.substring(b)');
}
module.exports = replaceChars;
