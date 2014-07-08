/**
 * Converts decimal to hexadecimal
 * @param {Number} dec Decimal number
 * @returns {string} Hexadecimal conversion
 */
function toHex (dec) {
	if (dec < 0) {
		dec = 0;
	}
	else if (dec > 255) {
		dec = 255;
	}


	return "0123456789ABCDEF"[dec >>> 4]
	  + "0123456789ABCDEF"[dec & 15];
}

/**
 * <b>toLCH</b> takes an RGB string and converts it into an LCH object
 *
 * Ranges are:
 *      R [0, 255]   G [0, 255]   B [0, 255]
 *      L [0, 100]   H [0,360]    C [0, 133.81586201619493]
 *      a [-86.18463649762525       98.25421868616114]
 *      b: [-107.86368104495168     94.48248544644461]
 * @param {string} rgbStr The RGB string. Only the last six characters are evaluated.
 * @returns {{L: number, C: number, H: number}}
 */
function toLCH (rgbStr) {
	if (!rgbStr) return {L:0, C:0, H: 0};
	var
	  R,
	  G,
	  B,
	  var_R,
	  var_G,
	  var_B,
	  X,
	  Y,
	  Z,
	  var_X,
	  var_Y,
	  var_Z,
	  ref_X,
	  ref_Y,
	  ref_Z,
	  L,
	  a,
	  b,
	  C,
	  H,
	  var_H
	  ;

	ref_X = 95.047;
	ref_Y = 100;
	ref_Z = 108.883;


	rgbStr = rgbStr.slice( -6 );
	R = parseInt( rgbStr.substr( 0, 2 ), 16 );
	G = parseInt( rgbStr.substr( 2, 2 ), 16 );
	B = parseInt( rgbStr.substr( 4, 2 ), 16 );

	//----------------------------------------------Converting to XYZ -----------------------------------------------
	var_R = ( R / 255 );        //R from 0 to 255
	var_G = ( G / 255 );        //G from 0 to 255
	var_B = ( B / 255 );        //B from 0 to 255

	var_R = var_R > 0.04045 ?
	        Math.pow( ( var_R + 0.055 ) / 1.055, 2.4 ) :
	        var_R / 12.92;
	var_G = var_G > 0.04045 ?
	        Math.pow( ( var_G + 0.055 ) / 1.055, 2.4 ) :
	        var_G / 12.92;
	var_B = var_B > 0.04045 ?
	        Math.pow( ( var_B + 0.055 ) / 1.055, 2.4 ) :
	        var_B / 12.92;

	var_R = var_R * 100;
	var_G = var_G * 100;
	var_B = var_B * 100;

	//Observer. = 2°, Illuminant = D65
	X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
	Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
	Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;

	//----------------------------------------------Converting to Lab -----------------------------------------------

	var_X = X / ref_X;          //ref_X =  95.047   Observer= 2°, Illuminant= D65
	var_Y = Y / ref_Y;          //ref_Y = 100.000
	var_Z = Z / ref_Z;          //ref_Z = 108.883

	var_X = var_X > 0.008856 ?
	        Math.pow( var_X, 1 / 3 ) :
	        ( 7.787 * var_X ) + ( 16 / 116 );
	var_Y = var_Y > 0.008856 ?
	        Math.pow( var_Y, 1 / 3 ) :
	        ( 7.787 * var_Y ) + ( 16 / 116 );
	var_Z = var_Z > 0.008856 ?
	        Math.pow( var_Z, 1 / 3 ) :
	        ( 7.787 * var_Z ) + ( 16 / 116 );

	L = ( 116 * var_Y ) - 16;
	a = 500 * ( var_X - var_Y );
	b = 200 * ( var_Y - var_Z );

	//----------------------------------------------Converting to LCH -----------------------------------------------

	var_H = Math.atan2( b, a );  //Quadrant by signs

	var_H = var_H > 0 ?
	        ( var_H / Math.PI ) * 180 :
	        360 - ( Math.abs( var_H ) / Math.PI ) * 180;

	C = Math.sqrt( a * a + b * b );
	H = var_H;
	return {
		L : L,
		C : C,
		H : H
	};
}
exports.toLCH = toLCH;

/**
 * Converts an LCH object into RGB
 * @param {{L:number, C:number, H:number}} lchObj
 * @param {boolean} [returnAnObject=false] If true, this function returns an RGB object. Else it returns a six digit hex string.
 * @returns {string|{R:number, G:number, B:number}} The RGB object or six digit hex conversion of lchObj
 */
function toRGB (lchObj, returnAnObject) {
	//CIE-H° from 0 to 360°
	if (!(lchObj && lchObj.L && lchObj.C && lchObj.H)) {
		return '000000';
	}

	var L = lchObj.L,
	  C = lchObj.C,
	  H = lchObj.H;


	var a, b;
	a = Math.cos( H / 180 * Math.PI ) * C;
	b = Math.sin( H / 180 * Math.PI ) * C;

	var
	  X,
	  Y,
	  Z,
	  var_X,
	  var_Y,
	  var_Z,
	  ref_X,
	  ref_Y,
	  ref_Z
	  ;

	ref_X = 95.047;
	ref_Y = 100;
	ref_Z = 108.883;


	var_Y = ( L + 16 ) / 116;
	var_X = a / 500 + var_Y;
	var_Z = var_Y - b / 200;

	function hlp (v) {
		var v3 = v * v * v;
		return v3 > 0.008856 ?
		       v3 :
		       (v - 16 / 116) / 7.787;
	}

	var_Y = hlp( var_Y );
	var_X = hlp( var_X );
	var_Z = hlp( var_Z );

	X = ref_X * var_X;     //ref_X =  95.047     Observer= 2°, Illuminant= D65
	Y = ref_Y * var_Y;     //ref_Y = 100.000
	Z = ref_Z * var_Z;     //ref_Z = 108.883


	var
	  R,
	  G,
	  B,
	  var_R,
	  var_G,
	  var_B;


	var_X = X / 100;        //X from 0 to  95.047      (Observer = 2°, Illuminant = D65)
	var_Y = Y / 100;        //Y from 0 to 100.000
	var_Z = Z / 100;        //Z from 0 to 108.883

	var_R = var_X * 3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
	var_G = var_X * -0.9689 + var_Y * 1.8758 + var_Z * 0.0415;
	var_B = var_X * 0.0557 + var_Y * -0.2040 + var_Z * 1.0570;

	function h2 (v) {
		return v > 0.0031308 ?
		       1.055 * Math.pow( v, 1 / 2.4 ) - 0.055 :
		       12.92 * v;
	}

	var_R = h2( var_R );
	var_G = h2( var_G );
	var_B = h2( var_B );

	R = var_R * 255;
	G = var_G * 255;
	B = var_B * 255;


	return toHex( R ) + toHex( G ) + toHex( B );
}
exports.toRGB = toRGB;