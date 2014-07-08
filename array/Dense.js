var DenseArray = {};

/**
 * Merges the elements of all arrays in array2D into a single hostArray
 * <b>concat</b> adds all the elements in <i>array2D</i> and merges them, in order, into the single <i>hostArray</i>.
 * for example: concat([[1,2,3],[4,5,6],[7,8]], [0,1]) --> [0,1,1,2,3,4,5,6,7,8]
 *
 * <b>concat</b> does not alter any other array except the hostArray, if one is provided. The elements are shallow copied, if possible (numbers and strings are hard-copied onto new array)
 * @param {Array} array2D A single array containing all the arrays to concatenate together
 * @param {Array=} hostArray If omitted, a new array is created and returned
 * @returns {Array}
 */
DenseArray.concat = function concat (array2D, hostArray) {
	var t = hostArray && hostArray.length, numArrays = array2D.length, current, i, j, len;
	if (!t) {
		t = 0;
		for (i = 0; i < numArrays; i++) {
			t += array2D[i].length || 0;
		}
		hostArray = new Array( t );
		t = 0;
	}
	for (i = 0; i < numArrays; i++) {
		current = array2D[i];
		for (j = 0, len = current.length; j < len; j++) {
			hostArray[t++] = current[j];
		}
	}
	return hostArray;
};


/**
 * <b>every</b> runs <i>testFn</i> on each element in <i>array</i>, in order, for as long as all returned values === expectedValue. Upon mismatch, testing ceases and <i>false</i> is immediately returned.
 * @param {Array} array
 * @param {function} testFn (element, index, array) --> return value must match <i>expectedValue</i>
 * @param {*=true} expectedValue
 * @returns {boolean} True if each element returned expectedValue
 */
DenseArray.every = function every (array, testFn, expectedValue) {
	expectedValue = expectedValue || true;
	for (var i = 0, len = array.length; i < len; i++) {
		if (testFn( array[i], i, array ) !== expectedValue) {return false;}
	}
	return true;
};


/**
 * <b>filter</b> runs <i>testFn</i> on each element in <i>array</i>, in order, and returns a new array with every element that matches (===) the <i>inclusionValue</i>
 * @param {Array} array
 * @param {function} testFn (element, index, array) --> if return value matches <i>inclusionValue</i> then element is stored in return array
 * @param {*=true} inclusionValue
 * @returns {Array}
 */
DenseArray.filter = function filter (array, testFn, inclusionValue) {
	inclusionValue |= true;
	var results = [], r = 0;
	for (var i = 0, len = array.length; i < len; i++) {
		if (testFn( array[i], i, array ) === inclusionValue) {
			results[r++] = array[i];
		}
	}
	return results;
};


/**
 * <b>forEach</b> executes the <i>iteratorFn</i> once for each element in <i>array</i> in ascending order (first to last).
 *
 * <i>iteratorFn</i> is invoked with three arguments: <tt>(element, index, array)</tt>
 *
 * Inside the function code, to replace references to objects or string do not use
 * <tt>element = new object;</tt>
 * the correct way is to use
 * <tt>array[index] = new object</tt></div>
 * @param {Array} array
 * @param {function} iteratorFn (element, index, array)
 */
DenseArray.forEach = function forEach (array, iteratorFn) {
	for (var i = 0, len = array.length; i < len; i++) {
		iteratorFn( array[i], i, array );
	}
};
/** alias of DenseArray.forEach **/
DenseArray.each = DenseArray.forEach;


/**
 * <b>indexOf</b> finds the first instance of <tt>item</tt> in normal arrays. <br />For <u>sorted</u> arrays, use <b>indexOfSorted</b> for faster performance.
 * @param {Array} array A naive, unsorted array
 * @param {*} item The array element to find
 * @returns {number} If not found, returns -1. Else, returns first index.
 */
DenseArray.indexOf = function indexOf (array, item) {
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] === item) {
			return i;
		}
	}
	return -1;
};

/**
 * <b>indexOfSorted</b> finds the last instance of <tt>item</tt> in the sorted array. If item is not found, a value of -1 is returned.
 * @param {Array} array A simple sorted array
 * @param {*} item The array element to find
 * @param {function=} valueFunc A function that returns the sorted value of array element, can be as simple as <tt>function valueOf (array, index) {return array[index];}</tt> or more complex:  <tt>return Math.cos(array[index]);</tt>
 * @returns {number}
 */
