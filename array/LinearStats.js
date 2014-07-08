/**
 * Created by Moises on 3/8/14.
 */

var SortedNumbers = require('./SortedNumbers');

function LinearStats (array) {
	this.array = array || [];
	this.length = this.array.length;
	this.known = {};
}
LinearStats.prototype.probability = function (value) {
	//the line below calculates the zscore
	var zScore = (this.avg - value) / this.stdDev;

	//the rest of the equation converts zscore into probability
	var y, x, w;
	if (zScore == 0.0) {
		x = 0.0;
	} else {
		y = 0.5 * Math.abs( zScore );
		if (y > (6 * 0.5)) {
			x = 1.0;
		} else if (y < 1.0) {
			w = y * y;
			x = ((((((((0.000124818987 * w
				- 0.001075204047) * w + 0.005198775019) * w
				- 0.019198292004) * w + 0.059054035642) * w
				- 0.151968751364) * w + 0.319152932694) * w
				- 0.531923007300) * w + 0.797884560593) * y * 2.0;
		} else {
			y -= 2.0;
			x = (((((((((((((-0.000045255659 * y
				+ 0.000152529290) * y - 0.000019538132) * y
				- 0.000676904986) * y + 0.001390604284) * y
				- 0.000794620820) * y - 0.002034254874) * y
				+ 0.006549791214) * y - 0.010557625006) * y
				+ 0.011630447319) * y - 0.009279453341) * y
				+ 0.005353579108) * y - 0.002141268741) * y
				+ 0.000535310849) * y + 0.999936657524;
		}
	}
	return zScore > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
};

LinearStats.prototype.push = function (num) {
	this.array[this.length++] = num;
	this.known = {};
	return this;
};
LinearStats.prototype.frequencies = function (binSize, start) {
	//todo
	/*var freq = [], max=start+binSize;
	 for (var i = 0; i < this.length; i++){
	 freq[i] =
	 }*/

};
LinearStats.prototype.toString = function(){return this.array.toString();};
Object.defineProperties( LinearStats.prototype, {
	clone              : {get : function () {
		var n = new LinearStats();
		n.array = this.array.slice();
		n.length = this.length;
		n.known = this.known;
		return n;
	}},
	removeOutsiders    : {get : function () {
		return this.sorted.clone.removeOutsiders;
	}},
	kurtosis           : {get : function () {
//		throw new Error('not yet complete');
		var n = this.length,
			v = this.variance;
		return n * (n + 1) * this.fourthMoment / (v * v * (n - 1) * (n - 2) * (n - 3))
			- 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3));
	}},
	skewness           : {get : function () {
		var s = this.stdDev, t = this.thirdMoment;
		return t/(s*s*s);
	}},
	sorted             : {get : function () {
		if (this.known.sorted === undefined) {this.known.sorted = new SortedNumbers( this.array.slice() ); }
		return this.known.sorted;
	}},
	interQuartileRange : {get : function () {return this.sorted.interQuartileRange;}},
	upperFence         : {get : function () {return this.sorted.upperFence;}},
	lowerFence         : {get : function () {return this.sorted.lowerFence;}},
	range              : {get : function () {return this.sorted.range;}},
	min                : {get : function () {return this.sorted.min;}},
	max                : {get : function () {return this.sorted.max;}},
	median             : {get : function () {return this.sorted.median; }},
	q1                 : {get : function () {return this.sorted.q1;}},
	q3                 : {get : function () {return this.sorted.q3;}},
	sum                : {get : function () {
		if (this.known.sum === undefined) {
			var s = 0;
			for (var i = 0; i < this.length; i++) {
				s += this.array[i];
			}
			this.known.sum = s;
		}
		return this.known.sum;
	}},
	avg                : {get : function () {
		if (this.known.avg === undefined) {
			this.known.avg = this.sum / this.length;
		}
		return this.known.avg;
	}},
	stdDev             : {get : function () {
		if (this.known.stdDev === undefined) {
			this.known.stdDev = Math.sqrt( this.variance ) || 0.5;
		}
		return this.known.stdDev;
	}},
	//also known as second moment
	variance           : {get : function () {
		if (this.known.variance === undefined) {
			var s = 0, avg = this.avg;
			for (var i = 0; i < this.length; i++) {
				s += Math.pow( this.array[i] - avg, 2 );
			}
			this.known.variance = s / (this.length);
		}
		return this.known.variance;
	}},
	thirdMoment        : {get : function () {
		if (this.known.thirdMoment === undefined) {
			var s = 0, avg = this.avg;
			for (var i = 0; i < this.length; i++) {
				s += Math.pow( this.array[i] - avg, 3 );
			}
			this.known.thirdMoment = s / this.length;
		}
		return this.known.thirdMoment;
	}},
	fourthMoment       : {get : function () {
		if (this.known.fourthMoment === undefined) {
			var s = 0, avg = this.avg;
			for (var i = 0; i < this.length; i++) {
				s += Math.pow( this.array[i] - avg, 4 );
			}
			this.known.fourthMoment = s / this.length;
		}
		return this.known.fourthMoment;
	}}
} );