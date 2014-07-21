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


===Example Parser
```js
function parseUrlParams (str) {
        var c = str.charCodeAt(0), s = 0, i = 0, l = str.length, find, obj = {obj : {}};
        for (; !(c===91 || c===61 || c===38) && i < l;) {
            s = i;
            for (; !(c===91 || c===61 || c===38) && i < l; ) {
                c = str.charCodeAt(++i);
            }

            find = str.substring(s, i);
            obj.name = find;
            obj.tmp = obj.obj;
            for (; c===91 && i < l;) {
                c = str.charCodeAt(++i);
                s = i;
                for (; c != 93 && i < l; ) {
                    c = str.charCodeAt(++i);
                }
                find = str.substring(s, i );
                obj.tmp = obj.tmp[obj.name] || (obj.tmp[obj.name] = {});
                obj.name = find;
                if (c===93) {
                    //                    i++;
                    c = str.charCodeAt(++i);
                }
            }
            for (; c===61 && i < l; ) {
                c = str.charCodeAt(++i);
                s = i;
                for (; c != 38 && i < l; ) {
                    c = str.charCodeAt(++i);
                }
                find = str.substring(s, i);
                obj.tmp[obj.name] = find;
            }
            if (c===38 || i===l) {
                c = str.charCodeAt(++i);
                //                i++;
            }
        }
        return obj.obj;
    }
```