DenseArray.indexOfSorted = function indexOfSorted (array, item, valueFunc) {
	if (typeof valueFunc != 'function') {
		valueFunc = vf;
	}
	var index = DenseArray.indexToInsert( array, item, valueFunc ) - 1;
	return valueFunc( array, index ) == item ? index : -1;
};
/** indexToInsert
 * Find the index where <i>item</i> should be inserted to maintain the sorted <i>array</i>.
 * @param {Array} array A simple sorted array
 * @param {*} item The array element to find
 * @param {function=} valueFunc A function that returns the sorted value of array element, can be as simple as <tt>function valueOf (array, index) {return array[index];}</tt> or more complex:  <tt>return Math.cos(array[index]);</tt>
 * @returns {number}
 */
DenseArray.indexToInsert = function indexToInsert (array, item, valueFunc) {
	if (typeof valueFunc != 'function') {
		valueFunc = vf;
	}
	var low = 0, high = array.length, mid;
	while (low < high) {
		mid = low + high >> 1; //a + b >> 1   is equivalent to Math.floor((a+b)/2)
		if (valueFunc( array, mid ) > item) {
			high = mid;
		} else {
			low = mid + 1;
		}
	}
	return low;
};

/** insert
 * Adds elements into the middle of an array
 * Equivalent to <tt>array.splice(start, 0, insertElement1, insertElement2,...)</tt>, but does not return the empty array of deleted values
 * @param {Array} array The array to be altered
 * @param {Array} insertArr A single array containing all elements to be inserted into <tt>array</tt>
 * @param {number=} start If negative, <tt>start = length - start</tt>. <br />If omitted, <tt>start = array.length </tt> <br />     (this will make the function behave similar to Array.push(), but faster)
 * @returns {Array}
 */
DenseArray.insert = function insert (array, insertArr, start) {
	var len = array.length, add = insertArr.length;
	if (!(add > 0)) {
		return array;
	}

	if (start === undefined) {
		start = len;
	} else if (start > len || (start < 0 && (start += len) < 0)) {
		throw new Error( 'Argument "start" must be between -n and n, where n is array.length' );
	}
	var sStart = start + add;
	var i, newLen = len + add;
	for (i = len; i < newLen; i++) {
		array[i] = 0;
	}
	for (i = newLen - 1; i >= sStart; i--) {
		array[i] = array[i - add];
	}
	for (i = 0; i < add; i++) {
		array[i + start] = insertArr[i];
	}
	return array;
};


/** join
 * Joins all the elements in an array into a single string
 @param {Array} array
 @param {string=""} [separator]
 @param {string=""} [prefix]
 @param {string=""} [suffix]
 @return {string}
 */
DenseArray.join = function join (array, separator, prefix, suffix) {
	separator = separator || '';
	var str = '';
	for (var i = 1, len = array.length; i < len; i++) {
		str += separator + array[i].toString();
	}
	return (prefix || '') + array[0].toString() + str + (suffix || '');
};


/** lastIndexOf
 * Find the last instance of <tt>item</tt> in the naive array. <br /> If array is actually sorted, use <tt>indexOfSorted</tt> for faster performance.
 * @param {Array} array A naive, unsorted array
 * @param {*} item The array element to find
 * @returns {number}
 */
DenseArray.lastIndexOf = function lastIndexOf (array, item) {
	for (var i = array.length - 1; i > -1 && array[i] !== item; i--) {}
	return i;
};


/**
 * <b>map</b> executes the <i>iteratorFn</i> once for each element in <i>array</i> in order (first to last), and returns the results in a new array
 *
 * The range of elements processed by map is set before the first invocation of <i>iteratorFn</i>. Elements which are appended to the array after the call to map begins will not be visited by <i>iteratorFn</i>. Elements not yet visited can be modified, but deleting is not recommended since deleted elements will still be visited.
 * @param {Array} array
 * @param {function} iteratorFn (element, index, array)
 */
