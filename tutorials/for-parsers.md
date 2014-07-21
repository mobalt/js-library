Tips for generating parsers
===========================

Define the following function which converts the string into charCodes
```js
	function conv(chr){
		return chr.charCodeAt(0);
	}
```

First make sure a character **c** and start value **s** are previously defined in a previous loop or if-then
```js
		c = str.charCodeAt(++i);
		s = i;
```

If trying to capture a string of length >= 1:
```js
		for (; c != conv(']') && i < length; ) {
			c = str.charCodeAt(++i);
		}
		match = str.substring(s, i );
		s = i;
		// use "match" in code
	
```

If capturing single char:
```js
		if (c == conv(']')){
			//run code
			c = str.charCodeAt(++i);	//regenerate next char
		}    
```

For the separator make sure to test if string has ended:
```js
	if (c===conv('&') || i===length) {
		c = str.charCodeAt(++i);
	}
```

Run through [closure compiler](http://closure-compiler.appspot.com/home) on advanced mode
