
Tips for generating parsers
===========================

0. Define the following function which converts the string into charCodes

	```javascript
	function conv(chr){
		return chr.charCodeAt(0);
	}
	```

1. First make sure a character **c** and start value **s** are previously defined in a previous loop or if-then

	```javascript
		c = str.charCodeAt(++i);
		s = i;
	```

2. If trying to capture a string of length >= 1:

	```javascript	
		for (; c != conv(']') && i < length; ) {
			c = str.charCodeAt(++i);
		}
		match = str.substring(s, i );
		s = i;
		// use "match" in code
	
	```

2. If capturing single char:

	```javascript
		if (c == conv(']')){
	
			//run code
			
			c = str.charCodeAt(++i);	//regenerate next char
		}    
	```

3. For the separator make sure to test if string has ended:

	```javascript
	if (c===conv('&') || i===length) {
		c = str.charCodeAt(++i);
	}
	```

4. Run through [closure compiler](http://closure-compiler.appspot.com/home) on advanced mode