DenseArray.map = function map (array, iteratorFn) {
	var len = array.length, results = new Array( len );
	for (var i = 0; i < len; i++) {
		results[i] = iteratorFn( array[i], i, array );
	}
	return results;
};


/**
 * Pops the last element out of array and returns the value
 @return {*}
 */
DenseArray.pop = function pop (array) {
	var len = array.length,
	  result = array[ len];
	array.length = len - 1;
	return result;
};


/** push
 * <b>push</b> adds a single <i>element</i> to the end of an <i>array</i> (unlike <tt>Array.prototype.push</tt>)
 * To simultaneously push more than one element, consider using
 *   <tt><b>insert</b>(array, [item1,item2,item3,..])</tt>
 @param {Array} array
 @param {*} [element]
 */
DenseArray.push = function push (array, element) {
	array[array.length] = element;
	return array;
};


/**
 * <b>reduce</b> executes the <i>accumulatorFn</i> once for each element in <i>array</i> in order (first to last) and distills these elements into a single return value.
 * <i>accumulatorFn</i> receives four arguments:
 *   - <tt>reducedValue</tt>: the return value from the previous callback (or the initial value),
 *   - <tt>currentValue</tt>: the value of the current element,
 *   - <tt>index</tt>: the current index,
 *   - <tt>array</tt>: the array over which iteration is occurring
 * @param {Array} array
 * @param {function} accumulatorFn (reducedValue, currentValue, index, array)
 * @param {*=} initialValue If set, first call will be <tt>accumulatorFn(initialValue, array[0], ....)</tt><br />. Otherwise it'll be, <tt> accumulatorFn(array[0], array[1],....)</tt>
 * @returns {*}
 */
DenseArray.reduce = function reduce (array, accumulatorFn, initialValue) {
	//todo test
	var i = 0, len = array.length;
	if (initialValue === undefined) {
		initialValue = array || array[0];
		i = 1;
	}
	for (; i < len; i++) {
		initialValue = accumulatorFn( initialValue, array[i], i, array );
	}
	return initialValue;
};


/**
 * <b>reduceRight</b> is identical to <b>reduce</b> but the elements are called in reverse order (from last to first).
 * @param {Array} array
 * @param {function} accumulatorFn (reducedValue, currentValue, index, array)
 * @param {*=} initialValue If set, first call will be <tt>accumulatorFn(initialValue, array[0], ....)</tt><br />. Otherwise it'll be, <tt> accumulatorFn(array[0], array[1],....)</tt>
 * @returns {*}
 */
DenseArray.reduceRight = function reduceRight (array, accumulatorFn, initialValue) {
	//todo test
	var i = array.length - 1;
	if (initialValue === undefined) {
		initialValue = array || array[i];
		i--;
	}
	for (; i >= 0; i--) {
		initialValue = accumulatorFn( initialValue, array[i], i, array );
	}
	return initialValue;
};


/** remove
 * Equivalent to <tt>array.splice(start, deleteCount)</tt>, but unlike the native array.prototype function, this function does not return an array of deleted values.
 * <br /> To <b>insert</b> and <b>remove</b> elements, consider using the full <b>splice</b> function in this package
 * @param {Array} array The array to be altered
 * @param {number} start If negative, <tt>start = length - start</tt>. <br />If omitted, <tt>start = array.length </tt> <br />     (this will make the function behave similar to Array.push(), but faster)
 * @param {number=} deleteCount If set to a positive integer, then removes elements starting from <tt>array[start]</tt> until <tt>array[start+deleteCount-1]</tt><br /> If 0, then remove nothing. <br />If omitted, <tt>deleteCount=array.length</tt>
 * @returns {Array}
 */
DenseArray.remove = function remove (array, start, deleteCount) {
	var len = array.length;
	if (start === undefined || start > len || (start < 0 && (start += len) < 0)) {
		throw new Error( 'Argument "start" must be between -n and n, where n is array.length' );
	}
	if (deleteCount === undefined || deleteCount > len - start) {
		deleteCount = len - start;
	} else if (deleteCount >= 0 === false) {
		throw new Error( 'Argument "deleteCount" must be a non-negative integer, or undefined' );
	}
	var i,
	  newLen = len - deleteCount;
	for (i = start; i < newLen; i++) {
		array[i] = array[i + deleteCount];
	}

	array.length = newLen;
	return array;
};


