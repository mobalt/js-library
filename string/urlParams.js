/**
 * <b>urlParams</b> takes a URL paramater and converts into an object
 * @param str The URL Parameter string to evaluate, similar to <i>u[name][first]=Henny&u[name][last]=Penny&u[age]=9&u[physical][height]=69&u[physical][weight]=155&u[nationality]=usa</i>
 * @returns {{}}
 */
module.exports = function urlParams(str){
	var mainRx = /(.+?)(\[(?:.+?)\])?(?:=([^&]+)?)?(?:&|$)/g,
	  propNameRx = /\[(.+?)\]/g;
	var obj = {}, current, propName, r,q;
	while ((r=mainRx.exec(str)) !== null){
		propName = r[1];
		current = obj;
		while ((q = propNameRx.exec(r[2])) !== null){
			current = typeof current[propName] == 'object' ? current[propName] : (current[propName] = {});
			propName = q[1];
		}
		if (r[3] == undefined){
			current[propName] = 1;
		} else {
			current[propName] = r[3];
		}
	}
	return obj;
 };