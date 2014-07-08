/**
 * Created by Moises on 3/12/14.
 */

function Sorter (options) {
	options = options || {};
	this.set = options.set || this.defaults.set;
	this.get = options.get || this.defaults.get;
	this.compare = options.compare || this.defaults.compare;
	this.swap = options.swap || this.defaults.swap;
	this.setup = options.setup || this.defaults.setup;
	this.destroy = options.destroy || this.defaults.destroy;
}
Sorter.prototype.defaults = {
	set     : function (index, value) {
		this.array[index] = value;
	},
	get     : function (index) {
		return this.array[index];
	},
	compare : function (objectA, objectB) {
		return objectA < objectB;
	},
	swap    : function (indexA, indexB) {
		var hold = this.array[indexA];
		this.array[indexA] = this.array[indexB];
		this.array[indexB] = hold;
	},
	setup   : function (obj) {
		this.array = obj;
		this.length = obj.length;
	},
	destroy : function () {
		delete this.array;
	}
};
Sorter.prototype.sort = function (arrayObj) {
	this.setup( arrayObj );
	this.resort();
	this.destroy();
	return arrayObj;
};
Sorter.prototype.resort = function () {

	var startStack = [0], endStack = [this.length], s = 1, pivotIndex, start, end, pivot;
	while (s-- !== 0) {
		start = startStack[s];
		end = endStack[s];
		pivotIndex = (start + end) >> 1;
		pivot = this.get( pivotIndex );
		//the for statement below is infinite loop (lacks comparison), exit is through return statement
		for (start--; ;) {
			while (this.compare( this.get( ++start ), pivot )) {}
			while (this.compare( pivot, this.get( --end ) )) {}
			if (start >= end) {
				break;
			}
			this.swap( start, end );
		}

		if (pivotIndex - start > 32) {
			startStack[s] = start;
			endStack[s++] = pivotIndex;
		}
		if (end - pivotIndex > 32) {
			startStack[s] = pivotIndex;
			endStack[s++] = end;
		}
	}
	//second pass filter
	var i, j, max, tmp, tmp2;
	for (i = 1, max = this.length; i < max; i++) {
		tmp = this.get( i );
		j = i - 1;
		tmp2 = this.get(j);
		while (-1 != j && this.compare( tmp, tmp2 )){
			this.set( j + 1, tmp2);
			tmp2 = this.get(--j);
		}
		this.set( j + 1, tmp );
	}
};

module.exports = Sorter;