/**
 * Reverses the order of elements in <i>array</i>
 * @param {Array} array
 * @returns {Array}
 */
DenseArray.reverse = function reverse (array) {
	var len = array.length, pivot = len >> 1, tmp;
	len--;
	for (var i = 0; i < pivot; i++) {
		tmp = array[i];
		array[i] = array[len - i];
		array[len - i] = tmp;
	}
	return array;
};


/** shift
 * <b>shift</b> removes the first element (index 0) and returns its value.
 * Is equivalent to pop() but works on the first element (instead of last) and is much slower (shifts all elements one over, rather than just trimming last element)
 * @param {Array} array
 * @returns {*}
 */
DenseArray.shift = function shift (array) {
	var result = array[0];
	DenseArray.remove( array, 0, 1 );
	return result;
};
/**
 * <b>shuffle</b> rearranges the elements of <i>array</i> into a random order using "Knuth Shuffle" algorithm
 * @param array Will be altered.
 */
DenseArray.shuffle = function shuffle (array) {
	for (var rIndex, tmp, i = array.length - 1; i > 0; i--) {
		rIndex = ~~((i + 1) * Math.random());
		tmp = array[rIndex];
		array[rIndex] = array[i];
		array[i] = tmp;
	}
};

/** slice
 * Similar to native slice function
 * @param {Array} array The array to be manipulated
 * @param {number=0} start If negative, <tt>start = length - start</tt>. <br />If omitted, <tt>start = 0</tt> <br />     (ie, you will get a shallow copy of your array, but faster than <tt>[].slice()</tt> )
 * @param {number=} count If set to a positive integer, then returns elements starting from <tt>array[start]</tt> until <tt>array[start+count-1]</tt><br /> If omitted, <tt>count=array.length</tt>
 * @returns {Array}
 */
DenseArray.slice = function slice (array, start, count) {
	var len = array.length;
	if (start === undefined) {
		start = 0;
	} else if (start > len || (start < 0 && (start += len) < 0)) {
		throw new Error( 'Argument "start" must be between -n and n, where n is array.length' );
	}
	if (count === undefined || count > len - start) {
		count = len - start;
	} else if (count >= 0 === false) {
		throw new Error( 'Argument "count" must be a non-negative integer, or undefined' );
	}
	var returnArr = new Array( count );
	for (var i = 0; i < count; i++) {
		returnArr[i] = array[i + start];
	}
	return returnArr;
};

/**
 * <b>some</b> runs <i>testFn</i> on each element in <i>array</i>, in order, for as long as all returned values !== matchingValue. If there is a match, testing ceases and <i>true</i> is immediately returned. Else, after all values are tested, false is returned.
 *
 * Since V8 speeds up heavily used functions, consider using only function: <b>some</b> or reverse-<b>every</b> {{<tt>!every( array, testFn, false )</tt> }}.
 * @param {Array} array
 * @param {function} testFn (element, index, array)
 * @param {*=true} matchingValue
 * @returns {boolean} Immediate true, if any element's <i>testFn</i> return value === <i>matchingValue</i>. Otherwise, false.
 */
DenseArray.some = function some (array, testFn, matchingValue) {
	matchingValue = matchingValue || true;
	for (var i = 0, len = array.length; i < len; i++) {
		if (testFn( array[i], i, array ) === matchingValue) {return true;}
	}
	return false;
};


/**
 * <b>splice</b> alters the <i>array</i> by deleting old elements (<i>deleteCount</i>) and inserting new elements (<i>insertArray</i>) in their position (<i>startIndex</i>).
 * Unlike the native <b>Array.prototype.splice</b>, this version
 *   - uses a different parameters than <tt>[].splice(startIndex, deleteCount, insertElement1, insertElement2, ...)</tt>
 *   - does not return an array of delete elements
 *   --- If you want the array of deleted values, call <b>slice</b> first, then call this function. The <b>array.prototype.splice</b> function calls <b>array.prototype.slice</b> internally, so although convenient in a few instances, it's just a waste of computation in most instances.
 * @param {Array} array The array to be manipulated
 * @param {Array|undefined} insertArray A single array containing all elements to be inserted into <tt>array</tt>
 * @param {number=} startIndex If negative, <tt>startIndex = length - startIndex</tt>. <br />If omitted, <tt>startIndex = array.length </tt> <br />     (this will make the function behave similar to Array.push(), but faster)
 * @param {number=} deleteCount If set to a positive integer, then removes elements starting from <tt>array[startIndex]</tt> until <tt>array[startIndex+deleteCount-1]</tt><br /> If 0, then remove nothing. <br />If omitted, <tt>deleteCount=array.length</tt>
 * @returns {Array}
 */
