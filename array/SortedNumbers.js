/**
 * Created by Moises on 3/8/14.
 */

var LinearStats = require('./LinearStats');

var SortNumbers = {
	_helper     : function _helper (array, start, end, pivotIndex) {
		var i = start - 1, j = end, swapHolder;
		var pivot = array[pivotIndex];

		while (true) {
			while (array[++i] < pivot) {}
			while (pivot < array[--j]) {}
			if (i >= j) {
				return i;
			}
			swapHolder = array[i];
			array[i] = array[j];
			array[j] = swapHolder;
		}
	},
	_secondPass : function second_pass_sorter (array) {
		var i, j, max, value;
		for (i = 1, max = array.length; i < max; i++) {
			value = array[i];
			j = i;
			while (j-- != 0 && array[j] > value) {
				array[j + 1] = array[j];
			}
			array[j + 1] = value;
		}
		return array;
	},
	sort        : function sort (array) {
		var startStack = [0], endStack = [array.length], s = 1, pivotIndex, start, end;
		while (s-- !== 0) {
			start = startStack[s];
			end = endStack[s];
			pivotIndex = this._helper( array, start, end, (start + end) >> 1 );

			if (pivotIndex - start > 32) {
				startStack[s] = start;
				endStack[s++] = pivotIndex;
			}
			if (end - pivotIndex > 32) {
				startStack[s] = pivotIndex;
				endStack[s++] = end;
			}
		}
		return this._secondPass( array );
	}
};



function SortedNumbers (arrayOfNumbers) {
	if (arrayOfNumbers !== undefined) {
		this.array = arrayOfNumbers;
		SortNumbers.sort( arrayOfNumbers );
	} else {
		this.array = [];
	}
	this.length = this.array.length;
	this.known = {};
}
SortedNumbers.prototype = new LinearStats();
SortedNumbers.prototype.constructor = SortedNumbers;
SortedNumbers.prototype.findIndex = function (num) {
	var low = 0, high = this.array.length, mid;

	while (low < high) {
		mid = low + high >> 1; //a + b >> 1   is equivalent to Math.floor((a+b)/2)
		if (this.array[mid] > num) {
			high = mid;
		} else {
			low = mid + 1;
		}
	}
	return low;
};
SortedNumbers.prototype.indexOf = function (num) {
	var index = this.findIndex( num ) - 1;
	return this.array[index] === num ? index : -1;
};

SortedNumbers.prototype.remove = function (num) {
	this.length--;
	this.known = {};

	var index = this.indexOf( num );
	if (index !== -1) {
		this.array.splice( index, 1 );
	}
	return this;
}
SortedNumbers.prototype.push = function (num) {
	this.length++;
	this.known = {};

	var newIndex = this.findIndex( num );
	this.array.splice( newIndex, 0, num );
	return this;

	/*
	 //Uncomment this section and delete the prior 3 lines if building 1gb arrays (splicing creates a duplicate array, doubling the memory)
	 var i = this.length;
	 while (i !== newIndex) {
	 this.array[i] = this.array[--i];
	 }
	 this.array[i] = num;

	 return this;
	 */
};
SortedNumbers.prototype.frequencies = function (binSize, start) {
	//todo
	/*var freq = [], max=start+binSize;
	 for (var i = 0; i < this.length; i++){
	 freq[i] =
	 }*/

};
/*SortedNumbers.prototype.removeOutsiders = function(){
 var up = this.upperFence, low = this.lowerFence, i = this.length, j=-1;
 while (this.array[--i] < low){}
 while (this.array[++j] > up){}
 this.array = this.array.slice(j,i);
 this.unsorted = this.array.slice();
 this.length = i-j;
 };*/
Object.defineProperties( SortedNumbers.prototype, {
	clone              : {get : function () {
		var n = new SortedNumbers();
		n.array = this.array.slice();
		n.length = this.length;
		n.known = this.known;
		return n;
	}},
	removeOutsiders   : {get : function () {
		var up = this.upperFence, low = this.lowerFence, i = this.length, j = -1;
		while (this.array[--i] > up) {}
		while (this.array[++j] < low) {}
		i++;
		this.array = this.array.slice( j, i );
		this.length = i - j;
		this.known = {};
		return this;
	}},

	interQuartileRange : {get : function () {
		if (this.known.iqr === undefined) {
			this.known.iqr = this.q3 - this.q1;
		}
		return this.known.iqr;
	}},
	upperFence         : {get : function () {
		if (this.known.upperFence === undefined) {
			this.known.upperFence = this.q3 + 1.5 * this.interQuartileRange;
		}
		return this.known.upperFence;
	}},
	lowerFence         : {get : function () {
		if (this.known.lowerFence === undefined) {
			this.known.lowerFence = this.q1 - 1.5 * this.interQuartileRange;
		}
		return this.known.lowerFence;
	}},
	range              : {get : function () { return this.array[this.length - 1]-this.array[0] ;}},
	max                : {get : function () { return this.array[this.length - 1];}},
	min                : {get : function () {return this.array[0];}},
	median             : {get : function () {
		if (this.known.mid === undefined) {
			var midIndex = this.length >> 1;
			this.known.mid = (this.length & 1) ? 										//if odd
						  (this.array[midIndex]) :									//use middle number
						  ((this.array[midIndex] + this.array[midIndex - 1]) / 2);		//else average of middle two numbers
		}
		return this.known.mid;
	}},
	q3                 : {get : function () {
		if (this.known.q1 === undefined) {
			var index = this.length - 1,
				ratio = (index % 4) / 4;
			index -= index >> 2;
			this.known.q1 = this.array[index - 1] * ratio + this.array[index] * (1 - ratio);
		}
		return this.known.q1;
	}},
	q1                 : {get : function () {
		if (this.known.q3 === undefined) {
			var index = this.length - 1,
				ratio = index / 4;
			index = index >> 2;
			ratio -= index;
			this.known.q3 = this.array[index + 1] * ratio + this.array[index] * (1 - ratio);
		}
		return this.known.q3;
	}}
} );