DenseArray.splice = function splice (array, insertArray, startIndex, deleteCount) {
	var len = array.length;
	if (startIndex === undefined) {
		startIndex = len;
		deleteCount = 0;
	} else if (startIndex > len || (startIndex < 0 && (startIndex += len) < 0)) {
		throw new Error( 'Argument "startIndex" must be between -n and n, where n is array.length' );
	}
	var add = insertArray.length || 0,
	  sStart = startIndex + add;
	if (deleteCount === undefined || deleteCount > len - startIndex) {
		deleteCount = len - startIndex;
	} else if (deleteCount >= 0 === false) {
		throw new Error( 'Argument "deleteCount" must be a non-negative integer' );
	}
	var i,
	  change = add - deleteCount,
	  newLen = len + change
	  ;
	if (change < 0) {
		for (i = sStart; i < newLen; i++) {
			array[i] = array[i - change];
		}
	} else if (change > 0) {
		for (i = len; i < newLen; i++) {
			array[i] = 0;
		}
		for (i = newLen - 1; i >= sStart; i--) {
			array[i] = array[i - change];
		}
	}
	for (i = 0; i < add; i++) {
		array[i + startIndex] = insertArray[i];
	}
	array.length = newLen;
	return array;
};

/**
 * <b>toString</b> is a convenience function for DenseArray.join( array, ', ', '[', ']' );
 * @param {Array} array
 * @returns {string}
 */
DenseArray.toString = function toString (array) {
	return DenseArray.join( array, ', ', '[', ']' );
};

/**
 * <b>unshift</b> adds only a single <i>element</i> to the front of <i>array</i>
 *
 * To simultaneously unshift more than one element, consider using
 *   <tt>insert(array, [item1,item2,item3,..], 0)</tt>
 * @param {Array} array
 * @param {*} element
 */
DenseArray.unshift = function unshift (array, element) {
	for (var i = array.length; i > 0; i--) {
		array[i] = array[i - 1];
	}
	array[0] = element;
};

/** The InsertionSort algorithm is faster if the array elements are mostly in correct sorting order
 * @param {Array} array
 * @param {function} valueFunc similar to <tt>function valueOf (array, index) {return array[index];}</tt>
 * @returns {Array}
 */
DenseArray.sortInsertion = function insertionSort (array, valueFunc) {
	var i = 1, j, max, pivot, tmp;
	for (max = array.length; i < max; i++) {
		pivot = valueFunc( array, i );
		tmp = array[i];
		for (j = i - 1; j >= 0 && valueFunc( array, j ) > pivot; j--) {
			array[j + 1] = array[j];
		}
		array[j + 1] = tmp;
	}
	return array;
};

/** Uses the quicksort algorithm to achieve the fastest, in-place sorting of a very shuffled array. However, if array is mostly in order, use sortInsertion instead.
 * @param {Array} array
 * @param {function=} valueFunc similar to <tt>function valueOf (array, index) {return array[index];}</tt>
 * @returns {Array}
 */
DenseArray.sort = function quickSort (array, valueFunc) {
	if (typeof valueFunc != 'function') {
		valueFunc = vf;
	}
	for (var startStack = [0], endStack = [array.length], s = 0, pivotIndex, start, end; s >= 0; s--) {
		start = startStack[s];
		end = endStack[s];
		pivotIndex = quickSortPartition( array, start, end, (start + end) >> 1, valueFunc );

		if (pivotIndex - start > 35) {
			startStack[s] = start;
			endStack[s++] = pivotIndex;
		}
		if (end - pivotIndex > 35) {
			startStack[s] = pivotIndex;
			endStack[s++] = end;
		}
	}
	return DenseArray.sortInsertion( array, valueFunc );
};
/** Uses the quicksort algorithm to achieve the fastest, in-place sorting of a shuffled array. If array is mostly in order, use sortInsertion instead.
 * @param {Array} array
 * @param {function=} valueFunc similar to <tt>function valueOf (array, index) {return array[index];}</tt>
 * @returns {Array}
 */
DenseArray.sortQuick = DenseArray.sort;

function quickSortPartition (array, start, end, pivotIndex, valueFunc) {
	var i = start - 1, j = end, swapHolder;
	var pivot = valueFunc( array, pivotIndex );
	for (i++; valueFunc( array, i ) < pivot; i++) {}
	for (j--; valueFunc( array, j ) > pivot; j--) {}
	for (; i < j;) {
		swapHolder = array[i];
		array[i] = array[j];
		array[j] = swapHolder;
		for (i++; valueFunc( array, i ) < pivot; i++) {}
		for (j--; valueFunc( array, j ) > pivot; j--) {}
	}
	return i;
}

/** The InsertionSort algorithm is faster if the array elements are mostly in correct sorting order
 * @param {Array} array
 * @param {function} valueFunc similar to <tt>function valueOf (array, index) {return array[index];}</tt>
 * @param {function} compareFn similar to <tt>function compareValuesAsc(a,b){return a < b;}</tt>
 * @returns {Array}
 */
DenseArray.sortInsertionCompare = function insertionSortCompare (array, valueFunc, compareFn) {
	var i = 1, j, max, pivot, tmp;
	for (max = array.length; i < max; i++) {
		pivot = valueFunc( array, i );
		tmp = array[i];
		for (j = i - 1; j >= 0 && compareFn( pivot, valueFunc( array, j ) ); j--) {
			array[j + 1] = array[j];
		}
		array[j + 1] = tmp;
	}
	return array;
};

/** Uses the quicksort algorithm to achieve the fastest, in-place sorting of a shuffled array. If array is mostly in order, use sortInsertion instead.
 * @param {Array} array
 * @param {function=} valueFunc similar to <tt>function valueOf (array, index) {return array[index];}</tt>
 * @param {function=} compareFn similar to <tt>function compareValuesAsc(a,b){return a < b;}</tt>
 * @returns {Array}
 */
DenseArray.sortQuickCompare = function quickSortCompare (array, valueFunc, compareFn) {
	if (typeof valueFunc != 'function') {
		valueFunc = vf;
	}
	if (typeof compareFn != 'function') {
		compareFn = cf;
	}
	for (var startStack = [0], endStack = [array.length], s = 0, pivotIndex, start, end; s >= 0; s--) {
		start = startStack[s];
		end = endStack[s];
		pivotIndex = quickSortComparePartition( start, end, (start + end) >> 1, array, valueFunc, compareFn );

		if (pivotIndex - start > 34) {
			startStack[s] = start;
			endStack[s++] = pivotIndex;
		}
		if (end - pivotIndex > 34) {
			startStack[s] = pivotIndex;
			endStack[s++] = end;
		}
	}
	return DenseArray.sortInsertionCompare( array, valueFunc, compareFn );
};

/**
 * /**
 * @param {number} start
 * @param {number} end
 * @param {number} pivotIndex
 * @param {Array} array
 * @param {function} valueFunc
 * @param {function} compareFn
 * @returns {number}
 */
function quickSortComparePartition (start, end, pivotIndex, array, valueFunc, compareFn) {
	var i = start - 1, j = end, swapHolder;
	var pivot = valueFunc( array, pivotIndex );
	for (i++; compareFn( valueFunc( array, i ), pivot ); i++) {}
	for (j--; compareFn( pivot, valueFunc( array, j ) ); j--) {}
	for (; i < j;) {
		swapHolder = array[i];
		array[i] = array[j];
		array[j] = swapHolder;
		for (i++; compareFn( valueFunc( array, i ), pivot ); i++) {}
		for (j--; compareFn( pivot, valueFunc( array, j ) ); j--) {}
	}
	return i;
}

/**
 *
 * @param {Array} array
 * @param {number} index
 * @returns {number}
 * @private
 */
function vf (array, index) {return array[index];}
function cf (a, b) {return a < b;}


module.exports = DenseArray;