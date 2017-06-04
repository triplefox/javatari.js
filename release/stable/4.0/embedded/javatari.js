// Javatari version 4.0
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Main Emulator parameters.
// May be overridden dynamically by URL query parameters, if ALLOW_URL_PARAMETERS = true.

Javatari = {

    PRESETS:                        "",                         // Configuration Presets to apply. See Presets Configuration

    // Full or relative URL of Media files to load
    CARTRIDGE_URL:                  "",
    AUTODETECT_URL:                 "",
    STATE_URL:                      "",

    // Forcing ROM formats
    CARTRIDGE_FORMAT:               "",                         // 4K, F8, F4, FE, AR, etc...

    // General configuration
    AUTO_START:                     true,
    AUTO_POWER_ON_DELAY:            1200,                       // -1: no auto Power-ON; >= 0: wait specified milliseconds before Power-ON
    CARTRIDGE_SHOW_RECENT:          true,
    CARTRIDGE_CHANGE_DISABLED:      false,
    CARTRIDGE_LABEL_COLORS:         "",                         // Space-separated colors for Label, Background, Border. e.g. "#f00 #000 transparent". Leave "" for defaults
    SCREEN_RESIZE_DISABLED:         false,
    SCREEN_CONSOLE_PANEL_DISABLED:  false,
    SCREEN_ELEMENT_ID:              "javatari-screen",
    CONSOLE_PANEL_ELEMENT_ID:       -1,                         // -1: auto. Don't change! :-)
    SCREEN_FULLSCREEN_MODE:         -1,                         // -2: disabled; -1: auto; 0: off; 1: on
    SCREEN_CRT_MODE:                -1,                         // -1: auto; 0: off; 1: on
    SCREEN_FILTER_MODE:             -1,                         // -2: browser default; -1: auto; 0..3: smoothing level
    SCREEN_DEFAULT_SCALE:           -1,                         // -1: auto; 0.5..N in 0.1 steps: scale
    SCREEN_DEFAULT_ASPECT:          1,                          // in 0.1 steps
    SCREEN_CANVAS_SIZE:             2,                          // Internal canvas size factor. Don't change! :-)
    SCREEN_CONTROL_BAR:             1,                          // 0: on hover; 1: always
    SCREEN_FORCE_HOST_NATIVE_FPS:   -1,                         // -1: auto. Don't change! :-)
    SCREEN_VSYNCH_MODE:             1,                          // -1: disabled; 0: off; 1: on
    AUDIO_MONITOR_BUFFER_BASE:      -3,                         // -3: user set value; -2: disable audio; -1: auto; 0: browser default; 1..6: base value. More buffer = more delay
    AUDIO_MONITOR_BUFFER_SIZE:      -1,                         // -1: auto; 256, 512, 1024, 2048, 4096, 8192, 16384: buffer size.     More buffer = more delay. Don't change! :-)
    AUDIO_SIGNAL_BUFFER_RATIO:      2,                          // Internal Audio Signal buffer based on Monitor buffer
    AUDIO_SIGNAL_ADD_FRAMES:        3,                          // Additional frames in internal Audio Signal buffer based on Monitor buffer
    PADDLES_MODE:                   -1,                         // -1: auto; 0: off; 1: on
    TOUCH_MODE:                     -1,                         // -1: auto; 0: disabled; 1: enabled; 2: enabled (swapped)
    IMAGES_PATH:                    window.JAVATARI_IMAGES_PATH || "images/",

    RESET:                          0,                          // if value = 1 clear all saved data on the client
    ALLOW_URL_PARAMETERS:           true                        // Allows user to override any of these parameters via URL query parameters

};

Javatari.PRESETS_CONFIG = { };                                  // No built-in Presets for now

jt = window.jt || {};                                           // Namespace for all classes and objects

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

JavatariFullScreenSetup = {
    apply: function fullScreenSetup() {
        // Setup Basic full-screen CSS
        if (!this.cssApplied) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = this.css;
            document.head.appendChild(style);
            this.cssApplied = true;
        }
        // Apply Standalone mode full-screen basic styles to html and body immediately if needed
        document.documentElement.classList.toggle("jt-full-screen", this.shouldStartInFullScreen());
    },
    shouldStartInFullScreen: function () {
        return window.Javatari
            ? Javatari.SCREEN_FULLSCREEN_MODE === 1 || (Javatari.SCREEN_FULLSCREEN_MODE === -1 && this.isBrowserStandaloneMode())
            : this.isBrowserStandaloneMode();
    },
    isBrowserStandaloneMode: function () {
        return navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
    },
    css: '' +
        'html.jt-full-screen, html.jt-full-screen body {' +
        '   background: black;' +
        '}' +
        'html.jt-full-screen .jt-full-screen-hidden {' +
        '   display: none;' +
        '}' +
        'html:not(.jt-full-screen) .jt-full-screen-only {' +
        '   display: none;' +
        '}'
};
JavatariFullScreenSetup.apply();

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Util = new function() {
"use strict";

    this.log = function(str) {
        console.log(">> jt: " + str);
    };
    this.warning = function(str) {
        console.warn(">> jt Warning: " + str);
    };
    this.error = function(str) {
        console.error(">> jt Error: " + str);
    };

    this.message = function(str) {
        console.info(str);
        alert(str);
    };

    this.asNormalArray = function(arr) {
        if (arr instanceof Array) return arr;
        return this.arrayCopy(arr, 0, new Array(arr.length));
    };

    this.arrayFill = function(arr, val, from, to) {
        if (arr.fill) return arr.fill(val, from, to);       // polyfill for TypedArrays or Arrays with native fill
        if (from === undefined) from = 0;
        for (var i = (to === undefined ? arr.length : to) - 1; i >= from; i = i - 1)
            arr[i] = val;
        return arr;
    };

    this.arrayFillSegment = function(arr, from, to, val) {
        //noinspection UnnecessaryLocalVariableJS
        var i = to;
        while(i-- > from)
            arr[i] = val;
        return arr;
    };

    this.arrayCopy = function(src, srcPos, dest, destPos, length) {
        destPos = destPos || 0;
        var finalSrcPos = length ? srcPos + length : src.length;
        while(srcPos < finalSrcPos)
            dest[destPos++] = src[srcPos++];
        return dest;
    };

    this.arrayAdd = function(arr, element) {
        arr[arr.length] = element;
        return arr;
    };

    this.arrayRemoveAllElement = function(arr, element) {
        var i;
        while ((i = arr.indexOf(element)) >= 0) {
            arr.splice(i, 1);
        }
        return arr;
    };

    this.arraysConcatAll = function(arrs) {
        var len = 0;
        for (var i = 0; i < arrs.length; ++i) len += arrs[i].length;
        var res = new (arrs[0].constructor)(len);   // Same type as the first array
        var pos = 0;
        for (i = 0; i < arrs.length; ++i) {
            this.arrayCopy(arrs[i], 0, res, pos);
            pos += arrs[i].length;
        }
        return res;
    };

    this.arrayRemove = function(arr, element) {
        var i = arr.indexOf(element);
        if (i < 0) return;
        arr.splice(i, 1);
    };

    this.arraysEqual = function(a, b) {
        var i = a.length;
        if (i !== b.length) return false;
        while (i--)
            if (a[i] !== b[i]) return false;
        return true;
    };


    // Only 8 bit values

    this.reverseInt8 = function(val) {
        return ((val & 0x01) << 7) | ((val & 0x02) << 5) | ((val & 0x04) << 3) | ((val & 0x08) << 1) | ((val & 0x10) >> 1) | ((val & 0x20) >> 3) | ((val & 0x40) >> 5) | ((val & 0x80) >> 7);
    };

    this.int8BitArrayToByteString = function(ints, start, length) {
        if (ints === null || ints == undefined) return ints;
        if (start === undefined) start = 0;
        if (length === undefined) length = ints.length - start;
        var str = "";
        for(var i = start, finish = start + length; i < finish; i = i + 1)
            str += String.fromCharCode(ints[i] & 0xff);
        return str;
    };

    this.byteStringToInt8BitArray = function(str, dest) {
        if (str === null || str === undefined) return str;
        if (str == "null") return null; if (str == "undefined") return undefined;
        var len = str.length;
        var ints = (dest && dest.length === len) ? dest : new (dest ? dest.constructor : Array)(len);      // Preserve dest type
        for(var i = 0; i < len; i = i + 1)
            ints[i] = (str.charCodeAt(i) & 0xff);
        return ints;
    };

    // Only 32 bit values
    this.int32BitArrayToByteString = function(ints, start, length) {
        if (ints === null || ints == undefined) return ints;
        if (start === undefined) start = 0;
        if (length === undefined) length = ints.length - start;
        var str = "";
        for(var i = start, finish = start + length; i < finish; i = i + 1)
            str += String.fromCharCode(ints[i] & 0xff) + String.fromCharCode((ints[i] >> 8) & 0xff) + String.fromCharCode((ints[i] >> 16) & 0xff) + String.fromCharCode((ints[i] >> 24) & 0xff);
        return str;
    };

    this.byteStringToInt32BitArray = function(str, dest) {
        if (str === null || str === undefined) return str;
        if (str == "null") return null; if (str == "undefined") return undefined;
        var len = (str.length / 4) | 0;
        var ints = (dest && dest.length === len) ? dest : new (dest ? dest.constructor : Array)(len);      // Preserve dest type
        for(var i = 0, s = 0; i < len; i = i + 1, s = s + 4)
            ints[i] = (str.charCodeAt(s) & 0xff) | ((str.charCodeAt(s + 1) & 0xff) << 8) | ((str.charCodeAt(s + 2) & 0xff) << 16) | ((str.charCodeAt(s + 3) & 0xff) << 24);
        return ints;
    };

    this.storeInt8BitArrayToStringBase64 = function(arr) {
        if (arr === null || arr === undefined) return arr;
        if (arr.length === 0) return "";
        return btoa(this.int8BitArrayToByteString(arr));
    };

    this.restoreStringBase64ToInt8BitArray = function(str, dest) {
        if (str === null || str === undefined) return str;
        if (str == "null") return null; if (str == "undefined") return undefined;
        if (str == "") return [];
        return this.byteStringToInt8BitArray(atob(str), dest);
    };

    this.compressInt8BitArrayToStringBase64 = function(arr, length) {
        if (arr === null || arr === undefined) return arr;
        if (arr.length === 0) return "";
        if (length < arr.length)
            return this.storeInt8BitArrayToStringBase64(JSZip.compressions.DEFLATE.compress(arr.slice(0, length)));
        else
            return this.storeInt8BitArrayToStringBase64(JSZip.compressions.DEFLATE.compress(arr));
    };

    this.uncompressStringBase64ToInt8BitArray = function(str, dest, diffSize) {
        if (str === null || str === undefined) return str;
        if (str == "null") return null; if (str == "undefined") return undefined;
        if (str == "") return [];
        var res = JSZip.compressions.DEFLATE.uncompress(atob(str));
        if (dest && (diffSize || dest.length === res.length))
            return this.arrayCopy(res, 0, dest);                                                        // Preserve dest
        else
            return this.arrayCopy(res, 0, new (dest ? dest.constructor : Array)(res.length));      // Preserve dest type
    };

    this.storeInt32BitArrayToStringBase64 = function(arr) {
        if (arr === null || arr === undefined) return arr;
        if (arr.length === 0) return "";
        return btoa(this.int32BitArrayToByteString(arr));
    };

    this.restoreStringBase64ToInt32BitArray = function(str, dest) {
        if (str === null || str === undefined) return str;
        if (str == "null") return null; if (str == "undefined") return undefined;
        if (str == "") return [];
        return this.byteStringToInt32BitArray(atob(str), dest);
    };

    this.compressStringToStringBase64 = function(str) {
        if (str === null || str === undefined) return str;
        if (str.length === 0) return str;
        return this.storeInt8BitArrayToStringBase64(JSZip.compressions.DEFLATE.compress(str));
    };

    this.uncompressStringBase64ToString = function(str) {
        if (str === null || str === undefined) return str;
        if (str == "null") return null; if (str == "undefined") return undefined;
        if (str == "") return str;
        return this.int8BitArrayToByteString(JSZip.compressions.DEFLATE.uncompress(atob(str)));
    };

    this.toHex2 = function(num) {
        if (num === null || num === undefined) return num;
        var res = num.toString(16).toUpperCase();
        if (num >= 0 && (res.length % 2)) return "0" + res;
        else return res;
    };

    this.toHex4 = function(num) {
        if (num === null || num === undefined) return num;
        var res = num.toString(16).toUpperCase();
        if (num < 0) return res;
        switch (res.length) {
            case 4:
                return res;
            case 3:
                return "0" + res;
            case 2:
                return "00" + res;
            case 1:
                return "000" + res;
            default:
                return res;
        }
    };

    this.escapeHtml = function(html) {
        return html
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\//g,"&#047;")
            .replace(/\?/g,"&#063;")
            .replace(/\-/g, "&#045;")
            .replace(/\|/g, "&#0124;");
    };

    this.arrayFind = function(arr, pred) {
        if (arr.find) return arr.find(pred);
        for (var i = 0, len = arr.length; i < len; ++i)
            if (pred(arr[i], i, arr)) return arr[i];
    };

    this.arrayFindIndex = function(arr, pred) {
        if (arr.findIndex) return arr.findIndex(pred);
        for (var i = 0, len = arr.length; i < len; ++i)
            if (pred(arr[i], i, arr)) return i;
        return -1;
    };

    this.arrayIndexOfSubArray = function(arr, subarr, fromIndex, step) {
        var subLen = subarr.length;
        var len = arr.length;
        var st = step || 1;

        Loop: for (var i = fromIndex; (i >= 0) && (i < len); i += st) {
            for (var j = 0; j < subLen; j = j + 1)
                if (arr[i + j] !== subarr[j])
                    continue Loop;
            return i;
        }
        return -1;
    };

    this.stringCountOccurrences = function(str, char) {
        var total = 0;
        for (var i = 0, len = str.length; i < len; ++i)
            if (str[i] == char) ++total;
        return total;
    };

    this.stringStartsWith = function(str, start) {
        if (str.startsWith) return str.startsWith(start);
        else return str.substr(0, start.length) === start;
    };

    this.stringEndsWith = function(str, end) {
        if (str.endsWith) return str.endsWith(end);
        else return str.substr(str.length - end.length) === end;
    };

    this.checkContentIsZIP = function(content) {
        if (content && content[0] === 0x50 && content[1] === 0x4b)      // PK signature
            try {
                return new JSZip(content);
            } catch(ez) {
                // Error decompressing files. Abort
            }
        return null;
    };

    this.getZIPFilesSorted = function(zip) {
        var files = zip.file(/.+/);
        files.sort(sortByName);
        return files;
    };

    this.checkContentIsGZIP = function(content) {
        if (!content || content[0] !== 0x1f || content[1] !== 0x8b || content[2] !== 0x08) return null;      // GZ Deflate signature

        try {
            var flags = content[3];
            var fHCRC =    flags & 0x02;
            var fEXTRA =   flags & 0x04;
            var fNAME =    flags & 0x08;
            var fCOMMENT = flags & 0x10;

            // Skip MTIME, XFL and OS fields, no use...
            var pos = 10;

            // Skip bytes of optional content
            if (fEXTRA) {
                var xLEN = content[pos++] | (content[pos++] << 8);
                pos += xLEN;
            }
            if (fNAME) while (content[pos++] !== 0);
            if (fCOMMENT) while (content[pos++] !== 0);
            if (fHCRC) pos += 2;

            return JSZip.compressions.DEFLATE.uncompress(content.slice(pos, content.length - 8));
        } catch (ez) {
            return null;      // Error decompressing file. Abort
        }
    };

    this.leafFilename = function(fileName) {
        return (((fileName && fileName.indexOf("/") >= 0) ? fileName.split("/").pop() : fileName) || "").trim();
    };

    this.leafFilenameNoExtension = function(fileName) {
        var name = this.leafFilename(fileName);
        var period = name.lastIndexOf(".");
        return period <= 0 ? name : name.substr(0, period).trim();
    };

    this.leafFilenameOnlyExtension = function(fileName) {
        var name = this.leafFilename(fileName);
        var period = name.lastIndexOf(".");
        return period <= 0 ? "" : name.substr(period + 1).trim();
    };

    function sortByName(a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }

    this.dump = function(arr, from, chunk, quant) {
        var res = "";
        var p = from || 0;
        quant = quant || 1;
        for(var i = 0; i < quant; i++) {
            for(var c = 0; c < chunk; c++) {
                var val = arr[p++];
                res = res + (val != undefined ? val.toString(16, 2) + " " : "? ");
            }
            res = res + "   ";
        }

        console.log(res);
    };

    this.browserInfo = function() {
        if (this.browserInfoAvailable) return this.browserInfoAvailable;

        var ua = navigator.userAgent;
        var temp;
        var m = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(m[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return this.browserInfoAvailable = { name:'IE', version: (temp[1] || '') };
        }
        if (m[1] === 'Chrome') {
            temp = ua.match(/\bOPR\/(\d+)/);
            if (temp != null) return this.browserInfoAvailable = { name:'OPERA', version: temp[1] };
        }
        m = m[2] ? [m[1], m[2]] : [ navigator.appName, navigator.appVersion, '-?' ];
        if ((temp = ua.match(/version\/(\d+)/i)) != null) m.splice(1, 1, temp[1]);
        var name = m[0].toUpperCase();
        return this.browserInfoAvailable = {
            name: this.isIOSDevice() || name === "NETSCAPE" ? "SAFARI" : name,
            version: m[1]
        };
    };

    this.userLanguage = function() {
        return ((navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || "en-US").trim();
    };

    this.isOfficialHomepage = function () {
        var loc = window.location;
        return loc
            && (loc.hostname.toLowerCase() === "javatari.org")
            && (loc.port === "" || loc.port === "80");
    };

    this.isTouchDevice = function() {
        return ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    };

    this.isMobileDevice = function() {
        return this.isTouchDevice() && (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i).test(navigator.userAgent);
    };

    this.isIOSDevice = function() {
        return (/ipad|iphone|ipod/i).test(navigator.userAgent);
    };

    this.isBrowserStandaloneMode = function() {
        return navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
    };

    this.onTapOrMouseDown = function(element, handler) {
        this.addEventsListener(element, this.isTouchDevice() ? "touchstart mousedown" : "mousedown", handler);
    };

    this.onTapOrMouseDownWithBlock = function(element, handler) {
        function onTapOrMouseDown(e) {
            handler(e);
            return blockEvent(e);
        }
        this.addEventsListener(element, this.isTouchDevice() ? "touchstart mousedown" : "mousedown", onTapOrMouseDown);
    };

    this.onTapOrMouseUpWithBlock = function(element, handler) {
        function onTapOrMouseUp(e) {
            handler(e);
            return blockEvent(e);
        }
        this.addEventsListener(element, this.isTouchDevice() ? "touchstart mouseup" : "mouseup", onTapOrMouseUp);
    };

    this.onTapOrMouseDownWithBlockUIG = function(element, handler) {
        function onTapOrMouseDownUIG(e) {
            // If not User Initiated Gesture needed on the event TARGET handle only on touchstart,
            // otherwise handle only touchend or mousedown if no touch events fired
            if (e.type === "touchstart" && e.target.jtNeedsUIG) return;
            if (e.type === "touchend" && !e.target.jtNeedsUIG) return;
            // Fire original event and block
            handler(e);
            return blockEvent(e);
        }
        this.addEventsListener(element, this.isTouchDevice() ? "touchstart touchend mousedown" : "mousedown", onTapOrMouseDownUIG);
    };

    function blockEvent(e) {
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();
        return false;
    }
    this.blockEvent = blockEvent;

    this.addEventsListener = function(element, events, handler, capture) {
        events = events.split(" ");
        for (var i = 0; i < events.length; ++i)
            if (events[i]) element.addEventListener(events[i], handler, capture);
    };

    this.removeEventsListener = function(element, events, handler, capture) {
        events = events.split(" ");
        for (var i = 0; i < events.length; ++i)
            if (events[i]) element.removeEventListener(events[i], handler, capture);
    };

    this.insertCSS = function(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    this.log2 = function(x) {
        return Math.log(x) / Math.log(2);
    };

    this.exp2 = function(x) {
        return Math.pow(2, x);
    };

    this.performanceNow = function() {
        return this.performanceNow.startOffset ? Date.now() - this.performanceNow.startOffset : window.performance.now();
    };

};

if (!window.performance || !window.performance.now) jt.Util.performanceNow.startOffset = Date.now();
jt.MD5 = function(data) {
"use strict";

    // convert number to (unsigned) 32 bit hex, zero filled string
    function to_zerofilled_hex(n) {     
        var t1 = (n >>> 0).toString(16)
        return "00000000".substr(0, 8 - t1.length) + t1
    }

    // convert array of chars to array of bytes 
    function chars_to_bytes(ac) {
        var retval = []
        for (var i = 0; i < ac.length; i++) {
            retval = retval.concat(str_to_bytes(ac[i]))
        }
        return retval
    }


    // convert a 64 bit unsigned number to array of bytes. Little endian
    function int64_to_bytes(num) {
        var retval = []
        for (var i = 0; i < 8; i++) {
            retval.push(num & 0xFF)
            num = num >>> 8
        }
        return retval
    }

    //  32 bit left-rotation
    function rol(num, places) {
        return ((num << places) & 0xFFFFFFFF) | (num >>> (32 - places))
    }

    // The 4 MD5 functions
    function fF(b, c, d) {
        return (b & c) | (~b & d)
    }

    function fG(b, c, d) {
        return (d & b) | (~d & c)
    }

    function fH(b, c, d) {
        return b ^ c ^ d
    }

    function fI(b, c, d) {
        return c ^ (b | ~d)
    }

    // pick 4 bytes at specified offset. Little-endian is assumed
    function bytes_to_int32(arr, off) {
        return (arr[off + 3] << 24) | (arr[off + 2] << 16) | (arr[off + 1] << 8) | (arr[off])
    }

    /*
    Conver string to array of bytes in UTF-8 encoding
    See: 
    http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases/
    http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
    How about a String.getBytes(<ENCODING>) for Javascript!? Isn't it time to add it?
    */
    function str_to_bytes(str) {
        var retval = [ ]
        for (var i = 0; i < str.length; i++)
            if (str.charCodeAt(i) <= 0x7F) {
                retval.push(str.charCodeAt(i))
            } else {
                var tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%')
                for (var j = 0; j < tmp.length; j++) {
                    retval.push(parseInt(tmp[j], 0x10))
                }
            }
        return retval
    }


    // convert the 4 32-bit buffers to a 128 bit hex string. (Little-endian is assumed)
    function int128le_to_hex(a, b, c, d) {
        var ra = ""
        var t = 0
        var ta = 0
        for (var i = 3; i >= 0; i--) {
            ta = arguments[i]
            t = (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | ta
            ra = ra + to_zerofilled_hex(t)
        }
        return ra
    }

    // conversion from typed byte array to plain javascript array 
    function typed_to_plain(tarr) {
        var retval = new Array(tarr.length)
        for (var i = 0; i < tarr.length; i++) {
            retval[i] = tarr[i]
        }
        return retval
    }

    // check input data type and perform conversions if needed
    var databytes = null
    // String
    var type_mismatch = null
    if (typeof data == 'string') {
        // convert string to array bytes
        databytes = str_to_bytes(data)
    } else if (data.constructor == Array) {
        if (data.length === 0) {
            // if it's empty, just assume array of bytes
            databytes = data
        } else if (typeof data[0] == 'string') {
            databytes = chars_to_bytes(data)
        } else if (typeof data[0] == 'number') {
            databytes = data
        } else {
            type_mismatch = typeof data[0]
        }
    } else if (typeof ArrayBuffer != 'undefined') {
        if (data instanceof ArrayBuffer) {
            databytes = typed_to_plain(new Uint8Array(data))
        } else if ((data instanceof Uint8Array) || (data instanceof Int8Array)) {
            databytes = typed_to_plain(data)
        } else if ((data instanceof Uint32Array) || (data instanceof Int32Array) || 
               (data instanceof Uint16Array) || (data instanceof Int16Array) || 
               (data instanceof Float32Array) || (data instanceof Float64Array)
         ) {
            databytes = typed_to_plain(new Uint8Array(data.buffer))
        } else {
            type_mismatch = typeof data
        }   
    } else {
        type_mismatch = typeof data
    }

    if (type_mismatch) {
        alert('MD5 type mismatch, cannot process ' + type_mismatch)
    }

    function _add(n1, n2) {
        return 0x0FFFFFFFF & (n1 + n2)
    }


    return do_digest()

    function do_digest() {

        // function update partial state for each run
        function updateRun(nf, sin32, dw32, b32) {
            var temp = d
            d = c
            c = b
            //b = b + rol(a + (nf + (sin32 + dw32)), b32)
            b = _add(b, 
                rol( 
                    _add(a, 
                        _add(nf, _add(sin32, dw32))
                    ), b32
                )
            )
            a = temp
        }

        // save original length
        var org_len = databytes.length

        // first append the "1" + 7x "0"
        databytes.push(0x80)

        // determine required amount of padding
        var tail = databytes.length % 64
        // no room for msg length?
        if (tail > 56) {
            // pad to next 512 bit block
            for (var i = 0; i < (64 - tail); i++) {
                databytes.push(0x0)
            }
            tail = databytes.length % 64
        }
        for (i = 0; i < (56 - tail); i++) {
            databytes.push(0x0)
        }
        // message length in bits mod 512 should now be 448
        // append 64 bit, little-endian original msg length (in *bits*!)
        databytes = databytes.concat(int64_to_bytes(org_len * 8))

        // initialize 4x32 bit state
        var h0 = 0x67452301
        var h1 = 0xEFCDAB89
        var h2 = 0x98BADCFE
        var h3 = 0x10325476

        // temp buffers
        var a = 0, b = 0, c = 0, d = 0

        // Digest message
        for (i = 0; i < databytes.length / 64; i++) {
            // initialize run
            a = h0
            b = h1
            c = h2
            d = h3

            var ptr = i * 64

            // do 64 runs
            updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(databytes, ptr), 7)
            updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(databytes, ptr + 4), 12)
            updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(databytes, ptr + 8), 17)
            updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(databytes, ptr + 12), 22)
            updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(databytes, ptr + 16), 7)
            updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(databytes, ptr + 20), 12)
            updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(databytes, ptr + 24), 17)
            updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(databytes, ptr + 28), 22)
            updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(databytes, ptr + 32), 7)
            updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(databytes, ptr + 36), 12)
            updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(databytes, ptr + 40), 17)
            updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(databytes, ptr + 44), 22)
            updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(databytes, ptr + 48), 7)
            updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(databytes, ptr + 52), 12)
            updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(databytes, ptr + 56), 17)
            updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(databytes, ptr + 60), 22)
            updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(databytes, ptr + 4), 5)
            updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(databytes, ptr + 24), 9)
            updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(databytes, ptr + 44), 14)
            updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(databytes, ptr), 20)
            updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(databytes, ptr + 20), 5)
            updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(databytes, ptr + 40), 9)
            updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(databytes, ptr + 60), 14)
            updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(databytes, ptr + 16), 20)
            updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(databytes, ptr + 36), 5)
            updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(databytes, ptr + 56), 9)
            updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(databytes, ptr + 12), 14)
            updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(databytes, ptr + 32), 20)
            updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(databytes, ptr + 52), 5)
            updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(databytes, ptr + 8), 9)
            updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(databytes, ptr + 28), 14)
            updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(databytes, ptr + 48), 20)
            updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(databytes, ptr + 20), 4)
            updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(databytes, ptr + 32), 11)
            updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(databytes, ptr + 44), 16)
            updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(databytes, ptr + 56), 23)
            updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(databytes, ptr + 4), 4)
            updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(databytes, ptr + 16), 11)
            updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(databytes, ptr + 28), 16)
            updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(databytes, ptr + 40), 23)
            updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(databytes, ptr + 52), 4)
            updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(databytes, ptr), 11)
            updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(databytes, ptr + 12), 16)
            updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(databytes, ptr + 24), 23)
            updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(databytes, ptr + 36), 4)
            updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(databytes, ptr + 48), 11)
            updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(databytes, ptr + 60), 16)
            updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(databytes, ptr + 8), 23)
            updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(databytes, ptr), 6)
            updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(databytes, ptr + 28), 10)
            updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(databytes, ptr + 56), 15)
            updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(databytes, ptr + 20), 21)
            updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(databytes, ptr + 48), 6)
            updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(databytes, ptr + 12), 10)
            updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(databytes, ptr + 40), 15)
            updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(databytes, ptr + 4), 21)
            updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(databytes, ptr + 32), 6)
            updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(databytes, ptr + 60), 10)
            updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(databytes, ptr + 24), 15)
            updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(databytes, ptr + 52), 21)
            updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(databytes, ptr + 16), 6)
            updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(databytes, ptr + 44), 10)
            updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(databytes, ptr + 8), 15)
            updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(databytes, ptr + 36), 21)

            // update buffers
            h0 = _add(h0, a)
            h1 = _add(h1, b)
            h2 = _add(h2, c)
            h3 = _add(h3, d)
        }
        // Done! Convert buffers to 128 bit (LE)
        return int128le_to_hex(h3, h2, h1, h0).toUpperCase()
    }
    
};


/*!
JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.JSZip=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":8}],4:[function(a,b){"use strict";var c=a("./utils"),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];b.exports=function(a,b){if("undefined"==typeof a||!a.length)return 0;var e="string"!==c.getTypeOf(a);"undefined"==typeof b&&(b=0);var f=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=e?a[i]:a.charCodeAt(i),g=255&(b^h),f=d[g],b=b>>>8^f;return-1^b}},{"./utils":21}],5:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":21}],6:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.createFolders=!1,c.date=null,c.compression=null,c.comment=null},{}],7:[function(a,b,c){"use strict";var d=a("./utils");c.string2binary=function(a){return d.string2binary(a)},c.string2Uint8Array=function(a){return d.transformTo("uint8array",a)},c.uint8Array2String=function(a){return d.transformTo("string",a)},c.string2Blob=function(a){var b=d.transformTo("arraybuffer",a);return d.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){return d.arrayBuffer2Blob(a)},c.transformTo=function(a,b){return d.transformTo(a,b)},c.getTypeOf=function(a){return d.getTypeOf(a)},c.checkSupport=function(a){return d.checkSupport(a)},c.MAX_VALUE_16BITS=d.MAX_VALUE_16BITS,c.MAX_VALUE_32BITS=d.MAX_VALUE_32BITS,c.pretty=function(a){return d.pretty(a)},c.findCompression=function(a){return d.findCompression(a)},c.isRegExp=function(a){return d.isRegExp(a)}},{"./utils":21}],8:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("pako");c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a){return e.deflateRaw(a)},c.uncompress=function(a){return e.inflateRaw(a)}},{pako:24}],9:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.comment=null,this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}var d=a("./base64");c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./deprecatedPublicUtils"),c.base64={encode:function(a){return d.encode(a)},decode:function(a){return d.decode(a)}},c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":6,"./deprecatedPublicUtils":7,"./load":10,"./object":13,"./support":17}],10:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir,comment:h.fileComment.length?h.fileComment:null,createFolders:b.createFolders});return f.zipComment.length&&(this.comment=f.zipComment),this}},{"./base64":1,"./zipEntries":22}],11:[function(a,b){(function(a){"use strict";b.exports=function(b,c){return new a(b,c)},b.exports.test=function(b){return a.isBuffer(b)}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],12:[function(a,b){"use strict";function c(a){this.data=a,this.length=this.data.length,this.index=0}var d=a("./uint8ArrayReader");c.prototype=new d,c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./uint8ArrayReader":18}],13:[function(a,b){"use strict";var c=a("./support"),d=a("./utils"),e=a("./crc32"),f=a("./signature"),g=a("./defaults"),h=a("./base64"),i=a("./compressions"),j=a("./compressedObject"),k=a("./nodeBuffer"),l=a("./utf8"),m=a("./stringWriter"),n=a("./uint8ArrayWriter"),o=function(a){if(a._data instanceof j&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===d.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},p=function(a){var b=o(a),e=d.getTypeOf(b);return"string"===e?!a.options.binary&&c.nodebuffer?k(b,"utf-8"):a.asBinary():b},q=function(a){var b=o(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=h.decode(b)),b=a&&this.options.binary?A.utf8decode(b):d.transformTo("string",b),a||this.options.binary||(b=d.transformTo("string",A.utf8encode(b))),b)},r=function(a,b,c){this.name=a,this.dir=c.dir,this.date=c.date,this.comment=c.comment,this._data=b,this.options=c,this._initialMetadata={dir:c.dir,date:c.date}};r.prototype={asText:function(){return q.call(this,!0)},asBinary:function(){return q.call(this,!1)},asNodeBuffer:function(){var a=p(this);return d.transformTo("nodebuffer",a)},asUint8Array:function(){var a=p(this);return d.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var s=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},t=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},u=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=t(a,g),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},v=function(a,b,c){var e,f=d.getTypeOf(b);if(c=u(c),c.createFolders&&(e=w(a))&&x.call(this,e,!0),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null;else if("string"===f)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=d.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(f||b instanceof j))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===f&&(b=d.transformTo("uint8array",b))}var g=new r(a,b,c);return this.files[a]=g,g},w=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},x=function(a,b){return"/"!=a.slice(-1)&&(a+="/"),b="undefined"!=typeof b?b:!1,this.files[a]||v.call(this,a,null,{dir:!0,createFolders:b}),this.files[a]},y=function(a,b){var c,f=new j;return a._data instanceof j?(f.uncompressedSize=a._data.uncompressedSize,f.crc32=a._data.crc32,0===f.uncompressedSize||a.dir?(b=i.STORE,f.compressedContent="",f.crc32=0):a._data.compressionMethod===b.magic?f.compressedContent=a._data.getCompressedContent():(c=a._data.getContent(),f.compressedContent=b.compress(d.transformTo(b.compressInputType,c)))):(c=p(a),(!c||0===c.length||a.dir)&&(b=i.STORE,c=""),f.uncompressedSize=c.length,f.crc32=e(c),f.compressedContent=b.compress(d.transformTo(b.compressInputType,c))),f.compressedSize=f.compressedContent.length,f.compressionMethod=b.magic,f},z=function(a,b,c,g){var h,i,j,k,m=(c.compressedContent,d.transformTo("string",l.utf8encode(b.name))),n=b.comment||"",o=d.transformTo("string",l.utf8encode(n)),p=m.length!==b.name.length,q=o.length!==n.length,r=b.options,t="",u="",v="";j=b._initialMetadata.dir!==b.dir?b.dir:r.dir,k=b._initialMetadata.date!==b.date?b.date:r.date,h=k.getHours(),h<<=6,h|=k.getMinutes(),h<<=5,h|=k.getSeconds()/2,i=k.getFullYear()-1980,i<<=4,i|=k.getMonth()+1,i<<=5,i|=k.getDate(),p&&(u=s(1,1)+s(e(m),4)+m,t+="up"+s(u.length,2)+u),q&&(v=s(1,1)+s(this.crc32(o),4)+o,t+="uc"+s(v.length,2)+v);var w="";w+="\n\x00",w+=p||q?"\x00\b":"\x00\x00",w+=c.compressionMethod,w+=s(h,2),w+=s(i,2),w+=s(c.crc32,4),w+=s(c.compressedSize,4),w+=s(c.uncompressedSize,4),w+=s(m.length,2),w+=s(t.length,2);var x=f.LOCAL_FILE_HEADER+w+m+t,y=f.CENTRAL_FILE_HEADER+"\x00"+w+s(o.length,2)+"\x00\x00\x00\x00"+(j===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+s(g,4)+m+t+o;return{fileRecord:x,dirRecord:y,compressedObject:c}},A={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new r(d.name,d._data,t(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(d.isRegExp(a)){var e=a;return this.filter(function(a,b){return!b.dir&&e.test(a)})}return this.filter(function(b,c){return!c.dir&&b===a})[0]||null}return a=this.root+a,v.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(d.isRegExp(a))return this.filter(function(b,c){return c.dir&&a.test(b)});var b=this.root+a,c=x.call(this,b),e=this.clone();return e.root=c.name,e},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b&&!b.dir)delete this.files[a];else for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];return this},generate:function(a){a=t(a||{},{base64:!0,compression:"STORE",type:"base64",comment:null}),d.checkSupport(a.type);var b,c,e=[],g=0,j=0,k=d.transformTo("string",this.utf8encode(a.comment||this.comment||""));for(var l in this.files)if(this.files.hasOwnProperty(l)){var o=this.files[l],p=o.options.compression||a.compression.toUpperCase(),q=i[p];if(!q)throw new Error(p+" is not a valid compression method !");var r=y.call(this,o,q),u=z.call(this,l,o,r,g);g+=u.fileRecord.length+r.compressedSize,j+=u.dirRecord.length,e.push(u)}var v="";v=f.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+s(e.length,2)+s(e.length,2)+s(j,4)+s(g,4)+s(k.length,2)+k;var w=a.type.toLowerCase();for(b="uint8array"===w||"arraybuffer"===w||"blob"===w||"nodebuffer"===w?new n(g+j+v.length):new m(g+j+v.length),c=0;c<e.length;c++)b.append(e[c].fileRecord),b.append(e[c].compressedObject.compressedContent);for(c=0;c<e.length;c++)b.append(e[c].dirRecord);b.append(v);var x=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return d.transformTo(a.type.toLowerCase(),x);case"blob":return d.arrayBuffer2Blob(d.transformTo("arraybuffer",x));case"base64":return a.base64?h.encode(x):x;default:return x}},crc32:function(a,b){return e(a,b)},utf8encode:function(a){return d.transformTo("string",l.utf8encode(a))},utf8decode:function(a){return l.utf8decode(a)}};b.exports=A},{"./base64":1,"./compressedObject":2,"./compressions":3,"./crc32":4,"./defaults":6,"./nodeBuffer":11,"./signature":14,"./stringWriter":16,"./support":17,"./uint8ArrayWriter":19,"./utf8":20,"./utils":21}],14:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],15:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5,"./utils":21}],16:[function(a,b){"use strict";var c=a("./utils"),d=function(){this.data=[]};d.prototype={append:function(a){a=c.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}},b.exports=d},{"./utils":21}],17:[function(a,b,c){(function(a){"use strict";if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer="undefined"!=typeof a,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var b=new ArrayBuffer(0);try{c.blob=0===new Blob([b],{type:"application/zip"}).size}catch(d){try{var e=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,f=new e;f.append(b),c.blob=0===f.getBlob("application/zip").size}catch(d){c.blob=!1}}}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],18:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){if(this.checkOffset(a),0===a)return new Uint8Array(0);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5}],19:[function(a,b){"use strict";var c=a("./utils"),d=function(a){this.data=new Uint8Array(a),this.index=0};d.prototype={append:function(a){0!==a.length&&(a=c.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}},b.exports=d},{"./utils":21}],20:[function(a,b,c){"use strict";for(var d=a("./utils"),e=a("./support"),f=a("./nodeBuffer"),g=new Array(256),h=0;256>h;h++)g[h]=h>=252?6:h>=248?5:h>=240?4:h>=224?3:h>=192?2:1;g[254]=g[254]=1;var i=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=e.uint8array?new Uint8Array(i):new Array(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},j=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+g[a[c]]>b?c:b},k=function(a){var b,c,e,f,h=a.length,i=new Array(2*h);for(c=0,b=0;h>b;)if(e=a[b++],128>e)i[c++]=e;else if(f=g[e],f>4)i[c++]=65533,b+=f-1;else{for(e&=2===f?31:3===f?15:7;f>1&&h>b;)e=e<<6|63&a[b++],f--;f>1?i[c++]=65533:65536>e?i[c++]=e:(e-=65536,i[c++]=55296|e>>10&1023,i[c++]=56320|1023&e)}return i.length!==c&&(i.subarray?i=i.subarray(0,c):i.length=c),d.applyFromCharCode(i)};c.utf8encode=function(a){return e.nodebuffer?f(a,"utf-8"):i(a)},c.utf8decode=function(a){if(e.nodebuffer)return d.transformTo("nodebuffer",a).toString("utf-8");a=d.transformTo(e.uint8array?"uint8array":"array",a);for(var b=[],c=0,f=a.length,g=65536;f>c;){var h=j(a,Math.min(c+g,f));b.push(e.uint8array?k(a.subarray(c,h)):k(a.slice(c,h))),c=h}return b.join("")}},{"./nodeBuffer":11,"./support":17,"./utils":21}],21:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.arrayBuffer2Blob=function(a){c.checkSupport("blob");try{return new Blob([a],{type:"application/zip"})}catch(b){try{var d=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,e=new d;return e.append(a),e.getBlob("application/zip")}catch(b){throw new Error("Bug : can't construct the Blob.")}}},c.applyFromCharCode=f;var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":11,"./support":17}],22:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support"),k=a("./object");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength),this.zipComment=k.utf8decode(this.zipComment)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":12,"./object":13,"./signature":14,"./stringReader":15,"./support":17,"./uint8ArrayReader":18,"./utils":21,"./zipEntry":23}],23:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object");c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readString(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a);var b=this.findExtraFieldUnicodeComment();null!==b&&(this.fileComment=b)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null},findExtraFieldUnicodeComment:function(){var a=this.extraFields[25461];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileComment)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":13,"./stringReader":15,"./utils":21}],24:[function(a,b){"use strict";var c=a("./lib/utils/common").assign,d=a("./lib/deflate"),e=a("./lib/inflate"),f=a("./lib/zlib/constants"),g={};c(g,d,e,f),b.exports=g},{"./lib/deflate":25,"./lib/inflate":26,"./lib/utils/common":27,"./lib/zlib/constants":30}],25:[function(a,b,c){"use strict";function d(a,b){var c=new s(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}function f(a,b){return b=b||{},b.gzip=!0,d(a,b)}var g=a("./zlib/deflate.js"),h=a("./utils/common"),i=a("./utils/strings"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=0,m=4,n=0,o=1,p=-1,q=0,r=8,s=function(a){this.options=h.assign({level:p,method:r,chunkSize:16384,windowBits:15,memLevel:8,strategy:q,to:""},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=g.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==n)throw new Error(j[c]);b.header&&g.deflateSetHeader(this.strm,b.header)
};s.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?m:l,e.input="string"==typeof a?i.string2buf(a):a,e.next_in=0,e.avail_in=e.input.length;do{if(0===e.avail_out&&(e.output=new h.Buf8(f),e.next_out=0,e.avail_out=f),c=g.deflate(e,d),c!==o&&c!==n)return this.onEnd(c),this.ended=!0,!1;(0===e.avail_out||0===e.avail_in&&d===m)&&this.onData("string"===this.options.to?i.buf2binstring(h.shrinkBuf(e.output,e.next_out)):h.shrinkBuf(e.output,e.next_out))}while((e.avail_in>0||0===e.avail_out)&&c!==o);return d===m?(c=g.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===n):!0},s.prototype.onData=function(a){this.chunks.push(a)},s.prototype.onEnd=function(a){a===n&&(this.result="string"===this.options.to?this.chunks.join(""):h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=s,c.deflate=d,c.deflateRaw=e,c.gzip=f},{"./utils/common":27,"./utils/strings":28,"./zlib/deflate.js":32,"./zlib/messages":37,"./zlib/zstream":39}],26:[function(a,b,c){"use strict";function d(a,b){var c=new m(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}var f=a("./zlib/inflate.js"),g=a("./utils/common"),h=a("./utils/strings"),i=a("./zlib/constants"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=a("./zlib/gzheader"),m=function(a){this.options=g.assign({chunkSize:16384,windowBits:0,to:""},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=f.inflateInit2(this.strm,b.windowBits);if(c!==i.Z_OK)throw new Error(j[c]);this.header=new l,f.inflateGetHeader(this.strm,this.header)};m.prototype.push=function(a,b){var c,d,e,j,k,l=this.strm,m=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?i.Z_FINISH:i.Z_NO_FLUSH,l.input="string"==typeof a?h.binstring2buf(a):a,l.next_in=0,l.avail_in=l.input.length;do{if(0===l.avail_out&&(l.output=new g.Buf8(m),l.next_out=0,l.avail_out=m),c=f.inflate(l,i.Z_NO_FLUSH),c!==i.Z_STREAM_END&&c!==i.Z_OK)return this.onEnd(c),this.ended=!0,!1;l.next_out&&(0===l.avail_out||c===i.Z_STREAM_END||0===l.avail_in&&d===i.Z_FINISH)&&("string"===this.options.to?(e=h.utf8border(l.output,l.next_out),j=l.next_out-e,k=h.buf2string(l.output,e),l.next_out=j,l.avail_out=m-j,j&&g.arraySet(l.output,l.output,e,j,0),this.onData(k)):this.onData(g.shrinkBuf(l.output,l.next_out)))}while(l.avail_in>0&&c!==i.Z_STREAM_END);return c===i.Z_STREAM_END&&(d=i.Z_FINISH),d===i.Z_FINISH?(c=f.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===i.Z_OK):!0},m.prototype.onData=function(a){this.chunks.push(a)},m.prototype.onEnd=function(a){a===i.Z_OK&&(this.result="string"===this.options.to?this.chunks.join(""):g.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=m,c.inflate=d,c.inflateRaw=e,c.ungzip=d},{"./utils/common":27,"./utils/strings":28,"./zlib/constants":30,"./zlib/gzheader":33,"./zlib/inflate.js":35,"./zlib/messages":37,"./zlib/zstream":39}],27:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray&&a.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;c>b;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;c>b;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],28:[function(a,b,c){"use strict";function d(a,b){if(65537>b&&(a.subarray&&g||!a.subarray&&f))return String.fromCharCode.apply(null,e.shrinkBuf(a,b));for(var c="",d=0;b>d;d++)c+=String.fromCharCode(a[d]);return c}var e=a("./common"),f=!0,g=!0;try{String.fromCharCode.apply(null,[0])}catch(h){f=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(h){g=!1}for(var i=new e.Buf8(256),j=0;256>j;j++)i[j]=j>=252?6:j>=248?5:j>=240?4:j>=224?3:j>=192?2:1;i[254]=i[254]=1,c.string2buf=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=new e.Buf8(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},c.buf2binstring=function(a){return d(a,a.length)},c.binstring2buf=function(a){for(var b=new e.Buf8(a.length),c=0,d=b.length;d>c;c++)b[c]=a.charCodeAt(c);return b},c.buf2string=function(a,b){var c,e,f,g,h=b||a.length,j=new Array(2*h);for(e=0,c=0;h>c;)if(f=a[c++],128>f)j[e++]=f;else if(g=i[f],g>4)j[e++]=65533,c+=g-1;else{for(f&=2===g?31:3===g?15:7;g>1&&h>c;)f=f<<6|63&a[c++],g--;g>1?j[e++]=65533:65536>f?j[e++]=f:(f-=65536,j[e++]=55296|f>>10&1023,j[e++]=56320|1023&f)}return d(j,e)},c.utf8border=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+i[a[c]]>b?c:b}},{"./common":27}],29:[function(a,b){"use strict";function c(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0}b.exports=c},{}],30:[function(a,b){b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],31:[function(a,b){"use strict";function c(){for(var a,b=[],c=0;256>c;c++){a=c;for(var d=0;8>d;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function d(a,b,c,d){var f=e,g=d+c;a=-1^a;for(var h=d;g>h;h++)a=a>>>8^f[255&(a^b[h])];return-1^a}var e=c();b.exports=d},{}],32:[function(a,b,c){"use strict";function d(a,b){return a.msg=G[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b>=0;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(C.arraySet(a.output,b.pending_buf,b.pending_out,c,a.next_out),a.next_out+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){D._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,C.arraySet(b,a.input,a.next_in,e,c),1===a.state.wrap?a.adler=E(a.adler,b,e,c):2===a.state.wrap&&(a.adler=F(a.adler,b,e,c)),a.next_in+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-jb?a.strstart-(a.w_size-jb):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+ib,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&m>f);if(d=ib-(m-f),f=m-ib,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-jb)){C.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=hb)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+hb-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<hb)););}while(a.lookahead<jb&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===H)return sb;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return sb;if(a.strstart-a.block_start>=a.w_size-jb&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?sb:sb}function o(a,b){for(var c,d;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c)),a.match_length>=hb)if(d=D._tr_tally(a,a.strstart-a.match_start,a.match_length-hb),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=hb){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function p(a,b){for(var c,d,e;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=hb-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===S||a.match_length===hb&&a.strstart-a.match_start>4096)&&(a.match_length=hb-1)),a.prev_length>=hb&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-hb,d=D._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-hb),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=hb-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return sb}else if(a.match_available){if(d=D._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return sb}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=D._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=ib){if(m(a),a.lookahead<=ib&&b===H)return sb;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=hb&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+ib;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&f>e);a.match_length=ib-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=hb?(c=D._tr_tally(a,1,a.match_length-hb),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===H)return sb;break}if(a.match_length=0,c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function s(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=B[a.level].max_lazy,a.good_match=B[a.level].good_length,a.nice_match=B[a.level].nice_length,a.max_chain_length=B[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=hb-1,a.match_available=0,a.ins_h=0}function t(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=Y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new C.Buf16(2*fb),this.dyn_dtree=new C.Buf16(2*(2*db+1)),this.bl_tree=new C.Buf16(2*(2*eb+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new C.Buf16(gb+1),this.heap=new C.Buf16(2*cb+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new C.Buf16(2*cb+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function u(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=X,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?lb:qb,a.adler=2===b.wrap?0:1,b.last_flush=H,D._tr_init(b),M):d(a,O)}function v(a){var b=u(a);return b===M&&s(a.state),b}function w(a,b){return a&&a.state?2!==a.state.wrap?O:(a.state.gzhead=b,M):O}function x(a,b,c,e,f,g){if(!a)return O;var h=1;if(b===R&&(b=6),0>e?(h=0,e=-e):e>15&&(h=2,e-=16),1>f||f>Z||c!==Y||8>e||e>15||0>b||b>9||0>g||g>V)return d(a,O);8===e&&(e=9);var i=new t;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+hb-1)/hb),i.window=new C.Buf8(2*i.w_size),i.head=new C.Buf16(i.hash_size),i.prev=new C.Buf16(i.w_size),i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new C.Buf8(i.pending_buf_size),i.d_buf=i.lit_bufsize>>1,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,v(a)}function y(a,b){return x(a,b,Y,$,_,W)}function z(a,b){var c,h,k,l;if(!a||!a.state||b>L||0>b)return a?d(a,O):O;if(h=a.state,!a.output||!a.input&&0!==a.avail_in||h.status===rb&&b!==K)return d(a,0===a.avail_out?Q:O);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===lb)if(2===h.wrap)a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead?(i(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),i(h,255&h.gzhead.time),i(h,h.gzhead.time>>8&255),i(h,h.gzhead.time>>16&255),i(h,h.gzhead.time>>24&255),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(i(h,255&h.gzhead.extra.length),i(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(a.adler=F(a.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=mb):(i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,wb),h.status=qb);else{var m=Y+(h.w_bits-8<<4)<<8,n=-1;n=h.strategy>=T||h.level<2?0:h.level<6?1:6===h.level?2:3,m|=n<<6,0!==h.strstart&&(m|=kb),m+=31-m%31,h.status=qb,j(h,m),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(h.status===mb)if(h.gzhead.extra){for(k=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending!==h.pending_buf_size));)i(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=nb)}else h.status=nb;if(h.status===nb)if(h.gzhead.name){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.gzindex=0,h.status=ob)}else h.status=ob;if(h.status===ob)if(h.gzhead.comment){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.status=pb)}else h.status=pb;if(h.status===pb&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&g(a),h.pending+2<=h.pending_buf_size&&(i(h,255&a.adler),i(h,a.adler>>8&255),a.adler=0,h.status=qb)):h.status=qb),0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,M}else if(0===a.avail_in&&e(b)<=e(c)&&b!==K)return d(a,Q);if(h.status===rb&&0!==a.avail_in)return d(a,Q);if(0!==a.avail_in||0!==h.lookahead||b!==H&&h.status!==rb){var o=h.strategy===T?r(h,b):h.strategy===U?q(h,b):B[h.level].func(h,b);if((o===ub||o===vb)&&(h.status=rb),o===sb||o===ub)return 0===a.avail_out&&(h.last_flush=-1),M;if(o===tb&&(b===I?D._tr_align(h):b!==L&&(D._tr_stored_block(h,0,0,!1),b===J&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,M}return b!==K?M:h.wrap<=0?N:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?M:N)}function A(a){var b;return a&&a.state?(b=a.state.status,b!==lb&&b!==mb&&b!==nb&&b!==ob&&b!==pb&&b!==qb&&b!==rb?d(a,O):(a.state=null,b===qb?d(a,P):M)):O}var B,C=a("../utils/common"),D=a("./trees"),E=a("./adler32"),F=a("./crc32"),G=a("./messages"),H=0,I=1,J=3,K=4,L=5,M=0,N=1,O=-2,P=-3,Q=-5,R=-1,S=1,T=2,U=3,V=4,W=0,X=2,Y=8,Z=9,$=15,_=8,ab=29,bb=256,cb=bb+1+ab,db=30,eb=19,fb=2*cb+1,gb=15,hb=3,ib=258,jb=ib+hb+1,kb=32,lb=42,mb=69,nb=73,ob=91,pb=103,qb=113,rb=666,sb=1,tb=2,ub=3,vb=4,wb=3,xb=function(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e};B=[new xb(0,0,0,0,n),new xb(4,4,8,4,o),new xb(4,5,16,8,o),new xb(4,6,32,32,o),new xb(4,4,16,16,p),new xb(8,16,32,32,p),new xb(8,16,128,128,p),new xb(8,32,128,256,p),new xb(32,128,258,1024,p),new xb(32,258,258,4096,p)],c.deflateInit=y,c.deflateInit2=x,c.deflateReset=v,c.deflateResetKeep=u,c.deflateSetHeader=w,c.deflate=z,c.deflateEnd=A,c.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./messages":37,"./trees":38}],33:[function(a,b){"use strict";function c(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}b.exports=c},{}],34:[function(a,b){"use strict";var c=30,d=12;b.exports=function(a,b){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;e=a.state,f=a.next_in,B=a.input,g=f+(a.avail_in-5),h=a.next_out,C=a.output,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=e.dmax,l=e.wsize,m=e.whave,n=e.wnext,o=e.window,p=e.hold,q=e.bits,r=e.lencode,s=e.distcode,t=(1<<e.lenbits)-1,u=(1<<e.distbits)-1;a:do{15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){e.mode=d;break a}a.msg="invalid literal/length code",e.mode=c;break a}x=65535&v,w&=15,w&&(w>q&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",e.mode=c;break a}if(y=65535&v,w&=15,w>q&&(p+=B[f++]<<q,q+=8,w>q&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",e.mode=c;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&e.sane){a.msg="invalid distance too far back",e.mode=c;break a}if(z=0,A=o,0===n){if(z+=l-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(w>n){if(z+=l+n-w,w-=n,x>w){x-=w;do C[h++]=o[z++];while(--w);if(z=0,x>n){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(g>f&&j>h);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in=f,a.next_out=h,a.avail_in=g>f?5+(g-f):5-(f-g),a.avail_out=j>h?257+(j-h):257-(h-j),e.hold=p,e.bits=q}},{}],35:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,a.msg="",b.wrap&&(a.adler=1&b.wrap),b.mode=K,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=b.lendyn=new r.Buf32(ob),b.distcode=b.distdyn=new r.Buf32(pb),b.sane=1,b.back=-1,C):F}function g(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,f(a)):F}function h(a,b){var c,d;return a&&a.state?(d=a.state,0>b?(c=0,b=-b):(c=(b>>4)+1,48>b&&(b&=15)),b&&(8>b||b>15)?F:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,g(a))):F}function i(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=h(a,b),c!==C&&(a.state=null),c):F}function j(a){return i(a,rb)}function k(a){if(sb){var b;for(p=new r.Buf32(512),q=new r.Buf32(32),b=0;144>b;)a.lens[b++]=8;for(;256>b;)a.lens[b++]=9;for(;280>b;)a.lens[b++]=7;for(;288>b;)a.lens[b++]=8;for(v(x,a.lens,0,288,p,0,a.work,{bits:9}),b=0;32>b;)a.lens[b++]=5;v(y,a.lens,0,32,q,0,a.work,{bits:5}),sb=!1}a.lencode=p,a.lenbits=9,a.distcode=q,a.distbits=5}function l(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new r.Buf8(f.wsize)),d>=f.wsize?(r.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),r.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(r.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function m(a,b){var c,e,f,g,h,i,j,m,n,o,p,q,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab=0,Bb=new r.Buf8(4),Cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!a||!a.state||!a.output||!a.input&&0!==a.avail_in)return F;c=a.state,c.mode===V&&(c.mode=W),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,o=i,p=j,xb=C;a:for(;;)switch(c.mode){case K:if(0===c.wrap){c.mode=W;break}for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(2&c.wrap&&35615===m){c.check=0,Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0),m=0,n=0,c.mode=L;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&m)<<8)+(m>>8))%31){a.msg="incorrect header check",c.mode=lb;break}if((15&m)!==J){a.msg="unknown compression method",c.mode=lb;break}if(m>>>=4,n-=4,wb=(15&m)+8,0===c.wbits)c.wbits=wb;else if(wb>c.wbits){a.msg="invalid window size",c.mode=lb;break}c.dmax=1<<wb,a.adler=c.check=1,c.mode=512&m?T:V,m=0,n=0;break;case L:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.flags=m,(255&c.flags)!==J){a.msg="unknown compression method",c.mode=lb;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=lb;break}c.head&&(c.head.text=m>>8&1),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=M;case M:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.time=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,Bb[2]=m>>>16&255,Bb[3]=m>>>24&255,c.check=t(c.check,Bb,4,0)),m=0,n=0,c.mode=N;case N:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.xflags=255&m,c.head.os=m>>8),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=O;case O:if(1024&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length=m,c.head&&(c.head.extra_len=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0}else c.head&&(c.head.extra=null);c.mode=P;case P:if(1024&c.flags&&(q=c.length,q>i&&(q=i),q&&(c.head&&(wb=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),r.arraySet(c.head.extra,e,g,q,wb)),512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,c.length-=q),c.length))break a;c.length=0,c.mode=Q;case Q:if(2048&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.name+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=R;case R:if(4096&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.comment+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.comment=null);c.mode=S;case S:if(512&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(65535&c.check)){a.msg="header crc mismatch",c.mode=lb;break}m=0,n=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),a.adler=c.check=0,c.mode=V;break;case T:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}a.adler=c.check=d(m),m=0,n=0,c.mode=U;case U:if(0===c.havedict)return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,E;a.adler=c.check=1,c.mode=V;case V:if(b===A||b===B)break a;case W:if(c.last){m>>>=7&n,n-=7&n,c.mode=ib;break}for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}switch(c.last=1&m,m>>>=1,n-=1,3&m){case 0:c.mode=X;break;case 1:if(k(c),c.mode=bb,b===B){m>>>=2,n-=2;break a}break;case 2:c.mode=$;break;case 3:a.msg="invalid block type",c.mode=lb}m>>>=2,n-=2;break;case X:for(m>>>=7&n,n-=7&n;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if((65535&m)!==(m>>>16^65535)){a.msg="invalid stored block lengths",c.mode=lb;break}if(c.length=65535&m,m=0,n=0,c.mode=Y,b===B)break a;case Y:c.mode=Z;case Z:if(q=c.length){if(q>i&&(q=i),q>j&&(q=j),0===q)break a;r.arraySet(f,e,g,q,h),i-=q,g+=q,j-=q,h+=q,c.length-=q;break}c.mode=V;break;case $:for(;14>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.nlen=(31&m)+257,m>>>=5,n-=5,c.ndist=(31&m)+1,m>>>=5,n-=5,c.ncode=(15&m)+4,m>>>=4,n-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=lb;break}c.have=0,c.mode=_;case _:for(;c.have<c.ncode;){for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.lens[Cb[c.have++]]=7&m,m>>>=3,n-=3}for(;c.have<19;)c.lens[Cb[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,yb={bits:c.lenbits},xb=v(w,c.lens,0,19,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid code lengths set",c.mode=lb;break}c.have=0,c.mode=ab;case ab:for(;c.have<c.nlen+c.ndist;){for(;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(16>sb)m>>>=qb,n-=qb,c.lens[c.have++]=sb;else{if(16===sb){for(zb=qb+2;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m>>>=qb,n-=qb,0===c.have){a.msg="invalid bit length repeat",c.mode=lb;break}wb=c.lens[c.have-1],q=3+(3&m),m>>>=2,n-=2}else if(17===sb){for(zb=qb+3;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=3+(7&m),m>>>=3,n-=3}else{for(zb=qb+7;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=11+(127&m),m>>>=7,n-=7}if(c.have+q>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=lb;break}for(;q--;)c.lens[c.have++]=wb}}if(c.mode===lb)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=lb;break}if(c.lenbits=9,yb={bits:c.lenbits},xb=v(x,c.lens,0,c.nlen,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid literal/lengths set",c.mode=lb;break}if(c.distbits=6,c.distcode=c.distdyn,yb={bits:c.distbits},xb=v(y,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,yb),c.distbits=yb.bits,xb){a.msg="invalid distances set",c.mode=lb;break}if(c.mode=bb,b===B)break a;case bb:c.mode=cb;case cb:if(i>=6&&j>=258){a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,u(a,p),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,c.mode===V&&(c.back=-1);break}for(c.back=0;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(rb&&0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.lencode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,c.length=sb,0===rb){c.mode=hb;break}if(32&rb){c.back=-1,c.mode=V;break}if(64&rb){a.msg="invalid literal/length code",c.mode=lb;break}c.extra=15&rb,c.mode=db;case db:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=eb;case eb:for(;Ab=c.distcode[m&(1<<c.distbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.distcode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,64&rb){a.msg="invalid distance code",c.mode=lb;break}c.offset=sb,c.extra=15&rb,c.mode=fb;case fb:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.offset+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=lb;break}c.mode=gb;case gb:if(0===j)break a;
if(q=p-j,c.offset>q){if(q=c.offset-q,q>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=lb;break}q>c.wnext?(q-=c.wnext,ob=c.wsize-q):ob=c.wnext-q,q>c.length&&(q=c.length),pb=c.window}else pb=f,ob=h-c.offset,q=c.length;q>j&&(q=j),j-=q,c.length-=q;do f[h++]=pb[ob++];while(--q);0===c.length&&(c.mode=cb);break;case hb:if(0===j)break a;f[h++]=c.length,j--,c.mode=cb;break;case ib:if(c.wrap){for(;32>n;){if(0===i)break a;i--,m|=e[g++]<<n,n+=8}if(p-=j,a.total_out+=p,c.total+=p,p&&(a.adler=c.check=c.flags?t(c.check,f,p,h-p):s(c.check,f,p,h-p)),p=j,(c.flags?m:d(m))!==c.check){a.msg="incorrect data check",c.mode=lb;break}m=0,n=0}c.mode=jb;case jb:if(c.wrap&&c.flags){for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=lb;break}m=0,n=0}c.mode=kb;case kb:xb=D;break a;case lb:xb=G;break a;case mb:return H;case nb:default:return F}return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,(c.wsize||p!==a.avail_out&&c.mode<lb&&(c.mode<ib||b!==z))&&l(a,a.output,a.next_out,p-a.avail_out)?(c.mode=mb,H):(o-=a.avail_in,p-=a.avail_out,a.total_in+=o,a.total_out+=p,c.total+=p,c.wrap&&p&&(a.adler=c.check=c.flags?t(c.check,f,p,a.next_out-p):s(c.check,f,p,a.next_out-p)),a.data_type=c.bits+(c.last?64:0)+(c.mode===V?128:0)+(c.mode===bb||c.mode===Y?256:0),(0===o&&0===p||b===z)&&xb===C&&(xb=I),xb)}function n(a){if(!a||!a.state)return F;var b=a.state;return b.window&&(b.window=null),a.state=null,C}function o(a,b){var c;return a&&a.state?(c=a.state,0===(2&c.wrap)?F:(c.head=b,b.done=!1,C)):F}var p,q,r=a("../utils/common"),s=a("./adler32"),t=a("./crc32"),u=a("./inffast"),v=a("./inftrees"),w=0,x=1,y=2,z=4,A=5,B=6,C=0,D=1,E=2,F=-2,G=-3,H=-4,I=-5,J=8,K=1,L=2,M=3,N=4,O=5,P=6,Q=7,R=8,S=9,T=10,U=11,V=12,W=13,X=14,Y=15,Z=16,$=17,_=18,ab=19,bb=20,cb=21,db=22,eb=23,fb=24,gb=25,hb=26,ib=27,jb=28,kb=29,lb=30,mb=31,nb=32,ob=852,pb=592,qb=15,rb=qb,sb=!0;c.inflateReset=g,c.inflateReset2=h,c.inflateResetKeep=f,c.inflateInit=j,c.inflateInit2=i,c.inflate=m,c.inflateEnd=n,c.inflateGetHeader=o,c.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./inffast":34,"./inftrees":36}],36:[function(a,b){"use strict";var c=a("../utils/common"),d=15,e=852,f=592,g=0,h=1,i=2,j=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],k=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],m=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];b.exports=function(a,b,n,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C=s.bits,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=null,O=0,P=new c.Buf16(d+1),Q=new c.Buf16(d+1),R=null,S=0;for(D=0;d>=D;D++)P[D]=0;for(E=0;o>E;E++)P[b[n+E]]++;for(H=C,G=d;G>=1&&0===P[G];G--);if(H>G&&(H=G),0===G)return p[q++]=20971520,p[q++]=20971520,s.bits=1,0;for(F=1;G>F&&0===P[F];F++);for(F>H&&(H=F),K=1,D=1;d>=D;D++)if(K<<=1,K-=P[D],0>K)return-1;if(K>0&&(a===g||1!==G))return-1;for(Q[1]=0,D=1;d>D;D++)Q[D+1]=Q[D]+P[D];for(E=0;o>E;E++)0!==b[n+E]&&(r[Q[b[n+E]]++]=E);if(a===g?(N=R=r,y=19):a===h?(N=j,O-=257,R=k,S-=257,y=256):(N=l,R=m,y=-1),M=0,E=0,D=F,x=q,I=H,J=0,v=-1,L=1<<H,w=L-1,a===h&&L>e||a===i&&L>f)return 1;for(var T=0;;){T++,z=D-J,r[E]<y?(A=0,B=r[E]):r[E]>y?(A=R[S+r[E]],B=N[O+r[E]]):(A=96,B=0),t=1<<D-J,u=1<<I,F=u;do u-=t,p[x+(M>>J)+u]=z<<24|A<<16|B|0;while(0!==u);for(t=1<<D-1;M&t;)t>>=1;if(0!==t?(M&=t-1,M+=t):M=0,E++,0===--P[D]){if(D===G)break;D=b[n+r[E]]}if(D>H&&(M&w)!==v){for(0===J&&(J=H),x+=F,I=D-J,K=1<<I;G>I+J&&(K-=P[I+J],!(0>=K));)I++,K<<=1;if(L+=1<<I,a===h&&L>e||a===i&&L>f)return 1;v=M&w,p[v]=H<<24|I<<16|x-q|0}}return 0!==M&&(p[x+M]=D-J<<24|64<<16|0),s.bits=H,0}},{"../utils/common":27}],37:[function(a,b){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],38:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b>=0;)a[b]=0}function e(a){return 256>a?gb[a]:gb[256+(a>>>7)]}function f(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function g(a,b,c){a.bi_valid>V-c?(a.bi_buf|=b<<a.bi_valid&65535,f(a,a.bi_buf),a.bi_buf=b>>V-a.bi_valid,a.bi_valid+=c-V):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function h(a,b,c){g(a,c[2*b],c[2*b+1])}function i(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function j(a){16===a.bi_valid?(f(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function k(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;U>=f;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,c=a.heap_max+1;T>c;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function l(a,b,c){var d,e,f=new Array(U+1),g=0;for(d=1;U>=d;d++)f[d]=g=g+c[d-1]<<1;for(e=0;b>=e;e++){var h=a[2*e+1];0!==h&&(a[2*e]=i(f[h]++,h))}}function m(){var a,b,c,d,e,f=new Array(U+1);for(c=0,d=0;O-1>d;d++)for(ib[d]=c,a=0;a<1<<_[d];a++)hb[c++]=d;for(hb[c-1]=d,e=0,d=0;16>d;d++)for(jb[d]=e,a=0;a<1<<ab[d];a++)gb[e++]=d;for(e>>=7;R>d;d++)for(jb[d]=e<<7,a=0;a<1<<ab[d]-7;a++)gb[256+e++]=d;for(b=0;U>=b;b++)f[b]=0;for(a=0;143>=a;)eb[2*a+1]=8,a++,f[8]++;for(;255>=a;)eb[2*a+1]=9,a++,f[9]++;for(;279>=a;)eb[2*a+1]=7,a++,f[7]++;for(;287>=a;)eb[2*a+1]=8,a++,f[8]++;for(l(eb,Q+1,f),a=0;R>a;a++)fb[2*a+1]=5,fb[2*a]=i(a,5);kb=new nb(eb,_,P+1,Q,U),lb=new nb(fb,ab,0,R,U),mb=new nb(new Array(0),bb,0,S,W)}function n(a){var b;for(b=0;Q>b;b++)a.dyn_ltree[2*b]=0;for(b=0;R>b;b++)a.dyn_dtree[2*b]=0;for(b=0;S>b;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*X]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function o(a){a.bi_valid>8?f(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function p(a,b,c,d){o(a),d&&(f(a,c),f(a,~c)),E.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function q(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function r(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&q(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!q(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function s(a,b,c){var d,f,i,j,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],f=a.pending_buf[a.l_buf+k],k++,0===d?h(a,f,b):(i=hb[f],h(a,i+P+1,b),j=_[i],0!==j&&(f-=ib[i],g(a,f,j)),d--,i=e(d),h(a,i,c),j=ab[i],0!==j&&(d-=jb[i],g(a,d,j)));while(k<a.last_lit);h(a,X,b)}function t(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=T,c=0;i>c;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=2>j?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)r(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],r(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,r(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],k(a,b),l(f,j,a.bl_count)}function u(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;c>=d;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(j>h?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*Y]++):10>=h?a.bl_tree[2*Z]++:a.bl_tree[2*$]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))}function v(a,b,c){var d,e,f=-1,i=b[1],j=0,k=7,l=4;for(0===i&&(k=138,l=3),d=0;c>=d;d++)if(e=i,i=b[2*(d+1)+1],!(++j<k&&e===i)){if(l>j){do h(a,e,a.bl_tree);while(0!==--j)}else 0!==e?(e!==f&&(h(a,e,a.bl_tree),j--),h(a,Y,a.bl_tree),g(a,j-3,2)):10>=j?(h(a,Z,a.bl_tree),g(a,j-3,3)):(h(a,$,a.bl_tree),g(a,j-11,7));j=0,f=e,0===i?(k=138,l=3):e===i?(k=6,l=3):(k=7,l=4)}}function w(a){var b;for(u(a,a.dyn_ltree,a.l_desc.max_code),u(a,a.dyn_dtree,a.d_desc.max_code),t(a,a.bl_desc),b=S-1;b>=3&&0===a.bl_tree[2*cb[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function x(a,b,c,d){var e;for(g(a,b-257,5),g(a,c-1,5),g(a,d-4,4),e=0;d>e;e++)g(a,a.bl_tree[2*cb[e]+1],3);v(a,a.dyn_ltree,b-1),v(a,a.dyn_dtree,c-1)}function y(a){var b,c=4093624447;for(b=0;31>=b;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return G;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return H;for(b=32;P>b;b++)if(0!==a.dyn_ltree[2*b])return H;return G}function z(a){pb||(m(),pb=!0),a.l_desc=new ob(a.dyn_ltree,kb),a.d_desc=new ob(a.dyn_dtree,lb),a.bl_desc=new ob(a.bl_tree,mb),a.bi_buf=0,a.bi_valid=0,n(a)}function A(a,b,c,d){g(a,(J<<1)+(d?1:0),3),p(a,b,c,!0)}function B(a){g(a,K<<1,3),h(a,X,eb),j(a)}function C(a,b,c,d){var e,f,h=0;a.level>0?(a.strm.data_type===I&&(a.strm.data_type=y(a)),t(a,a.l_desc),t(a,a.d_desc),h=w(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,e>=f&&(e=f)):e=f=c+5,e>=c+4&&-1!==b?A(a,b,c,d):a.strategy===F||f===e?(g(a,(K<<1)+(d?1:0),3),s(a,eb,fb)):(g(a,(L<<1)+(d?1:0),3),x(a,a.l_desc.max_code+1,a.d_desc.max_code+1,h+1),s(a,a.dyn_ltree,a.dyn_dtree)),n(a),d&&o(a)}function D(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(hb[c]+P+1)]++,a.dyn_dtree[2*e(b)]++),a.last_lit===a.lit_bufsize-1}var E=a("../utils/common"),F=4,G=0,H=1,I=2,J=0,K=1,L=2,M=3,N=258,O=29,P=256,Q=P+1+O,R=30,S=19,T=2*Q+1,U=15,V=16,W=7,X=256,Y=16,Z=17,$=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ab=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],bb=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],db=512,eb=new Array(2*(Q+2));d(eb);var fb=new Array(2*R);d(fb);var gb=new Array(db);d(gb);var hb=new Array(N-M+1);d(hb);var ib=new Array(O);d(ib);var jb=new Array(R);d(jb);var kb,lb,mb,nb=function(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length},ob=function(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b},pb=!1;c._tr_init=z,c._tr_stored_block=A,c._tr_flush_block=C,c._tr_tally=D,c._tr_align=B},{"../utils/common":27}],39:[function(a,b){"use strict";function c(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=c},{}]},{},[9])(9)});
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.EmbeddedFiles = {

    get: function(fileName) {
    var comp = this.compressedContent[fileName];
    if (comp !== undefined) return { name: fileName, content: jt.Util.uncompressStringBase64ToInt8BitArray(comp) };

    var diff = this.diffsContent[fileName];
    if (diff === undefined) return undefined;

    var base = this.get(diff.based);
    if (base === undefined) return undefined;

    var content = base.content;
    for (var add in diff.diffs) {
        var bytes = diff.diffs[add];
        for (var i = 0; i < bytes.length; ++i) content[(add | 0) + i] = bytes[i];
    }
    return { name: fileName, content: content };
    },

    embedFileCompressedContent: function(fileName, compressedContent) {
        this.compressedContent[fileName] = compressedContent;
    },

    embedFileDiff: function(fileName, diffs) {
        this.diffsContent[fileName] = diffs;
    },

    compressedContent: {},

    diffsContent: {}

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.MultiDownloader = function (urlSpecs, onAllSuccess, onAnyError, timeout) {
"use strict";

    this.start = function() {
        if (urlSpecs && urlSpecs.length !== 0) {
            scheduleLoadingIcon();
            for (var i = 0; i < urlSpecs.length; i++) load(urlSpecs[i]);
        }
        checkFinish();
    };

    function load(urlSpec) {
        if (!urlSpec) return;

        var urls = urlSpec.url.trim().split(/\s*\|\s*/);              // Special "|" divider. TODO Find a better way since "|" is allowed in Linux file names
        urlSpec.filesToLoad = urls.length;
        urlSpec.filesContent = new Array(urlSpec.filesToLoad);

        // Ask to load all files
        for (var f = 0; f < urls.length; ++f) {
            var url = urls[f];
            if (url[0] === "@") getEmbedded(urlSpec, f, url);         // Embedded file?
            else getHTTP(urlSpec, f, url);                            // No, HTTP
        }
    }

    function getEmbedded(urlSpec, f, url) {
        jt.Util.log("Reading Embedded file: " + url);
        var file = jt.EmbeddedFiles.get(url.substr(1));
        if (file !== undefined) loadSuccess(urlSpec, f, file.content);
        else loadError(urlSpec, "Embedded file not found!");
    }

    function getHTTP(urlSpec, f, url, remote) {
        var finalUrl = isRemote(url) ? proxyze(url) : url;      // May use a proxy downloader if configured

        var req = new XMLHttpRequest();
        req.open("GET", finalUrl, true);
        req.responseType = "arraybuffer";
        req.timeout = timeout !== undefined ? timeout : DEFAULT_TIMEOUT;
        req.onload = function () {
            if (req.status === 200) loadSuccess(urlSpec, f, new Uint8Array(req.response));
            else req.onerror();
        };
        req.onerror = req.ontimeout = function () {
            loadError(urlSpec, "" + req.status + " " + req.statusText);
        };
        jt.Util.log("Reading file from: " + url);
        req.send();
    }

    function loadSuccess(urlSpec, f, content) {
        urlSpec.filesContent[f] = content;
        if (--urlSpec.filesToLoad > 0) return;                                   // Still some files to complete loading

        urlSpec.success = true;
        urlSpec.content = jt.Util.arraysConcatAll(urlSpec.filesContent);       // Concat all files in order
        if (urlSpec.onSuccess) urlSpec.onSuccess(urlSpec);
        checkFinish();
    }

    function loadError(urlSpec, error) {
        urlSpec.success = false;
        urlSpec.error = error;
        var mes = "Could not load file: " + urlSpec.url + "\nError: " + error;
        if (urlSpec.onError) {
            jt.Util.error(mes);
            urlSpec.onError(urlSpec);
        } else if (!onAnyError)
            jt.Util.message(mes);
        checkFinish();
    }

    function checkFinish() {
        if (finished) return;

        for (var i = 0; i < urlSpecs.length; i++)
            if (urlSpecs[i] && (urlSpecs[i].success === undefined)) return;

        finished = true;
        cancelLoadingIcon();

        // All urls have a definition, check for errors
        for (i = 0; i < urlSpecs.length; i++)
            if (urlSpecs[i] && !urlSpecs[i].success) {
                if (onAnyError) onAnyError(urlSpecs);
                return;
            }

        // If no errors, then success
        if (onAllSuccess) onAllSuccess(urlSpecs);
    }

    function isRemote(url) {
        return url && (url.indexOf("http:") === 0 || url.indexOf("https:") === 0);
    }

    function proxyze(url) {
        return (Javatari.PROXY_DOWNLOADER || "") + url;
    }

    function scheduleLoadingIcon() {
        if (Javatari.room.isLoading) return;

        loadingTimer = window.setTimeout(function setLoadingOnDelay() {
            loadingTimer = null;
            loadingSet = true;
            Javatari.room.setLoading(true);
        }, LOADING_ICON_TIMEOUT);
    }

    function cancelLoadingIcon() {
        if (loadingTimer) {
            window.clearTimeout(loadingTimer);
            loadingTimer = null;
        }
        if (loadingSet) {
            loadingSet = false;
            Javatari.room.setLoading(false);
        }
    }


    var loadingSet = false;
    var loadingTimer = null;
    var finished = false;

    var LOADING_ICON_TIMEOUT = 1000;
    var DEFAULT_TIMEOUT = 15000;

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.MultiFileReader = function (files, onAllSuccess, onFirstError, maxTotalSize) {
"use strict";

    this.start = function() {
        if (!files || files.length === 0)
            onAllSuccess(files);
        else {
            if (!maxTotalSize) maxTotalSize = MAX_TOTAL_SIZE;
            var totalSize = 0;
            for (var i = 0; i < files.length; i++) totalSize += files[i].size;
            if (totalSize > maxTotalSize) {
                var error = "Maximum total size limit exceeded: " + ((maxTotalSize / 1024) | 0) + "KB";
                if (onFirstError) onFirstError(files, error, true);     // known error
                return;
            }

            for (i = 0; i < files.length; i++) load(files[i]);
            checkFinish();
        }
    };

    function load(file) {
        if (!file) return;

        jt.Util.log("Reading file: " + file.name);
        var reader = new FileReader();
        reader.onload = function (event) {
            file.success = true;
            file.content = new Uint8Array(event.target.result);
            checkFinish();
        };
        reader.onerror = function (event) {
            file.success = false;
            file.error = event.target.error.name;
            checkFinish();
        };
        reader.readAsArrayBuffer(file);
    }

    function checkFinish() {
        if (finished) return;

        for (var i = 0; i < files.length; i++)
            if (files[i] && (files[i].success === undefined)) return;

        finished = true;

        // All files have a definition, check for errors
        for (i = 0; i < files.length; i++)
            if (files[i] && !files[i].success) {
                if (onFirstError) onFirstError(files, files[i].error);
                return files;
            }

        // If no errors, then success
        if (onAllSuccess) onAllSuccess(files);
    }

    var finished = false;

    var MAX_TOTAL_SIZE = 8 * 720 * 1024;   // Read up 8 720KB disks of files

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.VideoStandard = {
    NTSC: {
        name: "NTSC",
        desc: "NTSC 60Hz",
        totalWidth: 228,
        totalHeight: 262,
        defaultOriginYPct: 10.8,         		// Percentage of height
        defaultHeightPct: 85.2,
        targetFPS: 60,
        pulldowns: {
            60: { // Host at 60Hz
                standard: "NTSC",
                frequency: 60,
                linesPerCycle: 262,             // Normal 1:1 cadence. Exact V-synch to 60 Hz
                firstStepCycleLinesAdjust: 0,
                cadence: [ 1 ],
                steps: 1
            },
            120: { // Host at 120Hz
                standard: "NTSC",
                frequency: 120,
                linesPerCycle: 131,             // 0:1 pulldown. 1 frame generated each 2 frames shown
                firstStepCycleLinesAdjust: 0,
                cadence: [ 0, 1 ],
                steps: 2
            },
            50: { // Host at 50Hz
                standard: "NTSC",
                frequency: 50,
                linesPerCycle: 314,             // 1:1:1:1:2 pulldown. 6 frames generated each 5 frames shown
                firstStepCycleLinesAdjust: +2,
                cadence: [ 1, 1, 1, 1, 2 ],
                steps: 5
            },
            100: { // Host at 100Hz
                standard: "NTSC",
                frequency: 100,
                linesPerCycle: 157,             // 0:1:0:1:1:0:1:0:1:1 pulldown. 6 frames generated each 10 frames shown
                firstStepCycleLinesAdjust: +2,
                cadence: [ 0, 1, 0, 1, 1, 0, 1, 0, 1, 1 ],
                steps: 10
            },
            TIMER: { // Host frequency not detected or V-synch disabled, use a normal interval timer
                standard: "NTSC",
                frequency: 62.5,
                linesPerCycle: 262,             // Normal 1:1 cadence
                firstStepCycleLinesAdjust: 0,
                cadence: [ 1 ],
                steps: 1
            }
        }
    },
    PAL: {
        name: "PAL",
        desc: "PAL 50Hz",
        totalWidth: 228,
        totalHeight: 312,
        defaultOriginYPct: 13.5,           		// Percentage of height
        defaultHeightPct: 77.3,
        targetFPS: 50,                          // Original is 50.22364217252396, or 50.3846153846153847
        pulldowns: {
            50: { // Host at 50Hz
                standard: "PAL",
                frequency: 50,
                linesPerCycle: 313,             // Normal 1:1 cadence. Exact V-synch to 50 Hz
                firstStepCycleLinesAdjust: 0,
                cadence: [ 1 ],
                steps: 1
            },
            100: { // Host at 100Hz
                standard: "PAL",
                frequency: 100,
                linesPerCycle: 156,             // 0:1 pulldown. 1 frame generated each 2 frames shown
                firstStepCycleLinesAdjust: +1,
                cadence: [ 0, 1 ],
                steps: 2
            },
            60: { // Host at 60Hz
                standard: "PAL",
                frequency: 60,
                linesPerCycle: 261,             // 0:1:1:1:1:1 pulldown. 5 frames generated each 6 frames shown
                firstStepCycleLinesAdjust: -1,
                cadence: [ 0, 1, 1, 1, 1, 1 ],
                steps: 6
            },
            120: { // Host at 120Hz
                standard: "PAL",
                frequency: 120,
                linesPerCycle: 130,             // 0:0:1:0:1:0:0:1:0:1:0:1 pulldown. 5 frames generated each 12 frames shown
                firstStepCycleLinesAdjust: +5,
                cadence: [ 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1 ],
                steps: 12
            },
            TIMER: { // Host frequency not detected or V-synch disabled, use a normal interval timer
                standard: "PAL",
                frequency: 50,
                linesPerCycle: 313,             // Normal 1:1 cadence
                firstStepCycleLinesAdjust: 0,
                cadence: [ 1 ],
                steps: 1
            }
        }
    }
};


// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.VideoSignal = function() {
"use strict";

    this.connectMonitor = function(pMonitor) {
        this.monitor = pMonitor;
    };

    this.setVideoStandard = function(standard) {
        if (this.monitor) this.monitor.setVideoStandard(standard);
    };

    this.nextLine = function(pixels, vSynch) {
        return this.monitor.nextLine(pixels, vSynch);
    };

    this.finishFrame = function() {
       this.monitor.refresh();
    };

    this.signalOff = function() {
        if (this.monitor) this.monitor.videoSignalOff();
    };

    this.showOSD = function(message, overlap) {
        if (this.monitor) this.monitor.showOSD(message, overlap);
    };

    this.toggleShowInfo = function() {
        this.monitor.toggleShowInfo();
    };


    this.monitor = null;

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.AudioSignal = function(name, source, sampleRate, volume) {
"use strict";

    var self = this;

    this.flush = function() {
        nextSampleToGenerate = 0;
        nextSampleToRetrieve = 0;
        availSamples = maxAvailSamples;

        //console.log("FLUSH!");
    };

    this.setFps = function(fps) {
        // Calculate total samples per frame based on fps
        samplesPerFrame = (sampleRate / fps) | 0;
        updateBufferSize();
    };

    this.audioFinishFrame = function() {             // Enough samples to complete frame, signal always ON
        if (frameSamples > 0) {
            //console.log(">>> Audio finish frame: " + frameSamples);
            while(frameSamples > 0) audioClockPulse();
        }
        frameSamples = samplesPerFrame;
    };

    this.retrieveSamples = function(quant, mute) {
        var generated = maxAvailSamples - availSamples;

        //var generated = nextSampleToGenerate >= nextSampleToRetrieve
        //    ? nextSampleToGenerate - nextSampleToRetrieve
        //    : maxSamples - nextSampleToRetrieve + nextSampleToGenerate;

        //console.log(">>> Samples available: " + generated);

        //if (nextSampleToGenerate === nextSampleToRetrieve)
        //    console.log("MATCH: " + nextSampleToGenerate );

        //if (nextSampleToGenerate < nextSampleToRetrieve)
        //    console.log("WRAP: " + nextSampleToGenerate );

        var missing = quant - generated;

        if (missing > 0) {
            if (missing > availSamples) missing = availSamples;
            generateMissingSamples(missing, mute);
            //jt.Util.log(">>> Missing samples generated: " + missing);
        } else {
            //jt.Util.log(">>> No missing samples");
        }

        retrieveResult.start = nextSampleToRetrieve;

        var retrieved = generated + missing;
        availSamples += retrieved;
        nextSampleToRetrieve += retrieved;
        if (nextSampleToRetrieve >= maxSamples) nextSampleToRetrieve -= maxSamples;     // Circular Buffer

        return retrieveResult;
    };


    function audioClockPulse() {
        if (frameSamples > 0) {
            if (availSamples <= 0) {
                frameSamples = 0;
                return;
            }
            generateNextSample();
            --frameSamples;
            --availSamples;
        }
    }
    this.audioClockPulse = audioClockPulse;

    this.getSampleRate = function() {
        return sampleRate;
    };

    this.toString = function() {
        return "AudioSignal " + name;
    };

    this.setAudioMonitorBufferSize = function (size) {
        monitorBufferSize = size;
        updateBufferSize();
    };

    function updateBufferSize() {
        var size = (monitorBufferSize * Javatari.AUDIO_SIGNAL_BUFFER_RATIO + samplesPerFrame * Javatari.AUDIO_SIGNAL_ADD_FRAMES) | 0;
        samples.length = size;
        if (size > maxSamples) jt.Util.arrayFill(samples, 0, maxSamples, size);
        maxSamples = size;
        retrieveResult.bufferSize = maxSamples;
        maxAvailSamples = maxSamples - 2;
        self.flush();

        //console.log(">>> Buffer size for: " + name + ": " + maxSamples);
    }

    function generateNextSample() {
        samples[nextSampleToGenerate] = source.nextSample() * volume;
        if (++nextSampleToGenerate >= maxSamples) nextSampleToGenerate = 0;          // Circular Buffer
    }

    function generateNextSampleMute() {
        samples[nextSampleToGenerate] = 0;
        if (++nextSampleToGenerate >= maxSamples) nextSampleToGenerate = 0;          // Circular Buffer
    }

    function generateMissingSamples(quant, mute) {
        if (mute) for (var j = quant; j > 0; j = j - 1) generateNextSampleMute()
        else      for (var i = quant; i > 0; i = i - 1) generateNextSample()
        availSamples -= quant;
    }


    this.name = name;

    var clock72xCountDown = 9;              // 4 clocks out of 9 32x clocks. Count from 9 to 0 and misses every odd and the 8th clock

    var nextSampleToGenerate = 0;
    var nextSampleToRetrieve = 0;

    var samplesPerFrame;
    var frameSamples = 0;

    var maxSamples = 0;
    var availSamples = 0, maxAvailSamples = 0;
    var samples = jt.Util.arrayFill(new Array(maxSamples), 0);

    var monitorBufferSize = 0;

    var retrieveResult = {
        buffer: samples,
        bufferSize: maxSamples,
        start: 0
    };


};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.M6502 = function() {
"use strict";

    var self = this;

    this.powerOn = function() {
        this.reset();
    };

    this.powerOff = function() {
    };

    this.clockPulse = function() {
        if (!RDY) return;      // TODO Should be ignored in the last cycle of the instruction
        T++;
        instruction[T]();
    };

    this.connectBus = function(aBus) {
        bus = aBus;
    };

    this.setRDY = function(boo) {
        RDY = boo;
    };

    this.reset = function() {
        I = 1;
        T = -1;
        instruction = [ fetchOpcodeAndDecodeInstruction ];    // Bootstrap instruction
        PC = bus.read(RESET_VECTOR) | (bus.read(RESET_VECTOR + 1) << 8);
        this.setRDY(true);
    };


    // Interfaces
    var bus;
    var RDY = false;

    // Registers
    var PC = 0;
    var SP = 0;
    var A = 0;
    var X = 0;
    var Y = 0;

    // Status Bits
    var N = 0;
    var V = 0;
    var D = 0;
    var I = 0;
    var Z = 0;
    var C = 0;

    // Internal decoding registers
    var T = -1;
    var opcode = -1;
    var instruction;
    var data = 0;
    var AD = 0;
    var BA = 0;
    var BALCrossed = false;
    var IA = 0;
    var branchOffset = 0;
    var branchOffsetCrossAdjust = 0;

    // Vectors
    //var NMI_VECTOR = 0xfffa;
    var RESET_VECTOR = 0xfffc;
    var IRQ_VECTOR = 0xfffe;

    // Index registers names
    var rX = 0;
    var rY = 1;

    // Status bits names
    var bN = 7;
    var bV = 6;
    // var bE = 5;	// Not used
    // var bB = 4;	// Not used
    // var bD = 3;  // Not used
    // var bI = 2;  // Not used
    var bZ = 1;
    var bC = 0;

    // Auxiliary variables
    //noinspection JSUnusedGlobalSymbols
    this.debug = false;
    //noinspection JSUnusedGlobalSymbols
    this.trace = false;


    // Internal operations

    var fetchOpcodeAndDecodeInstruction = function() {
        opcode = bus.read(PC);
        instruction = instructions[opcode];
        T = 0;

        // if (self.trace) self.breakpoint("TRACE");
        // console.log("PC: " + PC + ", op: " + opcode + ": " + opcodes[opcode]);

        PC++;
    };

    var fetchNextOpcode = fetchOpcodeAndDecodeInstruction;

    var fetchOpcodeAndDiscard = function() {
        bus.read(PC);
    };

    var fetchBranchOffset = function() {
        branchOffset = bus.read(PC);
        PC++;
    };

    var fetchADL = function() {
        AD = bus.read(PC);
        PC++;
    };

    var fetchADH = function() {
        AD |= bus.read(PC) << 8;
        PC++;
    };

    var fetchADLFromBA = function() {
        AD = bus.read(BA);
    };

    var fetchADHFromBA = function() {
        AD |= bus.read(BA) << 8;
    };

    var fetchBAL = function() {
        BA = bus.read(PC);
        PC++;
    };

    var fetchBAH = function() {
        BA |= bus.read(PC) << 8;
        PC++;
    };

    var fetchBALFromIA = function() {
        BA = bus.read(IA);
    };

    var fetchBAHFromIA = function() {
        BA |= bus.read(IA) << 8;
    };

    var addXtoBAL = function() {
        var low = (BA & 255) + X;
        BALCrossed = low > 255;
        BA = (BA & 0xff00) | (low & 255);
    };

    var addYtoBAL = function() {
        var low = (BA & 255) + Y;
        BALCrossed = low > 255;
        BA = (BA & 0xff00) | (low & 255);
    };

    var add1toBAL = function() {
        var low = (BA & 255) + 1;
        BALCrossed = low > 255;
        BA = (BA & 0xff00) | (low & 255);
    };

    var add1toBAHifBALCrossed = function() {
        if (BALCrossed)
            BA = (BA + 0x0100) & 0xffff;
    };

    var fetchIAL = function() {
        IA = bus.read(PC);
        PC++;
    };

    var fetchIAH = function() {
        IA |= bus.read(PC) << 8;
        PC++;
    };

    var add1toIAL = function() {
        var low = (IA & 255) + 1;
        IA = (IA & 0xff00) | (low & 255);
    };

    var fetchDataFromImmediate = function() {
        data = bus.read(PC);
        PC++;
    };

    var fetchDataFromAD = function() {
        data = bus.read(AD);
    };

    var fetchDataFromBA = function() {
        data = bus.read(BA);
    };

    var writeDataToAD = function() {
        bus.write(AD, data);
    };

    var writeDataToBA = function() {
        bus.write(BA, data);
    };

    var addBranchOffsetToPCL = function() {
        var oldLow = (PC & 0x00ff);
        var newLow = (oldLow + branchOffset) & 255;
        // Negative offset?
        if (branchOffset > 127)
            branchOffsetCrossAdjust = (newLow > oldLow) ? -0x0100 : 0;
        else
            branchOffsetCrossAdjust = (newLow < oldLow) ? 0x0100 : 0;
        PC = (PC & 0xff00) | newLow;
    };

    var adjustPCHForBranchOffsetCross = function() {
        PC = (PC + branchOffsetCrossAdjust) & 0xffff;
    };

    var setZ = function(val) {
        Z = (val === 0) ? 1 : 0;
    };

    var setN = function(val) {
        N = (val & 0x080) ? 1 : 0;
    };

    var setV = function(boo) {
        V = boo ? 1 : 0;
    };

    var setC = function(boo) {
        C = boo ? 1 : 0;
    };

    var popFromStack = function() {
        SP = (SP + 1) & 255;
        return bus.read(0x0100 + SP);
    };

    var peekFromStack = function() {
        return bus.read(0x0100 + SP);
    };

    var pushToStack = function(val) {
        bus.write(0x0100 + SP, val);
        SP = (SP - 1) & 255;
    };

    var getStatusBits = function() {
        return N << 7 | V << 6 | 0x30                 // Always push with E (bit 5) and B (bit 4) ON
            |  D << 3 | I << 2 | Z << 1 | C;
    };

    var setStatusBits = function(val) {
        N = val >>> 7; V = val >>> 6 & 1;             // E and B flags actually do not exist as real flags, so ignore
        D = val >>> 3 & 1; I = val >>> 2 & 1; Z = val >>> 1 & 1; C = val & 1;
    };

    var illegalOpcode = function(op) {
        if (self.debug) self.breakpoint("Illegal Opcode: " + op);
    };


    // Addressing routines

    var implied = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchOpcodeAndDiscard,
            function implied() {
                operation();
                fetchNextOpcode();
            }
        ];
    };

    var immediateRead = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchDataFromImmediate,
            function immediateRead() {
                operation();
                fetchNextOpcode();
            }
        ];
    };

    var zeroPageRead = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchADL,                        // ADH will be zero
            fetchDataFromAD,
            function zeroPageRead() {
                operation();
                fetchNextOpcode();
            }
        ];
    };

    var absoluteRead = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchADL,
            fetchADH,
            fetchDataFromAD,
            function absoluteRead() {
                operation();
                fetchNextOpcode();
            }
        ];
    };

    var indirectXRead = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchBAL,                        // BAH will be zero
            fetchDataFromBA,
            function indirectXRead1() {
                addXtoBAL();
                fetchADLFromBA();
            },
            function indirectXRead2() {
                add1toBAL();
                fetchADHFromBA();
            },
            fetchDataFromAD,
            function indirectXRead3() {
                operation();
                fetchNextOpcode();
            }
        ];
    };

    var absoluteIndexedRead = function(index) {
        var addIndex = index === rX ? addXtoBAL : addYtoBAL;
        return function(operation) {
            return [
                fetchOpcodeAndDecodeInstruction,
                fetchBAL,
                fetchBAH,
                function absoluteIndexedRead1() {
                    addIndex();
                    fetchDataFromBA();
                    add1toBAHifBALCrossed();
                },
                function absoluteIndexedRead2() {
                    if (BALCrossed) {
                        fetchDataFromBA();
                    } else {
                        operation();
                        fetchNextOpcode();
                    }
                },
                function absoluteIndexedRead3() {
                    operation();
                    fetchNextOpcode();
                }
            ];
        };
    };

    var zeroPageIndexedRead = function(index) {
        var addIndex = index === rX ? addXtoBAL : addYtoBAL;
        return function(operation) {
            return [
                fetchOpcodeAndDecodeInstruction,
                fetchBAL,                        // BAH will be zero
                fetchDataFromBA,
                function zeroPageIndexedRead1() {
                    addIndex();
                    fetchDataFromBA();
                },
                function zeroPageIndexedRead2() {
                    operation();
                    fetchNextOpcode();
                }
            ];
        };
    };

    var indirectYRead = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchIAL,                           // IAH will be zero
            fetchBALFromIA,
            function indirectYRead1() {
                add1toIAL();
                fetchBAHFromIA();
            },
            function indirectYRead2() {
                addYtoBAL();
                fetchDataFromBA();
                add1toBAHifBALCrossed();
            },
            function indirectYRead3() {
                if(BALCrossed) {
                    fetchDataFromBA();
                } else {
                    operation();
                    fetchNextOpcode();
                }
            },
            function indirectYRead4() {
                operation();
                fetchNextOpcode();
            }
        ];
    };

    var zeroPageWrite = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchADL,                        // ADH will be zero
            function zeroPageWrite() {
                operation();
                writeDataToAD();
            },
            fetchNextOpcode
        ];
    };

    var absoluteWrite = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchADL,
            fetchADH,
            function absoluteWrite() {
                operation();
                writeDataToAD();
            },
            fetchNextOpcode
        ];
    };

    var indirectXWrite = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchBAL,                        // BAH will be zero
            fetchDataFromBA,
            function indirectXWrite1() {
                addXtoBAL();
                fetchADLFromBA();
            },
            function indirectXWrite2() {
                add1toBAL();
                fetchADHFromBA();
            },
            function indirectXWrite3() {
                operation();
                writeDataToAD();
            },
            fetchNextOpcode
        ];
    };

    var absoluteIndexedWrite = function(index) {
        var addIndex = index === rX ? addXtoBAL : addYtoBAL;
        return function(operation) {
            return [
                fetchOpcodeAndDecodeInstruction,
                fetchBAL,
                fetchBAH,
                function absoluteIndexedWrite1() {
                    addIndex();
                    fetchDataFromBA();
                    add1toBAHifBALCrossed();
                },
                function absoluteIndexedWrite2() {
                    operation();
                    writeDataToBA();
                },
                fetchNextOpcode
            ];
        };
    };

    var zeroPageIndexedWrite = function(index) {
        var addIndex = index === rX ? addXtoBAL : addYtoBAL;
        return function(operation) {
            return [
                fetchOpcodeAndDecodeInstruction,
                fetchBAL,                        // BAH will be zero
                fetchDataFromBA,
                function zeroPageIndexedWrite() {
                    addIndex();
                    operation();
                    writeDataToBA();
                },
                fetchNextOpcode
            ];
        };
    };

    var indirectYWrite = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchIAL,                           // IAH will be zero
            fetchBALFromIA,
            function indirectYWrite1() {
                add1toIAL();
                fetchBAHFromIA();
            },
            function indirectYWrite2() {
                addYtoBAL();
                fetchDataFromBA();
                add1toBAHifBALCrossed();
            },
            function indirectYWrite3() {
                operation();
                writeDataToBA();
            },
            fetchNextOpcode
        ];
    };


    var zeroPageReadModifyWrite = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchADL,                        // ADH will be zero
            fetchDataFromAD,
            writeDataToAD,
            function zeroPageReadModifyWrite() {
                operation();
                writeDataToAD();
            },
            fetchNextOpcode
        ];
    };

    var absoluteReadModifyWrite = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchADL,
            fetchADH,
            fetchDataFromAD,
            writeDataToAD,
            function absoluteReadModifyWrite() {
                operation();
                writeDataToAD();
            },
            fetchNextOpcode
        ];
    };

    var zeroPageIndexedReadModifyWrite = function(index) {
        var addIndex = index === rX ? addXtoBAL : addYtoBAL;
        return function(operation) {
            return [
                fetchOpcodeAndDecodeInstruction,
                fetchBAL,                        // BAH will be zero
                fetchDataFromBA,
                function zeroPageIndexedReadModifyWrite1() {
                    addIndex();
                    fetchDataFromBA();
                },
                writeDataToBA,
                function zeroPageIndexedReadModifyWrite2() {
                    operation();
                    writeDataToBA();
                },
                fetchNextOpcode
            ];
        };
    };

    var absoluteIndexedReadModifyWrite = function(index) {
        var addIndex = index === rX ? addXtoBAL : addYtoBAL;
        return function(operation) {
            return [
                fetchOpcodeAndDecodeInstruction,
                fetchBAL,
                fetchBAH,
                function absoluteIndexedReadModifyWrite1() {
                    addIndex();
                    fetchDataFromBA();
                    add1toBAHifBALCrossed();
                },
                fetchDataFromBA,
                writeDataToBA,
                function absoluteIndexedReadModifyWrite2() {
                    operation();
                    writeDataToBA();
                },
                fetchNextOpcode
            ];
        };
    };

    var indirectXReadModifyWrite = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchBAL,                        // BAH will be zero
            fetchDataFromBA,
            function indirectXReadModifyWrite1() {
                addXtoBAL();
                fetchADLFromBA();
            },
            function indirectXReadModifyWrite2() {
                add1toBAL();
                fetchADHFromBA();
            },
            fetchDataFromAD,
            writeDataToAD,
            function indirectXReadModifyWrite3() {
                operation();
                writeDataToAD();
            },
            fetchNextOpcode
        ];
    };

    var indirectYReadModifyWrite = function(operation) {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchIAL,                           // IAH will be zero
            fetchBALFromIA,
            function indirectYReadModifyWrite1() {
                add1toIAL();
                fetchBAHFromIA();
            },
            function indirectYReadModifyWrite2() {
                addYtoBAL();
                fetchDataFromBA();
                add1toBAHifBALCrossed();
            },
            fetchDataFromBA,
            writeDataToBA,
            function indirectYReadModifyWrite3() {
                operation();
                writeDataToBA();
            },
            fetchNextOpcode
        ];
    };


    // Instructions  ========================================================================================

    // Complete instruction set
    var opcodes =      new Array(256);
    var instructions = new Array(256);

    opcodes[0x00] = "BRK";  instructions[0x00] = newBRK();
    opcodes[0x01] = "ORA";  instructions[0x01] = newORA(indirectXRead);
    opcodes[0x02] = "uKIL"; instructions[0x02] = newuKIL();
    opcodes[0x03] = "uSLO"; instructions[0x03] = newuSLO(indirectXReadModifyWrite);
    opcodes[0x04] = "uNOP"; instructions[0x04] = newuNOP(zeroPageRead);
    opcodes[0x05] = "ORA";  instructions[0x05] = newORA(zeroPageRead);
    opcodes[0x06] = "ASL";  instructions[0x06] = newASL(zeroPageReadModifyWrite);
    opcodes[0x07] = "uSLO"; instructions[0x07] = newuSLO(zeroPageReadModifyWrite);
    opcodes[0x08] = "PHP";  instructions[0x08] = newPHP();
    opcodes[0x09] = "ORA";  instructions[0x09] = newORA(immediateRead);
    opcodes[0x0a] = "ASL";  instructions[0x0a] = newASL_ACC();
    opcodes[0x0b] = "uANC"; instructions[0x0b] = newuANC(immediateRead);
    opcodes[0x0c] = "uNOP"; instructions[0x0c] = newuNOP(absoluteRead);
    opcodes[0x0d] = "ORA";  instructions[0x0d] = newORA(absoluteRead);
    opcodes[0x0e] = "ASL";  instructions[0x0e] = newASL(absoluteReadModifyWrite);
    opcodes[0x0f] = "uSLO"; instructions[0x0f] = newuSLO(absoluteReadModifyWrite);
    opcodes[0x10] = "BPL";  instructions[0x10] = newBxx(bN, 0);                 // BPL
    opcodes[0x11] = "ORA";  instructions[0x11] = newORA(indirectYRead);
    opcodes[0x12] = "uKIL"; instructions[0x12] = newuKIL();
    opcodes[0x13] = "uSLO"; instructions[0x13] = newuSLO(indirectYReadModifyWrite);
    opcodes[0x14] = "uNOP"; instructions[0x14] = newuNOP(zeroPageIndexedRead(rX));
    opcodes[0x15] = "ORA";  instructions[0x15] = newORA(zeroPageIndexedRead(rX));
    opcodes[0x16] = "ASL";  instructions[0x16] = newASL(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0x17] = "uSLO"; instructions[0x17] = newuSLO(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0x18] = "CLC";  instructions[0x18] = newCLC();
    opcodes[0x19] = "ORA";  instructions[0x19] = newORA(absoluteIndexedRead(rY));
    opcodes[0x1a] = "uNOP"; instructions[0x1a] = newuNOP(implied);
    opcodes[0x1b] = "uSLO"; instructions[0x1b] = newuSLO(absoluteIndexedReadModifyWrite(rY));
    opcodes[0x1c] = "uNOP"; instructions[0x1c] = newuNOP(absoluteIndexedRead(rX));
    opcodes[0x1d] = "ORA";  instructions[0x1d] = newORA(absoluteIndexedRead(rX));
    opcodes[0x1e] = "ASL";  instructions[0x1e] = newASL(absoluteIndexedReadModifyWrite(rX));
    opcodes[0x1f] = "uSLO"; instructions[0x1f] = newuSLO(absoluteIndexedReadModifyWrite(rX));
    opcodes[0x20] = "JSR";  instructions[0x20] = newJSR();
    opcodes[0x21] = "AND";  instructions[0x21] = newAND(indirectXRead);
    opcodes[0x22] = "uKIL"; instructions[0x22] = newuKIL();
    opcodes[0x23] = "uRLA"; instructions[0x23] = newuRLA(indirectXReadModifyWrite);
    opcodes[0x24] = "BIT";  instructions[0x24] = newBIT(zeroPageRead);
    opcodes[0x25] = "AND";  instructions[0x25] = newAND(zeroPageRead);
    opcodes[0x26] = "ROL";  instructions[0x26] = newROL(zeroPageReadModifyWrite);
    opcodes[0x27] = "uRLA"; instructions[0x27] = newuRLA(zeroPageReadModifyWrite);
    opcodes[0x28] = "PLP";  instructions[0x28] = newPLP();
    opcodes[0x29] = "AND";  instructions[0x29] = newAND(immediateRead);
    opcodes[0x2a] = "ROL";  instructions[0x2a] = newROL_ACC();
    opcodes[0x2b] = "uANC"; instructions[0x2b] = newuANC(immediateRead);
    opcodes[0x2c] = "BIT";  instructions[0x2c] = newBIT(absoluteRead);
    opcodes[0x2d] = "AND";  instructions[0x2d] = newAND(absoluteRead);
    opcodes[0x2e] = "ROL";  instructions[0x2e] = newROL(absoluteReadModifyWrite);
    opcodes[0x2f] = "uRLA"; instructions[0x2f] = newuRLA(absoluteReadModifyWrite);
    opcodes[0x30] = "BMI";  instructions[0x30] = newBxx(bN, 1);                 // BMI
    opcodes[0x31] = "AND";  instructions[0x31] = newAND(indirectYRead);
    opcodes[0x32] = "uKIL"; instructions[0x32] = newuKIL();
    opcodes[0x33] = "uRLA"; instructions[0x33] = newuRLA(indirectYReadModifyWrite);
    opcodes[0x34] = "uNOP"; instructions[0x34] = newuNOP(zeroPageIndexedRead(rX));
    opcodes[0x35] = "AND";  instructions[0x35] = newAND(zeroPageIndexedRead(rX));
    opcodes[0x36] = "ROL";  instructions[0x36] = newROL(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0x37] = "uRLA"; instructions[0x37] = newuRLA(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0x38] = "SEC";  instructions[0x38] = newSEC();
    opcodes[0x39] = "AND";  instructions[0x39] = newAND(absoluteIndexedRead(rY));
    opcodes[0x3a] = "uNOP"; instructions[0x3a] = newuNOP(implied);
    opcodes[0x3b] = "uRLA"; instructions[0x3b] = newuRLA(absoluteIndexedReadModifyWrite(rY));
    opcodes[0x3c] = "uNOP"; instructions[0x3c] = newuNOP(absoluteIndexedRead(rX));
    opcodes[0x3d] = "AND";  instructions[0x3d] = newAND(absoluteIndexedRead(rX));
    opcodes[0x3e] = "ROL";  instructions[0x3e] = newROL(absoluteIndexedReadModifyWrite(rX));
    opcodes[0x3f] = "uRLA"; instructions[0x3f] = newuRLA(absoluteIndexedReadModifyWrite(rX));
    opcodes[0x40] = "RTI";  instructions[0x40] = newRTI();
    opcodes[0x41] = "EOR";  instructions[0x41] = newEOR(indirectXRead);
    opcodes[0x42] = "uKIL"; instructions[0x42] = newuKIL();
    opcodes[0x43] = "uSRE"; instructions[0x43] = newuSRE(indirectXReadModifyWrite);
    opcodes[0x44] = "uNOP"; instructions[0x44] = newuNOP(zeroPageRead);
    opcodes[0x45] = "EOR";  instructions[0x45] = newEOR(zeroPageRead);
    opcodes[0x46] = "LSR";  instructions[0x46] = newLSR(zeroPageReadModifyWrite);
    opcodes[0x47] = "uSRE"; instructions[0x47] = newuSRE(zeroPageReadModifyWrite);
    opcodes[0x48] = "PHA";  instructions[0x48] = mewPHA();
    opcodes[0x49] = "EOR";  instructions[0x49] = newEOR(immediateRead);
    opcodes[0x4a] = "LSR";  instructions[0x4a] = newLSR_ACC();
    opcodes[0x4b] = "uASR"; instructions[0x4b] = newuASR(immediateRead);
    opcodes[0x4c] = "JMP";  instructions[0x4c] = newJMP_ABS();
    opcodes[0x4d] = "EOR";  instructions[0x4d] = newEOR(absoluteRead);
    opcodes[0x4e] = "LSR";  instructions[0x4e] = newLSR(absoluteReadModifyWrite);
    opcodes[0x4f] = "uSRE"; instructions[0x4f] = newuSRE(absoluteReadModifyWrite);
    opcodes[0x50] = "BVC";  instructions[0x50] = newBxx(bV, 0);                 // BVC
    opcodes[0x51] = "EOR";  instructions[0x51] = newEOR(indirectYRead);
    opcodes[0x52] = "uKIL"; instructions[0x52] = newuKIL();
    opcodes[0x53] = "uSRE"; instructions[0x53] = newuSRE(indirectYReadModifyWrite);
    opcodes[0x54] = "uNOP"; instructions[0x54] = newuNOP(zeroPageIndexedRead(rX));
    opcodes[0x55] = "EOR";  instructions[0x55] = newEOR(zeroPageIndexedRead(rX));
    opcodes[0x56] = "LSR";  instructions[0x56] = newLSR(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0x57] = "uSRE"; instructions[0x57] = newuSRE(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0x58] = "CLI";  instructions[0x58] = newCLI();
    opcodes[0x59] = "EOR";  instructions[0x59] = newEOR(absoluteIndexedRead(rY));
    opcodes[0x5a] = "uNOP"; instructions[0x5a] = newuNOP(implied);
    opcodes[0x5b] = "uSRE"; instructions[0x5b] = newuSRE(absoluteIndexedReadModifyWrite(rY));
    opcodes[0x5c] = "uNOP"; instructions[0x5c] = newuNOP(absoluteIndexedRead(rX));
    opcodes[0x5d] = "EOR";  instructions[0x5d] = newEOR(absoluteIndexedRead(rX));
    opcodes[0x5e] = "LSR";  instructions[0x5e] = newLSR(absoluteIndexedReadModifyWrite(rX));
    opcodes[0x5f] = "uSRE"; instructions[0x5f] = newuSRE(absoluteIndexedReadModifyWrite(rX));
    opcodes[0x60] = "RTS";  instructions[0x60] = newRTS();
    opcodes[0x61] = "ADC";  instructions[0x61] = newADC(indirectXRead);
    opcodes[0x62] = "uKIL"; instructions[0x62] = newuKIL();
    opcodes[0x63] = "uRRA"; instructions[0x63] = newuRRA(indirectXReadModifyWrite);
    opcodes[0x64] = "uNOP"; instructions[0x64] = newuNOP(zeroPageRead);
    opcodes[0x65] = "ADC";  instructions[0x65] = newADC(zeroPageRead);
    opcodes[0x66] = "ROR";  instructions[0x66] = newROR(zeroPageReadModifyWrite);
    opcodes[0x67] = "uRRA"; instructions[0x67] = newuRRA(zeroPageReadModifyWrite);
    opcodes[0x68] = "PLA";  instructions[0x68] = newPLA();
    opcodes[0x69] = "ADC";  instructions[0x69] = newADC(immediateRead);
    opcodes[0x6a] = "ROR";  instructions[0x6a] = newROR_ACC();
    opcodes[0x6b] = "uARR"; instructions[0x6b] = newuARR(immediateRead);
    opcodes[0x6c] = "JMP";  instructions[0x6c] = newJMP_IND();
    opcodes[0x6d] = "ADC";  instructions[0x6d] = newADC(absoluteRead);
    opcodes[0x6e] = "ROR";  instructions[0x6e] = newROR(absoluteReadModifyWrite);
    opcodes[0x6f] = "uRRA"; instructions[0x6f] = newuRRA(absoluteReadModifyWrite);
    opcodes[0x70] = "BVS";  instructions[0x70] = newBxx(bV, 1);                 // BVS
    opcodes[0x71] = "ADC";  instructions[0x71] = newADC(indirectYRead);
    opcodes[0x72] = "uKIL"; instructions[0x72] = newuKIL();
    opcodes[0x73] = "uRRA"; instructions[0x73] = newuRRA(indirectYReadModifyWrite);
    opcodes[0x74] = "uNOP"; instructions[0x74] = newuNOP(zeroPageIndexedRead(rX));
    opcodes[0x75] = "ADC";  instructions[0x75] = newADC(zeroPageIndexedRead(rX));
    opcodes[0x76] = "ROR";  instructions[0x76] = newROR(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0x77] = "uRRA"; instructions[0x77] = newuRRA(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0x78] = "SEI";  instructions[0x78] = newSEI();
    opcodes[0x79] = "ADC";  instructions[0x79] = newADC(absoluteIndexedRead(rY));
    opcodes[0x7a] = "uNOP"; instructions[0x7a] = newuNOP(implied);
    opcodes[0x7b] = "uRRA"; instructions[0x7b] = newuRRA(absoluteIndexedReadModifyWrite(rY));
    opcodes[0x7c] = "uNOP"; instructions[0x7c] = newuNOP(absoluteIndexedRead(rX));
    opcodes[0x7d] = "ADC";  instructions[0x7d] = newADC(absoluteIndexedRead(rX));
    opcodes[0x7e] = "ROR";  instructions[0x7e] = newROR(absoluteIndexedReadModifyWrite(rX));
    opcodes[0x7f] = "uRRA"; instructions[0x7f] = newuRRA(absoluteIndexedReadModifyWrite(rX));
    opcodes[0x80] = "uNOP"; instructions[0x80] = newuNOP(immediateRead);
    opcodes[0x81] = "STA";  instructions[0x81] = newSTA(indirectXWrite);
    opcodes[0x82] = "uNOP"; instructions[0x82] = newuNOP(immediateRead);
    opcodes[0x83] = "uSAX"; instructions[0x83] = newuSAX(indirectXWrite);
    opcodes[0x84] = "STY";  instructions[0x84] = newSTY(zeroPageWrite);
    opcodes[0x85] = "STA";  instructions[0x85] = newSTA(zeroPageWrite);
    opcodes[0x86] = "STX";  instructions[0x86] = newSTX(zeroPageWrite);
    opcodes[0x87] = "uSAX"; instructions[0x87] = newuSAX(zeroPageWrite);
    opcodes[0x88] = "DEY";  instructions[0x88] = newDEY();
    opcodes[0x89] = "uNOP"; instructions[0x89] = newuNOP(immediateRead);
    opcodes[0x8a] = "TXA";  instructions[0x8a] = newTXA();
    opcodes[0x8b] = "uANE"; instructions[0x8b] = newuANE(immediateRead);
    opcodes[0x8c] = "STY";  instructions[0x8c] = newSTY(absoluteWrite);
    opcodes[0x8d] = "STA";  instructions[0x8d] = newSTA(absoluteWrite);
    opcodes[0x8e] = "STX";  instructions[0x8e] = newSTX(absoluteWrite);
    opcodes[0x8f] = "uSAX"; instructions[0x8f] = newuSAX(absoluteWrite);
    opcodes[0x90] = "BCC";  instructions[0x90] = newBxx(bC, 0);                 // BCC
    opcodes[0x91] = "STA";  instructions[0x91] = newSTA(indirectYWrite);
    opcodes[0x92] = "uKIL"; instructions[0x92] = newuKIL();
    opcodes[0x93] = "uSHA"; instructions[0x93] = newuSHA(indirectYWrite);
    opcodes[0x94] = "STY";  instructions[0x94] = newSTY(zeroPageIndexedWrite(rX));
    opcodes[0x95] = "STA";  instructions[0x95] = newSTA(zeroPageIndexedWrite(rX));
    opcodes[0x96] = "STX";  instructions[0x96] = newSTX(zeroPageIndexedWrite(rY));
    opcodes[0x97] = "uSAX"; instructions[0x97] = newuSAX(zeroPageIndexedWrite(rY));
    opcodes[0x98] = "TYA";  instructions[0x98] = newTYA();
    opcodes[0x99] = "STA";  instructions[0x99] = newSTA(absoluteIndexedWrite(rY));
    opcodes[0x9a] = "TXS";  instructions[0x9a] = newTXS();
    opcodes[0x9b] = "uSHS"; instructions[0x9b] = newuSHS(absoluteIndexedWrite(rY));
    opcodes[0x9c] = "uSHY"; instructions[0x9c] = newuSHY(absoluteIndexedWrite(rX));
    opcodes[0x9d] = "STA";  instructions[0x9d] = newSTA(absoluteIndexedWrite(rX));
    opcodes[0x9e] = "uSHX"; instructions[0x9e] = newuSHX(absoluteIndexedWrite(rY));
    opcodes[0x9f] = "uSHA"; instructions[0x9f] = newuSHA(absoluteIndexedWrite(rY));
    opcodes[0xa0] = "LDY";  instructions[0xa0] = newLDY(immediateRead);
    opcodes[0xa1] = "LDA";  instructions[0xa1] = newLDA(indirectXRead);
    opcodes[0xa2] = "LDX";  instructions[0xa2] = newLDX(immediateRead);
    opcodes[0xa3] = "uLAX"; instructions[0xa3] = newuLAX(indirectXRead);
    opcodes[0xa4] = "LDY";  instructions[0xa4] = newLDY(zeroPageRead);
    opcodes[0xa5] = "LDA";  instructions[0xa5] = newLDA(zeroPageRead);
    opcodes[0xa6] = "LDX";  instructions[0xa6] = newLDX(zeroPageRead);
    opcodes[0xa7] = "uLAX"; instructions[0xa7] = newuLAX(zeroPageRead);
    opcodes[0xa8] = "TAY";  instructions[0xa8] = newTAY();
    opcodes[0xa9] = "LDA";  instructions[0xa9] = newLDA(immediateRead);
    opcodes[0xaa] = "TAX";  instructions[0xaa] = newTAX();
    opcodes[0xab] = "uLXA"; instructions[0xab] = newuLXA(immediateRead);
    opcodes[0xac] = "LDY";  instructions[0xac] = newLDY(absoluteRead);
    opcodes[0xad] = "LDA";  instructions[0xad] = newLDA(absoluteRead);
    opcodes[0xae] = "LDX";  instructions[0xae] = newLDX(absoluteRead);
    opcodes[0xaf] = "uLAX"; instructions[0xaf] = newuLAX(absoluteRead);
    opcodes[0xb0] = "BCS";  instructions[0xb0] = newBxx(bC, 1);                 // BCS
    opcodes[0xb1] = "LDA";  instructions[0xb1] = newLDA(indirectYRead);
    opcodes[0xb2] = "uKIL"; instructions[0xb2] = newuKIL();
    opcodes[0xb3] = "uLAX"; instructions[0xb3] = newuLAX(indirectYRead);
    opcodes[0xb4] = "LDY";  instructions[0xb4] = newLDY(zeroPageIndexedRead(rX));
    opcodes[0xb5] = "LDA";  instructions[0xb5] = newLDA(zeroPageIndexedRead(rX));
    opcodes[0xb6] = "LDX";  instructions[0xb6] = newLDX(zeroPageIndexedRead(rY));
    opcodes[0xb7] = "uLAX"; instructions[0xb7] = newuLAX(zeroPageIndexedRead(rY));
    opcodes[0xb8] = "CLV";  instructions[0xb8] = newCLV();
    opcodes[0xb9] = "LDA";  instructions[0xb9] = newLDA(absoluteIndexedRead(rY));
    opcodes[0xba] = "TSX";  instructions[0xba] = newTSX();
    opcodes[0xbb] = "uLAS"; instructions[0xbb] = newuLAS(absoluteIndexedRead(rY));
    opcodes[0xbc] = "LDY";  instructions[0xbc] = newLDY(absoluteIndexedRead(rX));
    opcodes[0xbd] = "LDA";  instructions[0xbd] = newLDA(absoluteIndexedRead(rX));
    opcodes[0xbe] = "LDX";  instructions[0xbe] = newLDX(absoluteIndexedRead(rY));
    opcodes[0xbf] = "uLAX"; instructions[0xbf] = newuLAX(absoluteIndexedRead(rY));
    opcodes[0xc0] = "CPY";  instructions[0xc0] = newCPY(immediateRead);
    opcodes[0xc1] = "CMP";  instructions[0xc1] = newCMP(indirectXRead);
    opcodes[0xc2] = "uNOP"; instructions[0xc2] = newuNOP(immediateRead);
    opcodes[0xc3] = "uDCP"; instructions[0xc3] = newuDCP(indirectXReadModifyWrite);
    opcodes[0xc4] = "CPY";  instructions[0xc4] = newCPY(zeroPageRead);
    opcodes[0xc5] = "CMP";  instructions[0xc5] = newCMP(zeroPageRead);
    opcodes[0xc6] = "DEC";  instructions[0xc6] = newDEC(zeroPageReadModifyWrite);
    opcodes[0xc7] = "uDCP"; instructions[0xc7] = newuDCP(zeroPageReadModifyWrite);
    opcodes[0xc8] = "INY";  instructions[0xc8] = newINY();
    opcodes[0xc9] = "CMP";  instructions[0xc9] = newCMP(immediateRead);
    opcodes[0xca] = "DEX";  instructions[0xca] = newDEX();
    opcodes[0xcb] = "uSBX"; instructions[0xcb] = newuSBX(immediateRead);
    opcodes[0xcc] = "CPY";  instructions[0xcc] = newCPY(absoluteRead);
    opcodes[0xcd] = "CMP";  instructions[0xcd] = newCMP(absoluteRead);
    opcodes[0xce] = "DEC";  instructions[0xce] = newDEC(absoluteReadModifyWrite);
    opcodes[0xcf] = "uDCP"; instructions[0xcf] = newuDCP(absoluteReadModifyWrite);
    opcodes[0xd0] = "BNE";  instructions[0xd0] = newBxx(bZ, 0);                 // BNE
    opcodes[0xd1] = "CMP";  instructions[0xd1] = newCMP(indirectYRead);
    opcodes[0xd2] = "uKIL"; instructions[0xd2] = newuKIL();
    opcodes[0xd3] = "uDCP"; instructions[0xd3] = newuDCP(indirectYReadModifyWrite);
    opcodes[0xd4] = "uNOP"; instructions[0xd4] = newuNOP(zeroPageIndexedRead(rX));
    opcodes[0xd5] = "CMP";  instructions[0xd5] = newCMP(zeroPageIndexedRead(rX));
    opcodes[0xd6] = "DEC";  instructions[0xd6] = newDEC(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0xd7] = "uDCP"; instructions[0xd7] = newuDCP(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0xd8] = "CLD";  instructions[0xd8] = newCLD();
    opcodes[0xd9] = "CMP";  instructions[0xd9] = newCMP(absoluteIndexedRead(rY));
    opcodes[0xda] = "uNOP"; instructions[0xda] = newuNOP(implied);
    opcodes[0xdb] = "uDCP"; instructions[0xdb] = newuDCP(absoluteIndexedReadModifyWrite(rY));
    opcodes[0xdc] = "uNOP"; instructions[0xdc] = newuNOP(absoluteIndexedRead(rX));
    opcodes[0xdd] = "CMP";  instructions[0xdd] = newCMP(absoluteIndexedRead(rX));
    opcodes[0xde] = "DEC";  instructions[0xde] = newDEC(absoluteIndexedReadModifyWrite(rX));
    opcodes[0xdf] = "uDCP"; instructions[0xdf] = newuDCP(absoluteIndexedReadModifyWrite(rX));
    opcodes[0xe0] = "CPX";  instructions[0xe0] = newCPX(immediateRead);
    opcodes[0xe1] = "SBC";  instructions[0xe1] = newSBC(indirectXRead);
    opcodes[0xe2] = "uNOP"; instructions[0xe2] = newuNOP(immediateRead);
    opcodes[0xe3] = "uISB"; instructions[0xe3] = newuISB(indirectXReadModifyWrite);
    opcodes[0xe4] = "CPX";  instructions[0xe4] = newCPX(zeroPageRead);
    opcodes[0xe5] = "SBC";  instructions[0xe5] = newSBC(zeroPageRead);
    opcodes[0xe6] = "INC";  instructions[0xe6] = newINC(zeroPageReadModifyWrite);
    opcodes[0xe7] = "uISB"; instructions[0xe7] = newuISB(zeroPageReadModifyWrite);
    opcodes[0xe8] = "newINX";  instructions[0xe8] = newINX();
    opcodes[0xe9] = "SBC";  instructions[0xe9] = newSBC(immediateRead);
    opcodes[0xea] = "NOP";  instructions[0xea] = newNOP();
    opcodes[0xeb] = "SBC";  instructions[0xeb] = newSBC(immediateRead);
    opcodes[0xec] = "CPX";  instructions[0xec] = newCPX(absoluteRead);
    opcodes[0xed] = "SBC";  instructions[0xed] = newSBC(absoluteRead);
    opcodes[0xee] = "INC";  instructions[0xee] = newINC(absoluteReadModifyWrite);
    opcodes[0xef] = "uISB"; instructions[0xef] = newuISB(absoluteReadModifyWrite);
    opcodes[0xf0] = "BEQ";  instructions[0xf0] = newBxx(bZ, 1);                 // BEQ
    opcodes[0xf1] = "SBC";  instructions[0xf1] = newSBC(indirectYRead);
    opcodes[0xf2] = "uKIL"; instructions[0xf2] = newuKIL();
    opcodes[0xf3] = "uISB"; instructions[0xf3] = newuISB(indirectYReadModifyWrite);
    opcodes[0xf4] = "uNOP"; instructions[0xf4] = newuNOP(zeroPageIndexedRead(rX));
    opcodes[0xf5] = "SBC";  instructions[0xf5] = newSBC(zeroPageIndexedRead(rX));
    opcodes[0xf6] = "INC";  instructions[0xf6] = newINC(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0xf7] = "uISB"; instructions[0xf7] = newuISB(zeroPageIndexedReadModifyWrite(rX));
    opcodes[0xf8] = "SED";  instructions[0xf8] = newSED();
    opcodes[0xf9] = "SBC";  instructions[0xf9] = newSBC(absoluteIndexedRead(rY));
    opcodes[0xfa] = "uNOP"; instructions[0xfa] = newuNOP(implied);
    opcodes[0xfb] = "uISB"; instructions[0xfb] = newuISB(absoluteIndexedReadModifyWrite(rY));
    opcodes[0xfc] = "uNOP"; instructions[0xfc] = newuNOP(absoluteIndexedRead(rX));
    opcodes[0xfd] = "SBC";  instructions[0xfd] = newSBC(absoluteIndexedRead(rX));
    opcodes[0xfe] = "INC";  instructions[0xfe] = newINC(absoluteIndexedReadModifyWrite(rX));
    opcodes[0xff] = "uISB"; instructions[0xff] = newuISB(absoluteIndexedReadModifyWrite(rX));


    // Single Byte instructions

    function newASL_ACC() {
        return implied(function ASL_ACC() {
            setC(A > 127);
            A = (A << 1) & 255;
            setZ(A);
            setN(A);
        });
    }

    function newCLC() {
        return implied(function CLC() {
            C = 0;
        });
    }

    function newCLD() {
        return implied(function CLD() {
            D = 0;
        });
    }

    function newCLI() {
        return implied(function CLI() {
            I = 0;
        });
    }

    function newCLV() {
        return implied(function CLV() {
            V = 0;
        });
    }

    function newDEX() {
        return implied(function DEX() {
            X = (X - 1) & 255;
            setZ(X);
            setN(X);
        });
    }

    function newDEY() {
        return implied(function DEY() {
            Y = (Y - 1) & 255;
            setZ(Y);
            setN(Y);
        });
    }

    function newINX() {
        return implied(function INX() {
            X = (X + 1) & 255;
            setZ(X);
            setN(X);
        });
    }

    function newINY() {
        return implied(function INY() {
            Y = (Y + 1) & 255;
            setZ(Y);
            setN(Y);
        });
    }

    function newLSR_ACC() {
        return implied(function LSR_ACC() {
            C = A & 0x01;
            A >>>= 1;
            setZ(A);
            N = 0;
        });
    }

    function newNOP() {
        return implied(function NOP() {
            // nothing
        });
    }

    function newROL_ACC() {
        return implied(function ROL_ACC() {
            var newC = A > 127;
            A = ((A << 1) | C) & 255;
            setC(newC);
            setZ(A);
            setN(A);
        });
    }

    function newROR_ACC() {
        return implied(function ROR_ACC() {
            var newC = A & 0x01;
            A = (A >>> 1) | (C << 7);
            setC(newC);
            setZ(A);
            setN(A);
        });
    }

    function newSEC() {
        return implied(function SEC() {
            C = 1;
        });
    }

    function newSED() {
        return implied(function SED() {
            D = 1;
        });
    }

    function newSEI() {
        return implied(function SEI() {
            I = 1;
        });
    }

    function newTAX() {
        return implied(function TAX() {
            X = A;
            setZ(X);
            setN(X);
        });
    }

    function newTAY() {
        return implied(function TAY() {
            Y = A;
            setZ(Y);
            setN(Y);
        });
    }

    function newTSX() {
        return implied(function TSX() {
            X = SP;
            setZ(X);
            setN(X);
        });
    }

    function newTXA() {
        return implied(function TXA() {
            A = X;
            setZ(A);
            setN(A);
        });
    }

    function newTXS() {
        return implied(function TXS() {
            SP = X;
        });
    }

    function newTYA() {
        return implied(function TYA() {
            A = Y;
            setZ(A);
            setN(A);
        });
    }

    function newuKIL() {
        return [
            fetchOpcodeAndDecodeInstruction,
            function() {
                illegalOpcode("KIL/HLT/JAM");
            },
            function() {
                T--;        // Causes the processor to be stuck in this instruction forever
            }
        ];
    }

    function newuNOP(addressing) {
        return addressing(function uNOP() {
            illegalOpcode("NOP/DOP");
            // nothing
        });
    }


    // Internal Execution on Memory Data

    function newADC(addressing) {
        return addressing(function ADC() {
            if (D) {
                var operand = data;
                var AL = (A & 15) + (operand & 15) + C;
                if (AL > 9) { AL += 6; }
                var AH = ((A >> 4) + (operand >> 4) + (AL > 15)) << 4;
                setZ((A + operand + C) & 255);
                setN(AH);
                setV(((A ^AH) & ~(A ^ operand)) & 128);
                if (AH > 0x9f) { AH += 0x60; }
                setC(AH > 255);
                A = (AH | (AL & 15)) & 255;
            } else {
                var add = A + data + C;
                setC(add > 255);
                setV(((A ^ add) & (data ^ add)) & 0x80);
                A = add & 255;
                setZ(A);
                setN(A);
            }
        });
    }

    function newAND(addressing) {
        return addressing(function AND() {
            A &= data;
            setZ(A);
            setN(A);
        });
    }

    function newBIT(addressing) {
        return addressing(function BIT() {
            var par = data;
            setZ(A & par);
            setV(par & 0x40);
            setN(par);
        });
    }

    function newCMP(addressing) {
        return addressing(function CMP() {
            var val = (A - data) & 255;
            setC(A >= data);
            setZ(val);
            setN(val);
        });
    }

    function newCPX(addressing) {
        return addressing(function CPX() {
            var val = (X - data) & 255;
            setC(X >= data);
            setZ(val);
            setN(val);
        });
    }

    function newCPY(addressing) {
        return addressing(function CPY() {
            var val = (Y - data) & 255;
            setC(Y >= data);
            setZ(val);
            setN(val);
        });
    }

    function newEOR(addressing) {
        return addressing(function EOR() {
            A ^= data;
            setZ(A);
            setN(A);
        });
    }

    function newLDA(addressing) {
        return addressing(function LDA() {
            A = data;
            setZ(A);
            setN(A);
        });
    }

    function newLDX(addressing) {
        return addressing(function LDX() {
            X = data;
            setZ(X);
            setN(X);
        });
    }

    function newLDY(addressing) {
        return addressing(function LDY() {
            Y = data;
            setZ(Y);
            setN(Y);
        });
    }

    function newORA(addressing) {
        return addressing(function ORA() {
            A |= data;
            setZ(A);
            setN(A);
        });
    }

    function newSBC(addressing) {
        return addressing(function SBC() {
            if (D) {
                var operand = data;
                var AL = (A & 15) - (operand & 15) - (1-C);
                var AH = (A >> 4) - (operand >> 4) - (AL < 0);
                if (AL < 0) { AL -= 6; }
                if (AH < 0) { AH -= 6; }
                var sub = A - operand - (1-C);
                setC(~sub & 256);
                setV(((A ^ operand) & (A ^ sub)) & 128);
                setZ(sub & 255);
                setN(sub);
                A = ((AH << 4) | (AL & 15)) & 255;
            } else {
                operand = (~data) & 255;
                sub = A + operand + C;
                setC(sub > 255);
                setV(((A ^ sub) & (operand ^ sub) & 0x80));
                A = sub & 255;
                setZ(A);
                setN(A);
            }
        });
    }

    function newuANC(addressing) {
        return addressing(function uANC() {
            illegalOpcode("ANC");
            A &= data;
            setZ(A);
            N = C = (A & 0x080) ? 1 : 0;
        });
    }

    function newuANE(addressing) {
        return addressing(function uANE() {
            illegalOpcode("ANE");
            // Exact operation unknown. Do nothing
        });
    }

    function newuARR(addressing) {
        // Some sources say flags are affected per ROR, others say its more complex. The complex one is chosen
        return addressing(function uARR() {
            illegalOpcode("ARR");
            var val = A & data;
            var oldC = C ? 0x80 : 0;
            val = (val >>> 1) | oldC;
            A = val;
            setZ(val);
            setN(val);
            var comp = A & 0x60;
            if (comp == 0x60) 		{ C = 1; V = 0; }
            else if (comp == 0x00) 	{ C = 0; V = 0; }
            else if (comp == 0x20) 	{ C = 0; V = 1; }
            else if (comp == 0x40) 	{ C = 1; V = 1; }
        });
    }

    function newuASR(addressing) {
        return addressing(function uASR() {
            illegalOpcode("ASR");
            var val = A & data;
            C = (val & 0x01);		// bit 0
            val = val >>> 1;
            A = val;
            setZ(val);
            N = 0;
        });
    }

    function newuLAS(addressing) {
        return addressing(function uLAS() {
            illegalOpcode("LAS");
            var val = SP & data;
            A = val;
            X = val;
            SP = val;
            setZ(val);
            setN(val);
        });
    }

    function newuLAX(addressing) {
        return addressing(function uLAX() {
            illegalOpcode("LAX");
            var val = data;
            A = val;
            X = val;
            setZ(val);
            setN(val);
        });
    }

    function newuLXA(addressing) {
        return addressing(function uLXA() {
            // Some sources say its an OR with $EE then AND with IMM, others exclude the OR,
            // others exclude both the OR and the AND. Excluding just the OR...
            illegalOpcode("LXA");
            var val = A /* | 0xEE) */ & data;
            A = val;
            X = val;
            setZ(val);
            setN(val);
        });
    }

    function newuSBX(addressing) {
        return addressing(function uSBX() {
            illegalOpcode("SBX");
            var par = A & X;
            var val = data;
            var newX = (par - val) & 255;
            X = newX;
            setC(par >= val);
            setZ(newX);
            setN(newX);
        });
    }


    // Store operations

    function newSTA(addressing) {
        return addressing(function STA() {
            data = A;
        });
    }

    function newSTX(addressing) {
        return addressing(function STX() {
            data = X;
        });
    }

    function newSTY(addressing) {
        return addressing(function STY() {
            data = Y;
        });
    }

    function newuSAX(addressing) {
        return addressing(function uSAX() {
            // Some sources say it would affect N and Z flags, some say it wouldn't. Chose not to affect
            illegalOpcode("SAX");
            data = A & X;
        });
    }

    function newuSHA(addressing) {
        return addressing(function uSHA() {
            illegalOpcode("SHA");
            data = A & X & ((BA >>> 8) + 1) & 255; // A & X & (High byte of effective address + 1) !!!
            // data would also be stored BAH if page boundary is crossed. Unobservable, not needed here
        });
    }

    function newuSHS(addressing) {
        return addressing(function uSHS() {
            illegalOpcode("SHS");
            var val = A & X;
            SP = val;
            data = val & ((BA >>> 8) + 1) & 255; // A & X & (High byte of effective address + 1) !!!
            // data would also be stored BAH if page boundary is crossed. Unobservable, not needed here
        });
    }

    function newuSHX(addressing) {
        return addressing(function uSHX() {
            illegalOpcode("SHX");
            data = X & ((BA >>> 8) + 1) & 255; // X & (High byte of effective address + 1) !!!
            // data would also be stored BAH if page boundary is crossed. Unobservable, not needed here
        });
    }

    function newuSHY(addressing) {
        return addressing(function uSHY() {
            illegalOpcode("SHY");
            data = Y & ((BA >>> 8) + 1) & 255; // Y & (High byte of effective address + 1) !!!
            // data would also be stored BAH if page boundary is crossed. Unobservable, not needed here
        });
    }


    // Read-Modify-Write operations

    function newASL(addressing) {
        return addressing(function ASL() {
            setC(data > 127);
            var par = (data << 1) & 255;
            data = par;
            setZ(par);
            setN(par);
        });
    }

    function newDEC(addressing) {
        return addressing(function DEC() {
            var par = (data - 1) & 255;
            data = par;
            setZ(par);
            setN(par);
        });
    }

    function newINC(addressing) {
        return addressing(function INC() {
            var par = (data + 1) & 255;
            data = par;
            setZ(par);
            setN(par);
        });
    }

    function newLSR(addressing) {
        return addressing(function LSR() {
            C = data & 0x01;
            data >>>= 1;
            setZ(data);
            N = 0;
        });
    }

    function newROL(addressing) {
        return addressing(function ROL() {
            var newC = data > 127;
            var par = ((data << 1) | C) & 255;
            data = par;
            setC(newC);
            setZ(par);
            setN(par);
        });
    }

    function newROR(addressing) {
        return addressing(function ROR() {
            var newC = data & 0x01;
            var par = (data >>> 1) | (C << 7);
            data = par;
            setC(newC);
            setZ(par);
            setN(par);
        });
    }

    function newuDCP(addressing) {
        return addressing(function uDCP() {
            illegalOpcode("DCP");
            var par = (data - 1) & 255;
            data = par;
            par = A - par;
            setC(par >= 0);
            setZ(par);
            setN(par);
        });
    }

    function newuISB(addressing) {
        return addressing(function uISB() {
            illegalOpcode("ISB");
            data = (data + 1) & 255;    // ISB is the same as SBC but incs the operand first
            if (D) {
                var operand = data;
                var AL = (A & 15) - (operand & 15) - (1-C);
                var AH = (A >> 4) - (operand >> 4) - (AL < 0);
                if (AL < 0) { AL -= 6; }
                if (AH < 0) { AH -= 6; }
                var sub = A - operand - (1-C);
                setC(~sub & 256);
                setV(((A ^ operand) & (A ^ sub)) & 128);
                setZ(sub & 255);
                setN(sub);
                A = ((AH << 4) | (AL & 15)) & 255;
            } else {
                operand = (~data) & 255;
                sub = A + operand + C;
                setC(sub > 255);
                setV(((A ^ sub) & (operand ^ sub) & 0x80));
                A = sub & 255;
                setZ(A);
                setN(A);
            }
        });
    }

    function newuRLA(addressing) {
        return addressing(function uRLA() {
            illegalOpcode("RLA");
            var val = data;
            var oldC = C;
            setC(val & 0x80);		// bit 7 was set
            val = ((val << 1) | oldC) & 255;
            data = val;
            A &= val;
            setZ(val);              // TODO Verify. May be A instead of val in the flags setting
            setN(val);
        });
    }

    function newuRRA(addressing) {
        return addressing(function uRRA() {
            illegalOpcode("RRA");
            var val = data;
            var oldC = C ? 0x80 : 0;
            setC(val & 0x01);		// bit 0 was set
            val = (val >>> 1) | oldC;
            data = val;
            // RRA is the same as ADC from here
            if (D) {
                var operand = data;
                var AL = (A & 15) + (operand & 15) + C;
                if (AL > 9) { AL += 6; }
                var AH = ((A >> 4) + (operand >> 4) + (AL > 15)) << 4;
                setZ((A + operand + C) & 255);
                setN(AH);
                setV(((A ^AH) & ~(A ^ operand)) & 128);
                if (AH > 0x9f) { AH += 0x60; }
                setC(AH > 255);
                A = (AH | (AL & 15)) & 255;
            } else {
                var add = A + data + C;
                setC(add > 255);
                setV(((A ^ add) & (data ^ add)) & 0x80);
                A = add & 255;
                setZ(A);
                setN(A);
            }
        });
    }

    function newuSLO(addressing) {
        return addressing(function uSLO() {
            illegalOpcode("SLO");
            var val = data;
            setC(val & 0x80);		// bit 7 was set
            val = (val << 1) & 255;
            data = val;
            val = A | val;
            A = val;
            setZ(val);
            setN(val);
        });
    }

    function newuSRE(addressing) {
        return addressing(function uSRE() {
            illegalOpcode("SRE");
            var val = data;
            setC(val & 0x01);		// bit 0 was set
            val = val >>> 1;
            data = val;
            val = (A ^ val) & 255;
            A = val;
            setZ(val);
            setN(val);
        });
    }


    // Miscellaneous operations

    function mewPHA() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchOpcodeAndDiscard,
            function PHA() { pushToStack(A); },
            fetchNextOpcode
        ];
    }

    function newPHP() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchOpcodeAndDiscard,
            function PHP() { pushToStack(getStatusBits()); },
            fetchNextOpcode
        ];
    }

    function newPLA() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchOpcodeAndDiscard,
            peekFromStack,
            function PLA() {
                A = popFromStack();
                setZ(A);
                setN(A);
            },
            fetchNextOpcode
        ];
    }

    function newPLP() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchOpcodeAndDiscard,
            peekFromStack,
            function PLP() { setStatusBits(popFromStack()); },
            fetchNextOpcode
        ];
    }

    function newJSR() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchADL,
            peekFromStack,
            function JSR1() { pushToStack((PC >>> 8)  & 0xff); },
            function JSR2() { pushToStack(PC & 0xff); },
            fetchADH,
            function JSR3() { PC = AD; fetchNextOpcode(); }
        ];
    }

    function newBRK() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchDataFromImmediate,                 // For debugging purposes, use operand as an arg for BRK!
            function BRK1() {
                if (self.debug) self.breakpoint("BRK " + data);
                pushToStack((PC >>> 8) & 0xff);
            },
            function BRK2() { pushToStack(PC & 0xff); },
            function BRK3() { pushToStack(getStatusBits()); },
            function BRK4() { AD = bus.read(IRQ_VECTOR); },
            function BRK5() { AD |= bus.read(IRQ_VECTOR + 1) << 8; },
            function BRK6() { PC = AD; fetchNextOpcode(); }
        ];
    }

    function newRTI() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchOpcodeAndDiscard,
            peekFromStack,
            function RTI1() { setStatusBits(popFromStack()); },
            function RTI2() { AD = popFromStack(); },
            function RTI3() { AD |= popFromStack() << 8; },
            function RTI4() { PC = AD; fetchNextOpcode(); }
        ];
    }

    function newRTS() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchOpcodeAndDiscard,
            peekFromStack,
            function RTS1() { AD = popFromStack(); },
            function RTS2() { AD |= popFromStack() << 8; },
            function RTS3() { PC = AD; fetchDataFromImmediate(); },
            fetchNextOpcode
        ];
    }

    function newJMP_ABS() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchADL,
            fetchADH,
            function JMP_ABS() { PC = AD; fetchNextOpcode(); }
        ];
    }

    function newJMP_IND() {
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchIAL,                           // IAH will be zero
            fetchIAH,
            fetchBALFromIA,
            function JMP_IND1() {
                add1toIAL();
                fetchBAHFromIA();
            },
            function JMP_IND2() { PC = BA; fetchNextOpcode(); }
        ];
    }

    function newBxx(reg, cond) {
        var branchTaken;
        if      (reg === bZ) branchTaken = function BxxZ() { return Z === cond; };
        else if (reg === bN) branchTaken = function BxxN() { return N === cond; };
        else if (reg === bC) branchTaken = function BxxC() { return C === cond; };
        else                 branchTaken = function BxxV() { return V === cond; };
        return [
            fetchOpcodeAndDecodeInstruction,
            fetchBranchOffset,
            function Bxx1() {
                if (branchTaken()) {
                    fetchOpcodeAndDiscard();
                    addBranchOffsetToPCL();
                } else {
                    fetchNextOpcode();
                }
            },
            function Bxx2() {
                if(branchOffsetCrossAdjust) {
                    fetchOpcodeAndDiscard();
                    adjustPCHForBranchOffsetCross();
                } else {
                    fetchNextOpcode();
                }
            },
            fetchNextOpcode
        ];
    }


    // Savestate  -------------------------------------------

    this.saveState = function() {
		if (T == -1)
			throw "saveState failed: CPU is not initialized";
        return {
            PC: PC, A: A, X: X, Y: Y, SP: SP,
            N: N, V: V, D: D, I: I, Z: Z, C: C,
            T: T, o: opcode, R: RDY | 0,
            d: data, AD: AD, BA: BA, BC: BALCrossed | 0, IA: IA,
            bo: branchOffset, boa: branchOffsetCrossAdjust
        };
    };

    this.loadState = function(state) {
        PC = state.PC; A = state.A; X = state.X; Y = state.Y; SP = state.SP;
        N = state.N; V = state.V; D = state.D; I = state.I; Z = state.Z; C = state.C;
        T = state.T; opcode = state.o; RDY = !!state.R;
        data = state.d; AD = state.AD; BA = state.BA; BALCrossed = !!state.BC; IA = state.IA;
        branchOffset = state.bo; branchOffsetCrossAdjust = state.boa;

        instruction = instructions[opcode];
		if (instruction == null)
			throw "loadState failed: no instruction";
    };


    // Accessory methods

    this.toString = function() {
        return "CPU " +
            " PC: " + PC.toString(16) + "  op: " + opcode.toString() + "  T: " + T + "  data: " + data + "\n" +
            " A: " + A.toString(16) + "  X: " + X.toString(16) + "  Y: " + Y.toString(16) + "  SP: " + SP.toString(16) + "     " +
            "N" + N + "  " + "V" + V + "  " + "D" + D + "  " + "I" + I + "  " + "Z" + Z + "  " + "C" + C + "  ";
    };

    this.breakpoint = function(mes) {
        jt.Util.log(mes);
        if (this.trace) {
            var text = "CPU Breakpoint!  " + (mes ? "(" + mes + ")" : "") + "\n\n" + this.toString();
            jt.Util.message(text);
        }
    };

    //noinspection JSUnusedGlobalSymbols
    this.runCycles = function(cycles) {
        //noinspection JSUnresolvedVariable
        var start = performance.now();
        for (var i = 0; i < cycles; i++) {
            this.clockPulse();
        }
        //noinspection JSUnresolvedVariable
        var end = performance.now();
        jt.Util.message("Done running " + cycles + " cycles in " + (end - start) + " ms.");
    };

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Ram = function() {
"use strict";

    function init() {
        // RAM comes totally random at creation
        for (var i = bytes.length - 1; i >= 0; i--) {
            bytes[i] = (Math.random() * 256) | 0;
        }
    }

    this.powerOn = function() {
    };

    this.powerOff = function() {
    };

    this.read = function(address) {
        return bytes[address & ADDRESS_MASK];
    };

    this.write = function(address, val) {
        bytes[address & ADDRESS_MASK] = val;
    };

    this.powerFry = function() {
        var variance = 1 - FRY_VARIANCE + 2 * Math.random() * FRY_VARIANCE;
        // Randomly put "0" in bits on the ram
        var fryZeroBits = variance * FRY_ZERO_BITS;
        for (var i = 0; i < fryZeroBits; i++)
            bytes[(Math.random() * 128) | 0] &= ((Math.random() * 256) | 0);
        // Randomly put "1" in bits on the ram
        var fryOneBits = variance * FRY_ONE_BITS;
        for (i = 0; i < fryOneBits; i++)
            bytes[(Math.random() * 128) | 0] |= (0x01 << ((Math.random() * 8) | 0));
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            b: jt.Util.storeInt8BitArrayToStringBase64(bytes)
        };
    };

    this.loadState = function(state) {
        bytes = jt.Util.restoreStringBase64ToInt8BitArray(state.b, bytes);
    };


    // Variables  -------------------------------------------

    var bytes = new Array(128);

    var ADDRESS_MASK = 0x007f;

    var FRY_ZERO_BITS = 120;        // Quantity of bits to change
    var FRY_ONE_BITS = 25;
    var FRY_VARIANCE = 0.3;


    init();

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Pia = function() {
"use strict";

    this.powerOn = function() {
    };

    this.powerOff = function() {
    };

    this.clockPulse = function() {
        if (--timerCount <= 0)
            decrementTimer();
    };

    this.connectBus = function(aBus) {
        bus = aBus;
    };

    this.read = function(address) {
		this.read_recently = true;
        var reg = address & ADDRESS_MASK;
        if (reg === 0x04 || reg === 0x06) { readFromINTIM(); return INTIM; }
        if (reg === 0x00) return SWCHA;
        if (reg === 0x02) return SWCHB;
        if (reg === 0x01) return SWACNT;
        if (reg === 0x03) return SWBCNT;
        if (reg === 0x05 || reg === 0x07) return INSTAT;						// Undocumented

        // debugInfo(String.format("Invalid PIA read register address: %04x", address));
        return 0;
    };

    this.write = function(address, i) {
        var reg = address & ADDRESS_MASK;

        if (reg === 0x04) { TIM1T  = i; setTimerInterval(i, 1); return; }
        if (reg === 0x05) { TIM8T  = i; setTimerInterval(i, 8); return; }
        if (reg === 0x06) { TIM64T = i; setTimerInterval(i, 64); return; }
        if (reg === 0x07) { T1024T = i; setTimerInterval(i, 1024); return; }
        if (reg === 0x02) { swchbWrite(i); return; }
        if (reg === 0x03) { SWBCNT = i; debugInfo(">>>> Ineffective Write to PIA SWBCNT: " + i); return; }
        if (reg === 0x00) { debugInfo(">>>> Unsupported Write to PIA SWCHA: " + i); return; }	// Output to controllers not supported
        if (reg === 0x01) { debugInfo(">>>> Unsupported Write to PIA SWACNT " + i); return; }	// SWACNT configuration not supported

        // debugInfo(String.format("Invalid PIA write register address: %04x value %d", address, b));
        return 0;
    };

    var decrementTimer = function() {	// TODO There might be an accuracy problem here
        // Also check for overflow
        if (--INTIM < 0) {
            INSTAT |= 0xc0;								// Set bit 7 and 6 (Overflow since last INTIM read and since last TIMxx write)
            INTIM = 0xff;								// Wrap timer
            timerCount = currentTimerInterval = 1;		// If timer underflows, return to 1 cycle interval per specification
        } else
            timerCount = currentTimerInterval;
    };

    var setTimerInterval = function(value, interval) {
        INTIM = value;
        INSTAT &= 0x3f;				// Reset bit 7 and 6 (Overflow since last INTIM read and since last TIMxx write)
        timerCount = currentTimerInterval = lastSetTimerInterval = interval;
        decrementTimer();			// Timer immediately decrements after setting per specification
    };

    var readFromINTIM = function() {
        INSTAT &= 0xbf;									// Resets bit 6 (Overflow since last INTIM read)
        // If fastDecrement was active (currentTimerInterval == 1), interval always returns to set value after read per specification
        if (currentTimerInterval === 1)
            timerCount = currentTimerInterval = lastSetTimerInterval;
    };

    var swchbWrite = function(val) {
        // Only bits 2, 4 and 5 can be written
        SWCHB = (SWCHB & 0xcb) | (val & 34);
    };

    var debugInfo = function(str) {
        if (self.debug)
            jt.Util.log(str);
    };


    // Controls interface  -----------------------------------------

    var controls = jt.ConsoleControls;

    this.controlStateChanged = function(control, state) {
        switch (control) {
            case controls.JOY0_UP:        if (state) SWCHA &= 0xef; else SWCHA |= 0x10; return;	//  0 = Pressed
            case controls.JOY0_DOWN:      if (state) SWCHA &= 0xdf; else SWCHA |= 0x20; return;
            case controls.PADDLE1_BUTTON:
            case controls.JOY0_LEFT:      if (state) SWCHA &= 0xbf; else SWCHA |= 0x40; return;
            case controls.PADDLE0_BUTTON:
            case controls.JOY0_RIGHT:     if (state) SWCHA &= 0x7f; else SWCHA |= 0x80; return;
            case controls.JOY1_UP:        if (state) SWCHA &= 0xfe; else SWCHA |= 0x01; return;
            case controls.JOY1_DOWN:      if (state) SWCHA &= 0xfd; else SWCHA |= 0x02; return;
            case controls.JOY1_LEFT:      if (state) SWCHA &= 0xfb; else SWCHA |= 0x04; return;
            case controls.JOY1_RIGHT:     if (state) SWCHA &= 0xf7; else SWCHA |= 0x08; return;
            case controls.RESET:          if (state) SWCHB &= 0xfe; else SWCHB |= 0x01; return;
            case controls.SELECT:         if (state) SWCHB &= 0xfd; else SWCHB |= 0x02; return;
        }
        // Toggles
        if (!state) return;
        switch (control) {
            case controls.BLACK_WHITE: if ((SWCHB & 0x08) == 0) SWCHB |= 0x08; else SWCHB &= 0xf7;		//	0 = B/W, 1 = Color
                bus.getTia().getVideoOutput().showOSD((SWCHB & 0x08) != 0 ? "COLOR" : "B/W", true); return;
            case controls.DIFFICULTY0: if ((SWCHB & 0x40) == 0) SWCHB |= 0x40; else SWCHB &= 0xbf; 		//  0 = Beginner, 1 = Advanced
                bus.getTia().getVideoOutput().showOSD((SWCHB & 0x40) != 0 ? "P1 Expert" : "P1 Novice", true); return;
            case controls.DIFFICULTY1: if ((SWCHB & 0x80) == 0) SWCHB |= 0x80; else SWCHB &= 0x7f;		//  0 = Beginner, 1 = Advanced
                bus.getTia().getVideoOutput().showOSD((SWCHB & 0x80) != 0 ? "P2 Expert" : "P2 Novice", true); return;
        }
    };

    this.controlsStateReport = function(report) {
        //  Only Panel Controls are visible from outside
        report[controls.BLACK_WHITE] = (SWCHB & 0x08) === 0;
        report[controls.DIFFICULTY0] = (SWCHB & 0x40) !== 0;
        report[controls.DIFFICULTY1] = (SWCHB & 0x80) !== 0;
        report[controls.SELECT]      = (SWCHB & 0x02) === 0;
        report[controls.RESET]       = (SWCHB & 0x01) === 0;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            t:          timerCount,
            c:          currentTimerInterval,
            l:          lastSetTimerInterval,
            SA:         SWCHA,
            SAC:        SWACNT,
            SB:         SWCHB,
            SBC:        SWBCNT,
            IT:         INTIM,
            IS:         INSTAT,
            T1:         TIM1T,
            T8:         TIM8T,
            T6:         TIM64T,
            T2:         T1024T
        };
    };

    this.loadState = function(state) {
        timerCount           = state.t;
        currentTimerInterval = state.c;
        lastSetTimerInterval = state.l;
        // SWCHA           	 = state.SA;			// Do not load controls state
        SWACNT               = state.SAC;
        SWCHB                = state.SB;
        SWBCNT               = state.SBC;
        INTIM                = state.IT;
        INSTAT               = state.IS;
        TIM1T                = state.T1;
        TIM8T                = state.T8;
        TIM64T               = state.T6;
        T1024T               = state.T2;
    };


    // State Variables ----------------------------------------------

    this.debug = false;
	this.read_recently = false;

    var bus;

    var timerCount = 1024;				// Start with the largest timer interval
    var currentTimerInterval = 1024;
    var lastSetTimerInterval = 1024;


    // Registers ----------------------------------------------------

    var SWCHA=      					// 11111111  Port A; input or output  (read or write)
        0xff;						    // All directions of both controllers OFF
    var SWACNT = 0;						// 11111111  Port A DDR, 0=input, 1=output
    var SWCHB = 						// 11..1.11  Port B; console switches (should be read only but unused bits can be written and read)
        0x0b;  						    // Reset OFF; Select OFF; B/W OFF; Difficult A/B OFF (Amateur)
    var SWBCNT = 0; 					// 11111111  Port B DDR (hard wired as input)
    var INTIM =   						// 11111111  Timer output (read only)
        (Math.random() * 256) | 0 ;     // Some random value. Games use this at startup to seed random number generation
    var INSTAT = 0;     	            // 11......  Timer Status (read only, undocumented)
    var TIM1T  = 0;  	    			// 11111111  set 1 clock interval (838 nsec/interval)
    var TIM8T  = 0;  					// 11111111  set 8 clock interval (6.7 usec/interval)
    var TIM64T = 0; 					// 11111111  set 64 clock interval (53.6 usec/interval)
    var T1024T = 0; 					// 11111111  set 1024 clock interval (858.2 usec/interval)


    // Constants  ----------------------------------------------------

    var ADDRESS_MASK = 0x0007;

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

(function() {
"use strict";

    var ntscRGB = [
        0x000000,		// 00
        0x404040,		// 02
        0x6c6c6c,		// 04
        0x909090,		// 06
        0xb0b0b0,		// 08
        0xc8c8c8,		// 0A
        0xdcdcdc,		// 0C
        0xf4f4f4,		// 0E
        0x004444,		// 10
        0x106464,		// 12
        0x248484,		// 14
        0x34a0a0,		// 16
        0x40b8b8,		// 18
        0x50d0d0,		// 1A
        0x5ce8e8,		// 1C
        0x68fcfc,		// 1E
        0x002870,		// 20
        0x144484,		// 22
        0x285c98,		// 24
        0x3c78ac,		// 26
        0x4c8cbc,		// 28
        0x5ca0cc,		// 2A
        0x68b4dc,		// 2C
        0x78c8ec,		// 2E
        0x001884,		// 30
        0x183498,		// 32
        0x3050ac,		// 34
        0x4868c0,		// 36
        0x5c80d0,		// 38
        0x7094e0,		// 3A
        0x80a8ec,		// 3C
        0x94bcfc,		// 3E
        0x000088,		// 40
        0x20209c,		// 42
        0x3c3cb0,		// 44
        0x5858c0,		// 46
        0x7070d0,		// 48
        0x8888e0,		// 4A
        0xa0a0ec,		// 4C
        0xb4b4fc,		// 4E
        0x5c0078,		// 50
        0x74208c,		// 52
        0x883ca0,		// 54
        0x9c58b0,		// 56
        0xb070c0,		// 58
        0xc084d0,		// 5A
        0xd09cdc,		// 5C
        0xe0b0ec,		// 5E
        0x780048,		// 60
        0x902060,		// 62
        0xa43c78,		// 64
        0xb8588c,		// 66
        0xcc70a0,		// 68
        0xdc84b4,		// 6A
        0xec9cc4,		// 6C
        0xfcb0d4,		// 6E
        0x840014,		// 70
        0x982030,		// 72
        0xac3c4c,		// 74
        0xc05868,		// 76
        0xd0707c,		// 78
        0xe08894,		// 7A
        0xeca0a8,		// 7C
        0xfcb4bc,		// 7E
        0x880000,		// 80
        0x9c201c,		// 82
        0xb04038,		// 84
        0xc05c50,		// 86
        0xd07468,		// 88
        0xe08c7c,		// 8A
        0xeca490,		// 8C
        0xfcb8a4,		// 8E
        0x7c1800,		// 90
        0x90381c,		// 92
        0xa85438,		// 94
        0xbc7050,		// 96
        0xcc8868,		// 98
        0xdc9c7c,		// 9A
        0xecb490,		// 9C
        0xfcc8a4,		// 9E
        0x5c2c00,		// A0
        0x784c1c,		// A2
        0x906838,		// A4
        0xac8450,		// A6
        0xc09c68,		// A8
        0xd4b47c,		// AA
        0xe8cc90,		// AC
        0xfce0a4,		// AE
        0x2c3c00,		// B0
        0x485c1c,		// B2
        0x647c38,		// B4
        0x809c50,		// B6
        0x94b468,		// B8
        0xacd07c,		// BA
        0xc0e490,		// BC
        0xd4fca4,		// BE
        0x003c00,		// C0
        0x205c20,		// C2
        0x407c40,		// C4
        0x5c9c5c,		// C6
        0x74b474,		// C8
        0x8cd08c,		// CA
        0xa4e4a4,		// CC
        0xb8fcb8,		// CE
        0x003814,		// D0
        0x1c5c34,		// D2
        0x387c50,		// D4
        0x50986c,		// D6
        0x68b484,		// D8
        0x7ccc9c,		// DA
        0x90e4b4,		// DC
        0xa4fcc8,		// DE
        0x00302c,		// E0
        0x1c504c,		// E2
        0x347068,		// E4
        0x4c8c84,		// E6
        0x64a89c,		// E8
        0x78c0b4,		// EA
        0x88d4cc,		// EC
        0x9cece0,		// EE
        0x002844,		// F0
        0x184864,		// F2
        0x306884,		// F4
        0x4484a0,		// F6
        0x589cb8,		// F8
        0x6cb4d0,		// FA
        0x7ccce8,		// FC
        0x8ce0fc		// FE
    ];

    var palRGB = [
        0x000000,		// 00
        0x282828,		// 02
        0x505050,		// 04
        0x747474,		// 06
        0x949494,		// 08
        0xb4b4b4,		// 0A
        0xd0d0d0,		// 0C
        0xf1f1f1,		// 0E
        0x000000,		// 10
        0x282828,		// 12
        0x505050,		// 14
        0x747474,		// 16
        0x949494,		// 18
        0xb4b4b4,		// 1A
        0xd0d0d0,		// 1C
        0xf1f1f1,		// 1E
        0x005880,		// 20
        0x207094,		// 22
        0x3c84a8,		// 24
        0x589cbc,		// 26
        0x70accc,		// 28
        0x84c0dc,		// 2A
        0x9cd0ec,		// 2C
        0xb0e0fc,		// 2E
        0x005c44,		// 30
        0x20785c,		// 32
        0x3c9074,		// 34
        0x58ac8c,		// 36
        0x70c0a0,		// 38
        0x84d4b0,		// 3A
        0x9ce8c4,		// 3C
        0xb0fcd4,		// 3E
        0x003470,		// 40
        0x205088,		// 42
        0x3C68A0,		// 44
        0x5884B4,		// 46
        0x7098C8,		// 48
        0x84ACDC,		// 4A
        0x9CC0EC,		// 4C
        0xB0D4FC,		// 4E
        0x146400,		// 50
        0x348020,		// 52
        0x50983C,		// 54
        0x6CB058,		// 56
        0x84C470,		// 58
        0x9CD884,		// 5A
        0xB4E89C,		// 5C
        0xC8FCB0,		// 5E
        0x140070,		// 60
        0x342088,		// 62
        0x503CA0,		// 64
        0x6C58B4,		// 66
        0x8470C8,		// 68
        0x9C84DC,		// 6A
        0xB49CEC,		// 6C
        0xC8B0FC,		// 6E
        0x5C5C00,		// 70
        0x747420,		// 72
        0x8C8C3C,		// 74
        0xA4A458,		// 76
        0xB8B870,		// 78
        0xC8C884,		// 7A
        0xDCDC9C,		// 7C
        0xECECB0,		// 7E
        0x5C0070,		// 80
        0x742084,		// 82
        0x883C94,		// 84
        0x9C58A8,		// 86
        0xB070B4,		// 88
        0xC084C4,		// 8A
        0xD09CD0,		// 8C
        0xE0B0E0,		// 8E
        0x703C00,		// 90
        0x88581C,		// 92
        0xA07438,		// 94
        0xB48C50,		// 96
        0xC8A468,		// 98
        0xDCB87C,		// 9A
        0xECCC90,		// 9C
        0xFCE0A4,		// 9E
        0x700058,		// A0
        0x88206C,		// A2
        0xA03C80,		// A4
        0xB45894,		// A6
        0xC870A4,		// A8
        0xDC84B4,		// AA
        0xEC9CC4,		// AC
        0xFCB0D4,		// AE
        0x702000,		// B0
        0x883C1C,		// B2
        0xA05838,		// B4
        0xB47450,		// B6
        0xC88868,		// B8
        0xDCA07C,		// BA
        0xECB490,		// BC
        0xFCC8A4,		// BE
        0x80003C,		// C0
        0x942054,		// C2
        0xA83C6C,		// C4
        0xBC5880,		// C6
        0xCC7094,		// C8
        0xDC84A8,		// CA
        0xEC9CB8,		// CC
        0xFCB0C8,		// CE
        0x880000,		// D0
        0x9C2020,		// D2
        0xB03C3C,		// D4
        0xC05858,		// D6
        0xD07070,		// D8
        0xE08484,		// DA
        0xEC9C9C,		// DC
        0xFCB0B0,		// DE
        0x000000,		// E0
        0x282828,		// E2
        0x505050,		// E4
        0x747474,		// E6
        0x949494,		// E8
        0xB4B4B4,		// EA
        0xD0D0D0,		// EC
        0xF1F1F1,		// EE
        0x000000,		// F0
        0x282828,		// F2
        0x505050,		// F4
        0x747474,		// F6
        0x949494,		// F8
        0xB4B4B4,		// FA
        0xD0D0D0,		// FC
        0xF1F1F1		// FE
    ];

    var ntscPalette = new Uint32Array(256);
    var palPalette = new Uint32Array(256);
    for (var i = 0, len = ntscRGB.length; i < len; i++) {
        // Adds 100% alpha for ARGB use
        ntscPalette[i*2] = ntscPalette[i*2+1] = ntscRGB[i] + 0xff000000;
        palPalette[i*2] = palPalette[i*2+1] = palRGB[i] + 0xff000000;
    }
    // ntscPalette[0] = ntscPalette[1] = palPalette[0] = palPalette[1] = 0;	// Full transparency for blacks. Needed for CRT emulation modes

    // Clean up
    ntscRGB = palRGB = undefined;

    jt.TiaPalettes = {
        NTSC: ntscPalette,
        PAL: palPalette
    };

})();


// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.TiaAudio = function() {
"use strict";

    var self = this;

    this.connectAudioSocket = function(pAudioSocket) {
        audioSocket = pAudioSocket;
    };

    this.cartridgeInserted = function(pCartridge) {
        if (pCartridge && pCartridge.needsAudioClock()) cartridgeNeedsAudioClock = pCartridge;
        else cartridgeNeedsAudioClock = null;
    };

    this.audioClockPulse = function() {
        audioSocket.audioClockPulse();
    };

    this.getChannel0 = function() {
        return channel0;
    };

    this.getChannel1 = function() {
        return channel1;
    };

    this.powerOn = function() {
        this.reset();
        connectAudio();
    };

    this.powerOff = function() {
        disconnectAudio();
    };

    this.reset = function() {
        channel0.setVolume(0);
        channel1.setVolume(0);
        lastSample = 0;
    };

    this.nextSample = function() {
        if (cartridgeNeedsAudioClock) cartridgeNeedsAudioClock.audioClockPulse();

        var mixedSample = channel0.nextSample() - channel1.nextSample();

        // Add a little damper effect to round the edges of the square wave
        if (mixedSample !== lastSample) {
            mixedSample = (mixedSample * 9 + lastSample) / 10;
            lastSample = mixedSample;
        }

        return mixedSample;
    };

    function connectAudio() {
        if (!audioSignal) audioSignal = new jt.AudioSignal("TiaAudio", self, SAMPLE_RATE, VOLUME);
        audioSocket.connectAudioSignal(audioSignal);
    }

    function disconnectAudio() {
        if (audioSignal) audioSocket.disconnectAudioSignal(audioSignal);
    }


    var audioSocket;
    var audioSignal;
    var cartridgeNeedsAudioClock;

    var lastSample = 0;

    var channel0 = new jt.TiaAudioChannel();
    var channel1 = new jt.TiaAudioChannel();

    var VOLUME = 0.4;
    var SAMPLE_RATE = 31440;

};


// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.TiaAudioChannel = function() {
"use strict";

    this.nextSample = function() {				// Range 0 - 1
        if (--dividerCountdown <= 0) {
            dividerCountdown += divider;
            currentSample = nextSampleForControl();
        }

        return currentSample === 1 ? volume : 0;
    };

    this.setVolume = function(newVolume) {
        volume = newVolume / MAX_VOLUME;
    };

    this.setDivider = function(newDivider) {
        if (divider === newDivider) return;

        dividerCountdown = (dividerCountdown / divider) * newDivider;
        divider = newDivider;
    };

    this.setControl = function(newControl) {
        if (control === newControl) return;

        control = newControl;

        if (newControl === 0x00 || newControl === 0x0b)
            nextSampleForControl = nextSilence;						// Silence  ("set to 1" per specification)
        else if (newControl === 0x01)
            nextSampleForControl = nextPoly4;						// 4 bit poly
        else if (newControl === 0x02)
            nextSampleForControl = nextDiv15Poly4;	                // div 15 > 4 bit poly
        else if (newControl === 0x03)
            nextSampleForControl = nextPoly5Poly4;                   // 5 bit poly > 4 bit poly
        else if (newControl === 0x04 || newControl === 0x05)
            nextSampleForControl = nextTone2;						// div 2 pure tone
        else if (newControl === 0x06 || newControl === 0x0a)
            nextSampleForControl = nextTone31;						// div 31 pure tone (18 high, 13 low)
        else if (newControl === 0x07 || newControl === 0x09)
            nextSampleForControl = nextPoly5;						// 5 bit poly
        else if (newControl === 0x08)
            nextSampleForControl = nextPoly9;						// 9 bit poly
        else if (newControl === 0x0c || newControl === 0x0d)
            nextSampleForControl = nextTone6;						// div 6 pure tone (3 high, 3 low)
        else if (newControl === 0x0e)
            nextSampleForControl = nextDiv93;                        // div 93 pure tone	(31 tone each 3)
        else if (newControl === 0x0f)
            nextSampleForControl = nextPoly5Div6;				    // 5 bit poly div 6 (poly 5 each 3)
        else
            nextSampleForControl = nextSilence;						// default
    };

    var nextSilence = function() {
        return 1;
    };

    var currentPoly4 = function() {
        return POLY4_STREAM[poly4Count];
    };

    var nextPoly4 = function() {
        if (++poly4Count === 15)
            poly4Count = 0;
        return POLY4_STREAM[poly4Count];
    };

    var nextPoly5 = function() {
        if (++poly5Count === 31)
            poly5Count = 0;
        return POLY5_STREAM[poly5Count];
    };

    var nextPoly9 = function() {
        var carry = poly9 & 0x01;					// bit 0
        var push = ((poly9 >> 4) ^ carry) & 0x01;	// bit 4 XOR bit 0
        poly9 = poly9 >>> 1;						// shift right
        if (push === 0)								// set bit 8 = push
            poly9 &= 0x0ff;
        else
            poly9 |= 0x100;
        return carry;
    };

    var nextTone2 = function() {
        if (divider === 1)                          // Divider 1 and Tone2 should never produce sound
            return 1;
        else
            return tone2 = tone2 ? 0 : 1;
    };

    var currentTone6 = function() {
        return tone6;
    };

    var nextTone6 = function() {
        if (--tone6Countdown === 0) {
            tone6Countdown = 3;
            tone6 = tone6 ? 0 : 1;
        }
        return tone6;
    };

    var currentTone31 = function() {
        return TONE31_STREAM[tone31Count];
    };

    var nextTone31 = function() {
        if (++tone31Count === 31)
            tone31Count = 0;
        return TONE31_STREAM[tone31Count];
    };

    var nextDiv15Poly4 = function() {
        return currentTone31() !== nextTone31() ? nextPoly4() : currentPoly4();
    };

    var nextPoly5Poly4 = function() {
        return nextPoly5() ? nextPoly4() : currentPoly4();
    };

    var nextDiv93 = function() {
        return currentTone31() != nextTone31() ? nextTone6() : currentTone6();
    };

    var nextPoly5Div6 = function() {
        return nextPoly5() ? nextTone6() : currentTone6();
    };

    var nextSampleForControl = nextSilence;


    var volume = 0;					// 0 - 1
    var control = 0;				// 0-f
    var divider = 1;				// Changes to dividers will only be reflected at the next countdown cycle
    var dividerCountdown = 1;

    var currentSample = 0;

    var tone2 = 1;

    var tone6 = 1;
    var tone6Countdown = 3;

    var poly9 = 0x1ff;

    var poly4Count = 14;
    var POLY4_STREAM = [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0 ];

    var poly5Count = 30;
    var POLY5_STREAM = [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0];

    var tone31Count = 30;
    var TONE31_STREAM = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var MAX_VOLUME = 15;

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// TODO NUSIZ during scan with HMOVE not correct. For now kill the scan in progress
// TODO Starfield Effect not implemented
// TODO AUTO Video Standard Detection too aggressive?
// TODO Vsynch lines count affects vertical position!

jt.Tia = function(pCpu, pPia, audioSocket) {
    "use strict";

    var self = this;

    function init() {
        generateObjectsLineSprites();
        generateObjectsCopiesOffsets();
    }

    this.powerOn = function() {
        jt.Util.arrayFill(linePixels, VBLANK_COLOR);
        jt.Util.arrayFill(debugPixels, 0);
        audioSignal.getChannel0().setVolume(0);
        audioSignal.getChannel1().setVolume(0);
        initLatchesAtPowerOn();
        hMoveLateHit = false;
        changeClock = changeClockPrevLine = -1;
        audioSignal.powerOn();
        powerOn = true;
    };

    this.powerOff = function() {
        powerOn = false;
        // Let monitors know that the signals are off
        videoSignal.signalOff();
        audioSignal.powerOff();
    };

    this.frame = function() {
        do {
            // Begin line
            clock = 0;
            changeClock = -1;
            renderClock = HBLANK_DURATION;

            if (debug) {
                if (debugLevel >= 4) jt.Util.arrayFill(linePixels, 0xff000000);     // clear line
                else if (debugLevel >= 2 && debugLevel < 4) changeClock = 0;        // force entire line render
            }

            checkLateHMOVE();
            // Send the first clock/3 pulse to the CPU and PIA, perceived by TIA at clock 0 before releasing halt, then release halt
            bus.clockPulse();
            cpu.setRDY(true);
            for (var x = 0; x < 22; ++x) { clock += 3; bus.clockPulse(); }      // TIA 3..66     CPU 1..22
            updateExtendedHBLANK();
            for (var y = 0; y < 27; ++y) { clock += 3; bus.clockPulse(); }      // TIA 69..147   CPU 23..49
            audioSignal.audioClockPulse();
            endObjectsAltStatusMidLine();
            for (var z = 0; z < 26; ++z) { clock += 3; bus.clockPulse(); }      // TIA 150..225  CPU 50..75
            audioSignal.audioClockPulse();
            finishLine();
        } while(!videoSignal.nextLine(linePixels, vSyncOn));

        videoSignal.finishFrame();
    };

    this.connectBus = function(aBus) {
        bus = aBus;
    };

    this.getVideoOutput = function() {
        return videoSignal;
    };

    this.getAudioOutput = function() {
        return audioSignal;
    };

    this.setVideoStandard = function(standard) {
        videoSignal.setVideoStandard(standard);
        palette = jt.TiaPalettes[standard.name];
    };

    this.debug = function(level) {
        debugLevel = level > 4 ? 0 : level;
        debug = debugLevel !== 0;
        videoSignal.showOSD(debug ? "Debug Level " + debugLevel : "Debug OFF", true);
        //cpu.debug = debug;
        pia.debug = debug;
        if (debug) debugSetColors();
        else debugRestoreColors();
    };

    this.getDebugNoCollisions = function() {
        return debugNoCollisions;
    };

    this.read = function(address) {
        switch(address & READ_ADDRESS_MASK) {
            // P0P1, P0M0, P0M1, P0PF,     P0BL, P1M0, P1M1, P1PF,     P1BL, M0M1, M0PF, M0BL,     M1PF, M1BL, PFBL, XXXX
            //  15    14    13    12        11    10    9     8         7     6     5     4         3     2     1     0

            case 0x00: updateToClock(); return ((collisions & 0x0400) >> 3) | ((collisions & 0x4000) >> 8);          // CXM0P
            case 0x01: updateToClock(); return ((collisions & 0x2000) >> 6) | ((collisions & 0x0200) >> 3);          // CXM1P
            case 0x02: updateToClock(); return ((collisions & 0x1000) >> 5) | ((collisions & 0x0800) >> 5);          // CXP0FB
            case 0x03: updateToClock(); return ((collisions & 0x0100) >> 1) | ((collisions & 0x0080) >> 1);          // CXP1FB
            case 0x04: updateToClock(); return ((collisions & 0x0020) << 2) | ((collisions & 0x0010) << 2);          // CXM0FB
            case 0x05: updateToClock(); return ((collisions & 0x0008) << 4) | ((collisions & 0x0004) << 4);          // CXM1FB
            case 0x06: updateToClock(); return ((collisions & 0x0002) << 6);                                         // CXBLPF
            case 0x07: updateToClock(); return ((collisions & 0x8000) >> 8) | (collisions & 0x0040);                 // CXPPMM

            case 0x08: return INPT0;
            case 0x09: return INPT1;
            case 0x0A: return INPT2;
            case 0x0B: return INPT3;
            case 0x0C: return INPT4;
            case 0x0D: return INPT5;
            default:   return 0;
        }
    };

    this.write = function(address, i) {
        switch (address & WRITE_ADDRESS_MASK) {
            // VSync, VBlank and HSync
            case 0x00: vSyncSet(i); return;
            case 0x01: vBlankSet(i); return;
            case 0x02: cpu.setRDY(false); if (debug) debugPixel(DEBUG_WSYNC_COLOR); return; 	       // <STROBE> Halts the CPU until the next HBLANK

            // Playfield
            case 0x09: if (COLUBK !== i && !debug) { changeAtClock(); COLUBK = i; playfieldBackground = palette[i]; } return;
            case 0x0D: if (PF0 !== (i & 0xf0)) { changePlayfieldAtClock(); PF0 = i & 0xf0; playfieldUpdateSprite(); } return;
            case 0x0E: if (PF1 !== i) { changePlayfieldAtClock(); PF1 = i; playfieldUpdateSprite(); } return;
            case 0x0F: if (PF2 !== i) { changePlayfieldAtClock(); PF2 = i; playfieldUpdateSprite(); } return;

            // Playfield & Ball
            case 0x08: if (COLUPF !== i && !debug) { if ((playfieldEnabled && !playfieldScoreMode) || ballEnabled) changeAtClock(); COLUPF = i; ballColor = palette[i]; if (!playfieldScoreMode) playfieldColor = playfieldLeftColor = playfieldRightColor = ballColor } return;
            case 0x0A: if (CTRLPF !== i) { playfieldSetShape(i); } return;

            // Ball
            case 0x14: hitRESBL(); return;
            case 0x1F: if (ENABLd !== (i & 0x02)) { ENABLd = i & 0x02; if (!VDELBL) { changeAtClock(); ballSetEnabled(ENABLd); } } return;
            case 0x27: if (VDELBL !== (i  & 1)) { VDELBL = i & 1; if (ENABL !== ENABLd) { changeAtClock(); ballSetEnabled(VDELBL ? ENABL : ENABLd); } } return;

            // Player0
            case 0x04: player0SetShape(i); return;
            case 0x06: if (COLUP0 !== i && !debug) { COLUP0 = i; if (player0Enabled || missile0Enabled || (playfieldEnabled && playfieldScoreMode)) changeAtClock(); player0Color = missile0Color = palette[i]; if (playfieldScoreMode) playfieldLeftColor = player0Color; } return;
            case 0x0B: if (REFP0 !== ((i >> 3) & 1)) { REFP0 = (i >> 3) & 1; player0UpdateSprite(0); } return;
            case 0x10: hitRESP0(); return;
            case 0x1B: player0SetSprite(i); return;
            case 0x25: if (VDELP0 !== (i  & 1)) { VDELP0 = i & 1; if (GRP0 !== GRP0d) player0UpdateSprite(0); } return;

            // Player1
            case 0x05: player1SetShape(i); return;
            case 0x07: if (COLUP1 !== i && !debug) { COLUP1 = i; if (player1Enabled || missile1Enabled || (playfieldEnabled && playfieldScoreMode)) changeAtClock(); player1Color = missile1Color = palette[i]; if (playfieldScoreMode) playfieldRightColor = player1Color; } return;
            case 0x0C: if (REFP1 !== ((i >> 3) & 1)) { REFP1 = (i >> 3) & 1; player1UpdateSprite(0); } return;
            case 0x11: hitRESP1(); return;
            case 0x1C: player1SetSprite(i); return;
            case 0x26: if (VDELP1 !== (i  & 1)) { VDELP1 = i & 1; if (GRP1 !== GRP1d) player1UpdateSprite(0); } return;

            // Missile0
            case 0x12: hitRESM0(); return;
            case 0x1D: if (ENAM0 !== (i & 0x02)) { ENAM0 = i & 0x02; if (!RESMP0) { changeAtClock(); missile0SetEnabled(ENAM0); } } return;
            case 0x28: missile0SetResetToPlayer(i); return;

            // Missile1
            case 0x13: hitRESM1(); return;
            case 0x1E: if (ENAM1 !== (i & 0x02)) { ENAM1 = i & 0x02; if (!RESMP1) { changeAtClock(); missile1SetEnabled(ENAM1); } } return;
            case 0x29: missile1SetResetToPlayer(i); return;

            // HMOVE
            case 0x20: HMP0 = (i > 127 ? -16 : 0) + (i >> 4); return;
            case 0x21: HMP1 = (i > 127 ? -16 : 0) + (i >> 4); return;
            case 0x22: HMM0 = (i > 127 ? -16 : 0) + (i >> 4); return;
            case 0x23: HMM1 = (i > 127 ? -16 : 0) + (i >> 4); return;
            case 0x24: HMBL = (i > 127 ? -16 : 0) + (i >> 4); return;
            case 0x2A: hitHMOVE(); return;
            case 0x2B: HMP0 = HMP1 = HMM0 = HMM1 = HMBL = 0; return;

            // Collisions
            case 0x2C: changeAtClock(); collisions = 0; return;

            // RSYNC
            //case 0x03: clock = 0; return;

            // Audio
            case 0x15: if (AUDC0 !== i) { AUDC0 = i; audioSignal.getChannel0().setControl(i & 0x0f); } return;
            case 0x16: if (AUDC1 !== i) { AUDC1 = i; audioSignal.getChannel1().setControl(i & 0x0f); } return;
            case 0x17: if (AUDF0 !== i) { AUDF0 = i; audioSignal.getChannel0().setDivider((i & 0x1f) + 1); } return;     // Bits 0-4, Divider from 1 to 32
            case 0x18: if (AUDF1 !== i) { AUDF1 = i; audioSignal.getChannel1().setDivider((i & 0x1f) + 1); } return;
            case 0x19: if (AUDV0 !== i) { AUDV0 = i; audioSignal.getChannel0().setVolume(i & 0x0f); } return;            // Bits 0-3, Volume from 0 to 15
            case 0x1A: if (AUDV1 !== i) { AUDV1 = i; audioSignal.getChannel1().setVolume(i & 0x0f); } return;
        }
    };

    // caution: endClock can exceed but never wrap end of line!
    function renderLineTo(endClock) {
        var p, finalClock = (endClock > LINE_WIDTH ? LINE_WIDTH : endClock);

        if (vBlankOn) {
            // No collisions will be detected during VBLANK
            for (var bPixel = renderClock; bPixel < finalClock; ++bPixel) linePixels[bPixel] = vBlankColor;
            return;
        }

        var newCollisions = collisions;
        for (var pixel = renderClock - HBLANK_DURATION, finalPixel = finalClock - HBLANK_DURATION; pixel < finalPixel; ++pixel) {

            // Pixel color and Flags for Collision latches
            var color = 0, collis = collisionsPossible;

            if (playfieldPriority) {
                // Playfield
                if (playfieldEnabled) {
                    if ((pixel < 80 ? (playfieldPatternL >> (pixel >> 2)) : (playfieldPatternR >> ((pixel - 80) >> 2))) & 1) {
                        color = playfieldColor;     // ignore score mode
                    } else collis &= PFC;
                }
                // Ball
                if (ballEnabled) {
                    p = pixel - ballPixel; if (p < 0) p += 160;
                    if ((missileBallLineSprites[ballLineSpritePointer + (p >> 3)] >> (p & 0x07)) & 1) {
                        if (!color) color = ballColor;
                    } else collis &= BLC;
                }
            }

            // Player0
            if (player0Enabled) {
                p = pixel - player0Pixel; if (p < 0) p += 160;
                if ((playerLineSprites[player0LineSpritePointer + (p >> 3)] >> (p & 0x07)) & 1) {
                    if (!color) color = player0Color;
                } else collis &= P0C;
            }

            // Missile0
            if (missile0Enabled) {
                p = pixel - missile0Pixel; if (p < 0) p += 160;
                if ((missileBallLineSprites[missile0LineSpritePointer + (p >> 3)] >> (p & 0x07)) & 1) {
                    if (!color) color = missile0Color;
                } else collis &= M0C;
            }

            // Player1
            if (player1Enabled) {
                p = pixel - player1Pixel; if (p < 0) p += 160;
                if ((playerLineSprites[player1LineSpritePointer + (p >> 3)] >> (p & 0x07)) & 1) {
                    if (!color) color = player1Color;
                } else collis &= P1C;
            }

            // Missile1
            if (missile1Enabled) {
                p = pixel - missile1Pixel; if (p < 0) p += 160;
                if ((missileBallLineSprites[missile1LineSpritePointer + (p >> 3)] >> (p & 0x07)) & 1) {
                    if (!color) color = missile1Color;
                } else collis &= M1C;
            }

            if (!playfieldPriority) {
                // Playfield
                if (playfieldEnabled) {
                    if (pixel < 80) {
                        if ((playfieldPatternL >> (pixel >> 2)) & 1) {
                            if (!color) color = playfieldLeftColor;
                        } else collis &= PFC;
                    } else {
                        if ((playfieldPatternR >> ((pixel - 80) >> 2)) & 1) {
                            if (!color) color = playfieldRightColor;
                        } else collis &= PFC;
                    }
                }
                // Ball
                if (ballEnabled) {
                    p = pixel - ballPixel; if (p < 0) p += 160;
                    if ((missileBallLineSprites[ballLineSpritePointer + (p >> 3)] >> (p & 0x07)) & 1) {
                        if (!color) color = ballColor;
                    } else collis &= BLC;
                }
            }

            // Set pixel color, or background
            linePixels[pixel + HBLANK_DURATION] = color || playfieldBackground;

            // Update collision latches
            newCollisions |= collis;
        }
        if (!debugNoCollisions) collisions = newCollisions;
    }

    function changeAt(atClock) {
        if (vBlankOn) return;

        if (atClock > renderClock) {
            if (changeClock >= 0 || changeClockPrevLine >= 0) renderLineTo(atClock);
            renderClock = atClock;
        }
        changeClock = renderClock;
    }

    function changeAtClock() {
        changeAt(clock);
    }

    function changeAtClockPlus(add) {
        changeAt(clock + add);                      // Renders "add" pixels forward, for changes that are only effective after "add" clocks
    }

    function changePlayfieldAtClock() {
        if (debug) debugPixel(DEBUG_PF_GR_COLOR);
        // PF changes are only effective after 2 clocks. Additionally, once a playfield pixel (4 clocks wide) has started,
        // it will remain the same until the end. So we will perceive this change accordingly
        if (clock < renderClock - 1) return changeAtClock();         // Does not matter
        var ip = clock & 0x03;
        if (ip < 3) changeAtClockPlus(4 - ip);      // Perceive change only at the next PF pixel
        else changeAtClockPlus(5);                  // Perceive change only 2 PF pixels later
    }

    function changeVBlankAtClockPlus1() {
        var atClock = clock + 1;
        if (atClock > renderClock) {
            if (changeClock >= 0 || changeClockPrevLine >= 0) renderLineTo(atClock);
            renderClock = atClock;
        }
        changeClock = renderClock;
    }

    function updateToClock() {    // does not trigger change
        if (vBlankOn) return;

        if (clock > renderClock) {
            if (changeClock >= 0 || changeClockPrevLine >= 0) renderLineTo(clock);
            renderClock = clock;
        }
    }

    var finishLine = function() {
        // Render remaining part of current line if needed
        if (changeClock >= 0) {
            renderLineTo(LINE_WIDTH);
            changeClockPrevLine = changeClock;
        } else {
            if (changeClockPrevLine >= 0) {
                renderLineTo(changeClockPrevLine);
                changeClockPrevLine = -1;
            }
        }
        // Disabled repeat mode
        //renderLineTo(LINE_WIDTH);
        //changeClockPrevLine = 0;

        endObjectsAltStatusEndOfLine();

        // Handle Paddles capacitor charging, only if paddles are connected (position >= 0)
        if (paddle0Position >= 0 && !paddleCapacitorsGrounded) {
            if (INPT0 < 0x80 && ++paddle0CapacitorCharge >= paddle0Position) INPT0 |= 0x80;
            if (INPT1 < 0x80 && ++paddle1CapacitorCharge >= paddle1Position) INPT1 |= 0x80;
        }

        // Inject debugging information in the line if needed
        if (debugLevel >= 1) processDebugPixelsInLine();
    };

    function augmentCollisionsPossible() {
        collisionsPossible = 0xfffe;
        if (!player0Enabled) collisionsPossible &= P0C;
        if (!player1Enabled) collisionsPossible &= P1C;
        if (!missile0Enabled) collisionsPossible &= M0C;
        if (!missile1Enabled) collisionsPossible &= M1C;
        if (!playfieldEnabled) collisionsPossible &= PFC;
        if (!ballEnabled) collisionsPossible &= BLC;
    }

    var playfieldSetShape = function(i) {
        if (CTRLPF === i) return;

        var v = i & 0x07;
        if (v !== (CTRLPF & 0x07)) {
            if (playfieldEnabled) changeAtClock();

            v = (i & 0x01) !== 0;
            if (playfieldReflected !== v) {
                playfieldReflected = v;
                playfieldUpdateSpriteR();
            }

            v = (i & 0x02) !== 0;
            if (playfieldScoreMode !== v) {
                playfieldScoreMode = v;
                if (!debug) {
                    if (v) { playfieldLeftColor = player0Color; playfieldRightColor = player1Color }
                    else playfieldColor = playfieldLeftColor = playfieldRightColor = ballColor;
                }
            }

            playfieldPriority = (i & 0x04) !== 0;
        }

        v = i & 0x30;
        if (v !== (CTRLPF & 0x30)) {
            if (ballEnabled) changeAtClock();
            ballLineSpritePointer = (v >> 1) << 6;
        }

        CTRLPF = i;
    };

    function playfieldUpdateSprite() {
        playfieldPatternL = (PF2 << 12) | (jt.Util.reverseInt8(PF1) << 4) | ((PF0 & 0xf0) >> 4);
        playfieldUpdateSpriteR();
    }

    function playfieldUpdateSpriteR() {
        playfieldPatternR = playfieldReflected ? (jt.Util.reverseInt8(PF0) << 16) | (PF1 << 8) | jt.Util.reverseInt8(PF2) : playfieldPatternL;
        if (playfieldPatternL !== 0 || playfieldPatternR !== 0) {
            playfieldEnabled = true; augmentCollisionsPossible();
        } else {
            playfieldEnabled = false; collisionsPossible &= PFC;
        }
    }

    function ballSetEnabled(boo) {
        if (boo) {
            ballEnabled = true; augmentCollisionsPossible();
        } else {
            ballEnabled = false; collisionsPossible &= BLC;
        }
    }

    function player0SetShape(i) {
        if (NUSIZ0 === i) return;

        var dif = NUSIZ0 ^ i;
        var oldNUSIZ0 = NUSIZ0;
        NUSIZ0 = i;
        var newShape = (i & 7);
        var c = clock < HBLANK_DURATION ? 2 : clock - HBLANK_DURATION + 2;

        //if (debug) debugPixel(DEBUG_ALT_COLOR);

        if (dif & 0x07) {
            // Enter Alt mode?
            if (!player0Alt) {
                var into = c - player0Pixel; if (into < 0) into += 160; else if (into >= 160) into -= 160;
                var oldScan = playerScanOffsetsShape[(oldNUSIZ0 & 7) * 160 + into];
                var newScan = playerScanOffsetsShape[newShape * 160 + into];
                if (newScan !== oldScan) {
                    if (player0Enabled) changeAtClockPlus(2);
                    player0Alt = player0Pixel >= 80 ? 1 : 2; player0LineSpritePointer += 20;
                    player0AltFrom = into;
                    player0AltLength = playerCopyLengthPerShape[newShape];
                    if (oldScan & 0xc0)
                        player0AltCopyOffset = oldScan & 0xbf;              // Scan about to start or in empty area
                    else if (clock < HBLANK_DURATION && hMoveHitBlank)
                        player0AltCopyOffset = 0x80;                        // Middle of scan during HBLANK, kill scan
                    else {
                        var pixelSize = playerPixelSizePerShape[newShape];
                        player0AltCopyOffset = playerScanStartPerShape[newShape] + oldScan * pixelSize + (into & 1);
                        player0AltLength -= (newScan & 0xc0 ? 0 : newScan) * pixelSize;
                    }

                    //if (debug && videoSignal.monitor.currentLine() === 150) debugInfo("oldScan: " + oldScan.toString(16) + ", newScan: " + newScan.toString(16) + ", len: " + player0AltLength);
                }
            }
            player0UpdateSprite(2);
        }

        if (dif & 0x37) {
            // Enter Alt mode?
            if (!missile0Alt) {
                into = c - missile0Pixel; if (into < 0) into += 160; else if (into >= 160) into -= 160;
                oldScan = missileScanOffsetsShape[(((oldNUSIZ0 & 0x30) >> 1) | (oldNUSIZ0 & 7)) * 160 + into];
                newScan = missileScanOffsetsShape[(((i & 0x30) >> 1) | newShape) * 160 + into];
                if (newScan !== oldScan) {
                    if (missile0Enabled) changeAtClockPlus(2);
                    missile0Alt = missile0Pixel >= 80 ? 1 : 2; missile0LineSpritePointer += 20;
                    missile0AltFrom = into;
                    var size = (i & 0x30) >> 4;
                    missile0AltLength = 4 + (1 << size);
                    if (oldScan & 0xc0)
                        missile0AltCopyOffset = oldScan & 0xbf;              // Scan about to start or in empty area
                    else if (clock < HBLANK_DURATION && hMoveHitBlank)
                        missile0AltCopyOffset = 0x80;                        // Middle of scan during HBLANK, kill scan
                    else {
                        missile0AltCopyOffset = 4 + (oldScan << size) + (into & 1);
                        missile0AltLength -= (newScan & 0xc0 ? 0 : newScan) << size;
                    }
                }
            }
            missile0UpdateSprite(2);
        }
    }

    function player0SetSprite(i) {
        if (debug) debugPixel(DEBUG_P0_GR_COLOR);
        if (GRP0d !== i) {
            GRP0d = i;
            if (!VDELP0) player0UpdateSprite(1);
        }
        if (GRP1 !== GRP1d) {
            GRP1 = GRP1d;
            if (VDELP1) player1UpdateSprite(1);
        }
    }

    function player0UpdateSprite(clockPlus) {
        var sprite = VDELP0 ? GRP0 : GRP0d;
        if (sprite) {
            var p = (((REFP0 << 11) | (sprite << 3) | (NUSIZ0 & 7)) << 6) + (player0Alt ? 20 : 0);
            if (!player0Enabled || player0LineSpritePointer !== p) {
                changeAtClockPlus(clockPlus);
                player0LineSpritePointer = p;
                if (player0Alt) player0DefineAlt();
            }
            if (!player0Enabled) {
                player0Enabled = true; augmentCollisionsPossible();
            }
        } else {
            if (player0Enabled) {
                changeAtClockPlus(clockPlus);
                player0Enabled = false; collisionsPossible &= P0C;
            }
        }
    }

    function player1SetShape(i) {
        if (NUSIZ1 === i) return;

        var dif = NUSIZ1 ^ i;
        var oldNUSIZ1 = NUSIZ1;
        NUSIZ1 = i;
        var newShape = (i & 7);
        var c = clock < HBLANK_DURATION ? 2 : clock - HBLANK_DURATION + 2;

        if (dif & 0x07) {
            // Enter Alt mode?
            if (!player1Alt) {
                var into = c - player1Pixel; if (into < 0) into += 160; else if (into >= 160) into -= 160;
                var oldScan = playerScanOffsetsShape[(oldNUSIZ1 & 7) * 160 + into];
                var newScan = playerScanOffsetsShape[newShape * 160 + into];
                if (newScan !== oldScan) {
                    if (player1Enabled) changeAtClockPlus(2);
                    player1Alt = player1Pixel >= 80 ? 1 : 2; player1LineSpritePointer += 40;
                    player1AltFrom = into;
                    player1AltLength = playerCopyLengthPerShape[newShape];
                    if (oldScan & 0xc0)
                        player1AltCopyOffset = oldScan & 0xbf;              // Scan about to start or in empty area
                    else if (clock < HBLANK_DURATION && hMoveHitBlank)
                        player1AltCopyOffset = 0x80;                        // Middle of scan during HBLANK, kill scan
                    else {
                        player1AltCopyOffset = playerScanStartPerShape[newShape] + oldScan * playerPixelSizePerShape[newShape] + (into & 1);
                        player1AltLength -= (newScan & 0xc0 ? 0 : newScan) * playerPixelSizePerShape[newShape];
                    }
                }
            }
            player1UpdateSprite(2);
        }

        if (dif & 0x37) {
            // Enter Alt mode?
            if (!missile1Alt) {
                into = c - missile1Pixel; if (into < 0) into += 160; else if (into >= 160) into -= 160;
                oldScan = missileScanOffsetsShape[(((oldNUSIZ1 & 0x30) >> 1) | (oldNUSIZ1 & 7)) * 160 + into];
                newScan = missileScanOffsetsShape[(((i & 0x30) >> 1) | newShape) * 160 + into];
                if (newScan !== oldScan) {
                    if (missile1Enabled) changeAtClockPlus(2);
                    missile1Alt = missile1Pixel >= 80 ? 1 : 2; missile1LineSpritePointer += 40;
                    missile1AltFrom = into;
                    var size = (i & 0x30) >> 4;
                    missile1AltLength = 4 + (1 << size);
                    if (oldScan & 0xc0)
                        missile1AltCopyOffset = oldScan & 0xbf;              // Scan about to start or in empty area
                    else if (clock < HBLANK_DURATION && hMoveHitBlank)
                        missile1AltCopyOffset = 0x80;                        // Middle of scan during HBLANK, kill scan
                    else {
                        missile1AltCopyOffset = 4 + (oldScan << size) + (into & 1);
                        missile1AltLength -= (newScan & 0xc0 ? 0 : newScan) << size;
                    }
                }
            }
            missile1UpdateSprite(2);
        }
    }

    function player1SetSprite(i) {
        if (debug) debugPixel(DEBUG_P1_GR_COLOR);
        if (GRP1d !== i) {
            GRP1d = i;
            if (!VDELP1) player1UpdateSprite(1);
        }
        if (GRP0 !== GRP0d) {
            GRP0 = GRP0d;
            if (VDELP0) player0UpdateSprite(1);
        }
        if (ENABL !== ENABLd) {
            ENABL = ENABLd;
            if (VDELBL) changeAtClockPlus(1);
            ballSetEnabled(ENABL);
        }
    }

    function player1UpdateSprite(clockPlus) {
        var sprite = VDELP1 ? GRP1 : GRP1d;
        if (sprite) {
            var p = (((REFP1 << 11) | (sprite << 3) | (NUSIZ1 & 7)) << 6) + (player1Alt ? 40 : 0);
            if (!player1Enabled || player1LineSpritePointer !== p) {
                changeAtClockPlus(clockPlus);
                player1LineSpritePointer = p;
                if (player1Alt) player1DefineAlt();
            }
            if (!player1Enabled) {
                player1Enabled = true; augmentCollisionsPossible();
            }
        } else {
            if (player1Enabled) {
                changeAtClockPlus(clockPlus);
                player1Enabled = false; collisionsPossible &= P1C;
            }
        }
    }

    function missile0UpdateSprite(clockPlus) {
        var p = ((((NUSIZ0 & 0x30) >> 1) | (NUSIZ0 & 7)) << 6) + (missile0Alt ? 20 : 0);
        if (missile0LineSpritePointer !== p) {
            if (missile0Enabled) {
                changeAtClockPlus(clockPlus);
                missile0LineSpritePointer = p;
                if (missile0Alt) missile0DefineAlt();
            } else
                missile0LineSpritePointer = p;
        }
    }

    function missile0SetEnabled(boo) {
        if (boo) {
            missile0Enabled = true; augmentCollisionsPossible();
            if (missile0Alt) missile0DefineAlt();
        } else {
            missile0Enabled = false; collisionsPossible &= M0C;
        }
    }

    function missile0SetResetToPlayer(i) {
        if (RESMP0 === (i & 0x02)) return;

        if (ENAM0) {
            changeAtClock();
            missile0SetEnabled(!(RESMP0 = i & 0x02));
        } else
            RESMP0 = i & 0x02;

        if (!RESMP0) {
            missile0Pixel = player0Pixel + missileCenterOffsetsPerPlayerSize[NUSIZ0 & 0x07]; if (missile0Pixel >= 160) missile0Pixel -= 160;
        }
    }

    function missile1UpdateSprite(clockPlus) {
        var p = ((((NUSIZ1 & 0x30) >> 1) | (NUSIZ1 & 7)) << 6) + (missile1Alt ? 40 : 0);
        if (missile1LineSpritePointer !== p) {
            if (missile1Enabled) {
                changeAtClockPlus(clockPlus);
                missile1LineSpritePointer = p;
                if (missile1Alt) missile1DefineAlt();
            } else
                missile1LineSpritePointer = p;
        }
    }

    function missile1SetEnabled(boo) {
        if (boo) {
            missile1Enabled = true; augmentCollisionsPossible();
            if (missile1Alt) missile1DefineAlt();
        } else {
            missile1Enabled = false; collisionsPossible &= M1C;
        }
    }

    function missile1SetResetToPlayer(i) {
        if (RESMP1 === (i & 0x02)) return;

        if (ENAM1) {
            changeAtClock();
            missile1SetEnabled(!(RESMP1 = i & 0x02));
        } else
            RESMP1 = i & 0x02;

        if (!RESMP1) {
            missile1Pixel = player1Pixel + missileCenterOffsetsPerPlayerSize[NUSIZ1 & 0x07]; if (missile1Pixel >= 160) missile1Pixel -= 160;
        }
    }

    var hitRESP0 = function() {
        if (debug) debugPixel(DEBUG_P0_RES_COLOR);

        var r = getRESxPixel();
        var p = r >= 0 ? r : -r;
        if (player0Pixel !== p) {
            if (player0Enabled) changeAtClock();
            var pStart = (r >= 0 ? p : 0);
            var into = pStart - player0Pixel; if (into < 0) into += 160;
            player0Pixel = p;
            var nusiz = NUSIZ0 & 7;

            if (player0Alt) {
                if (into <= playerCopyLengthPerShape[nusiz]) return;                  // Keep current Alt def if still in first copy
            } else
                player0LineSpritePointer += 20;

            var delta = pStart - p; if (delta < -100) delta += 160;
            player0Alt = p >= 80 ? 1 : 2;
            player0AltFrom = delta >= 0 ? delta : 160 + delta;
            player0AltLength = playerCopyLengthPerShape[nusiz] - delta;
            player0AltCopyOffset = playerCopyOffsetsReset[nusiz * 160 + into];
            if (player0Enabled) player0DefineAlt();

            //if (debug && videoSignal.monitor.currentLine() === 80) debugInfo("player0Pixel: " + player0Pixel + ", into: " + into + ", delta: " + delta + ", from: " + player0AltFrom + ", len: " + player0AltLength + ", off: " + player0AltCopyOffset);
        }
    };

    function player0DefineAlt() {
        var control = (player0AltFrom << 16) | (player0AltLength << 8) | player0AltCopyOffset;
        var controlPointer = (player0LineSpritePointer - 20) >> 6;
        if (player0AltControl[controlPointer] === control) return;

        var basePointer = player0LineSpritePointer - 20;
        for (var b = 0; b < 20; ++b) playerLineSprites[player0LineSpritePointer + b] = playerLineSprites[basePointer + b];

        var p = player0AltFrom;
        if (player0AltCopyOffset & 0x80) {
            // Just clear bits
            for (var c = 0; c < player0AltLength; ++c) {
                playerLineSprites[player0LineSpritePointer + (p >> 3)] &= ~(1 << (p & 0x07));
                if (++p >= 160) p -= 160;
            }
        } else {
            // Copy bits from base
            basePointer -= objectsLineSpritePointerDeltaToSingleCopy[(NUSIZ0 & 7)];
            for (var pBase = player0AltCopyOffset, to = player0AltCopyOffset + player0AltLength; pBase < to; ++pBase) {
                if ((playerLineSprites[basePointer + (pBase >> 3)] >> (pBase & 0x07)) & 1)
                    playerLineSprites[player0LineSpritePointer + (p >> 3)] |= (1 << (p & 0x07));
                else
                    playerLineSprites[player0LineSpritePointer + (p >> 3)] &= ~(1 << (p & 0x07));
                if (++p >= 160) p -= 160;
            }
        }

        player0AltControl[controlPointer] = control;
    }

    var hitRESP1 = function() {
        if (debug) debugPixel(DEBUG_P1_RES_COLOR);

        var r = getRESxPixel();
        var p = r >= 0 ? r : -r;
        if (player1Pixel !== p) {
            if (player1Enabled) changeAtClock();
            var pStart = (r >= 0 ? p : 0);
            var into = pStart - player1Pixel; if (into < 0) into += 160;
            player1Pixel = p;
            var nusiz = NUSIZ1 & 7;

            if (player1Alt) {
                if (into <= playerCopyLengthPerShape[nusiz]) return;                  // Keep current Alt def if still in first copy
            } else
                player1LineSpritePointer += 40;

            var delta = pStart - p; if (delta < -100) delta += 160;
            player1Alt = p >= 80 ? 1 : 2;
            player1AltFrom = delta >= 0 ? delta : 160 + delta;
            player1AltLength = playerCopyLengthPerShape[nusiz] - delta;
            player1AltCopyOffset = playerCopyOffsetsReset[nusiz * 160 + into];
            if (player1Enabled) player1DefineAlt();
        }
    };

    function player1DefineAlt() {
        var control = (player1AltFrom << 16) | (player1AltLength << 8) | player1AltCopyOffset;
        var controlPointer = (player1LineSpritePointer - 40) >> 6;
        if (player1AltControl[controlPointer] === control) return;

        var basePointer = player1LineSpritePointer - 40;
        for (var b = 0; b < 20; ++b) playerLineSprites[player1LineSpritePointer + b] = playerLineSprites[basePointer + b];

        var p = player1AltFrom;
        if (player1AltCopyOffset & 0x80) {
            // Just clear bits
            for (var c = 0; c < player1AltLength; ++c) {
                playerLineSprites[player1LineSpritePointer + (p >> 3)] &= ~(1 << (p & 0x07));
                if (++p >= 160) p -= 160;
            }
        } else {
            // Copy bits from base
            basePointer -= objectsLineSpritePointerDeltaToSingleCopy[(NUSIZ1 & 7)];
            for (var pBase = player1AltCopyOffset, to = player1AltCopyOffset + player1AltLength; pBase < to; ++pBase) {
                if ((playerLineSprites[basePointer + (pBase >> 3)] >> (pBase & 0x07)) & 1)
                    playerLineSprites[player1LineSpritePointer + (p >> 3)] |= (1 << (p & 0x07));
                else
                    playerLineSprites[player1LineSpritePointer + (p >> 3)] &= ~(1 << (p & 0x07));
                if (++p >= 160) p -= 160;
            }
        }

        player1AltControl[controlPointer] = control;
    }

    var hitRESM0 = function() {
        if (debug) debugPixel(DEBUG_M0_COLOR);

        var r = getRESxPixel();
        var p = r >= 0 ? r : -r;
        if (missile0Pixel !== p) {
            if (missile0Enabled) changeAtClock();
            var pStart = (r >= 0 ? p : 0);
            var into = pStart - missile0Pixel; if (into < 0) into += 160;
            missile0Pixel = p;

            if (missile0Alt) {
                if (into <= 4 + (1 << ((NUSIZ0 & 0x30) >> 4))) return;                // Keep current Alt def if still in first copy
            } else
                missile0LineSpritePointer += 20;

            var delta = pStart - p; if (delta < -100) delta += 160;
            missile0Alt = p >= 80 ? 1 : 2;
            missile0AltFrom = delta >= 0 ? delta : 160 + delta;
            missile0AltLength = 4 + (1 << ((NUSIZ0 & 0x30) >> 4)) - delta;
            missile0AltCopyOffset = missileCopyOffsetsReset[(((NUSIZ0 & 0x30) >> 1) | (NUSIZ0 & 7)) * 160 + into];
            if (missile0Enabled) missile0DefineAlt();
        }
    };

    function missile0DefineAlt() {
        var control = (missile0AltFrom << 16) | (missile0AltLength << 8) | missile0AltCopyOffset;
        var controlPointer = (missile0LineSpritePointer - 20) >> 6;
        if (missile0AltControl[controlPointer] === control) return;

        var basePointer = missile0LineSpritePointer - 20;
        for (var b = 0; b < 20; ++b) missileBallLineSprites[missile0LineSpritePointer + b] = missileBallLineSprites[basePointer + b];

        var p = missile0AltFrom;
        if (missile0AltCopyOffset & 0x80) {
            // Just clear bits
            for (var c = 0; c < missile0AltLength; ++c) {
                missileBallLineSprites[missile0LineSpritePointer + (p >> 3)] &= ~(1 << (p & 0x07));
                if (++p >= 160) p -= 160;
            }
        } else {
            // Copy bits from base
            basePointer -= objectsLineSpritePointerDeltaToSingleCopy[(NUSIZ0 & 7)];
            for (var pBase = missile0AltCopyOffset, to = missile0AltCopyOffset + missile0AltLength; pBase < to; ++pBase) {
                if ((missileBallLineSprites[basePointer + (pBase >> 3)] >> (pBase & 0x07)) & 1)
                    missileBallLineSprites[missile0LineSpritePointer + (p >> 3)] |= (1 << (p & 0x07));
                else
                    missileBallLineSprites[missile0LineSpritePointer + (p >> 3)] &= ~(1 << (p & 0x07));
                if (++p >= 160) p -= 160;
            }
        }

        missile0AltControl[controlPointer] = control;
    }

    var hitRESM1 = function() {
        if (debug) debugPixel(DEBUG_M1_COLOR);

        var r = getRESxPixel();
        var p = r >= 1 ? r : -r;
        if (missile1Pixel !== p) {
            if (missile1Enabled) changeAtClock();
            var pStart = (r >= 0 ? p : 0);
            var into = pStart - missile1Pixel; if (into < 0) into += 160;
            missile1Pixel = p;

            if (missile1Alt) {
                if (into <= 4 + (1 << ((NUSIZ1 & 0x30) >> 4))) return;                // Keep current Alt def if still in first copy
            } else
                missile1LineSpritePointer += 40;

            var delta = pStart - p; if (delta < -100) delta += 160;
            missile1Alt = p >= 80 ? 1 : 2;
            missile1AltFrom = delta >= 0 ? delta : 160 + delta;
            missile1AltLength = 4 + (1 << ((NUSIZ1 & 0x30) >> 4)) - delta;
            missile1AltCopyOffset = missileCopyOffsetsReset[(((NUSIZ1 & 0x30) >> 1) | (NUSIZ1 & 7)) * 160 + into];
            if (missile1Enabled) missile1DefineAlt();
        }
    };

    function missile1DefineAlt() {
        var control = (missile1AltFrom << 16) | (missile1AltLength << 8) | missile1AltCopyOffset;
        var controlPointer = (missile1LineSpritePointer - 40) >> 6;
        if (missile1AltControl[controlPointer] === control) return;

        var basePointer = missile1LineSpritePointer - 40;
        for (var b = 0; b < 20; ++b) missileBallLineSprites[missile1LineSpritePointer + b] = missileBallLineSprites[basePointer + b];

        var p = missile1AltFrom;
        if (missile1AltCopyOffset & 0x80) {
            // Just clear bits
            for (var c = 0; c < missile1AltLength; ++c) {
                missileBallLineSprites[missile1LineSpritePointer + (p >> 3)] &= ~(1 << (p & 0x07));
                if (++p >= 160) p -= 160;
            }
        } else {
            // Copy bits from base
            basePointer -= objectsLineSpritePointerDeltaToSingleCopy[(NUSIZ1 & 7)];
            for (var pBase = missile1AltCopyOffset, to = missile1AltCopyOffset + missile1AltLength; pBase < to; ++pBase) {
                if ((missileBallLineSprites[basePointer + (pBase >> 3)] >> (pBase & 0x07)) & 1)
                    missileBallLineSprites[missile1LineSpritePointer + (p >> 3)] |= (1 << (p & 0x07));
                else
                    missileBallLineSprites[missile1LineSpritePointer + (p >> 3)] &= ~(1 << (p & 0x07));
                if (++p >= 160) p -= 160;
            }
        }

        missile1AltControl[controlPointer] = control;
    }

    var hitRESBL = function() {
        if (debug) debugPixel(DEBUG_BL_COLOR);

        var r = getRESxPixel();
        var p = r >= 0 ? r : -r;
        if (ballPixel !== p) {
            if (ballEnabled) changeAtClock();
            ballPixel = p;
        }
    };

    var hitHMOVE = function() {
        if (debug) debugPixel(DEBUG_HMOVE_COLOR);
        // Normal HMOVE
        if (clock < HBLANK_DURATION) {
            hMoveHitClock = clock;
            hMoveHitBlank = true;
            performHMOVE();
            return;
        }
        // Unsupported HMOVE
        if (clock < 219) {
            // debugInfo("Unsupported HMOVE hit");
            return;
        }
        // Late HMOVE: Clocks [219-224] hide HMOVE blank next line, clocks [225, 0] produce normal behavior next line
        // debugInfo("Late HMOVE hit");
        hMoveHitClock = 160 - clock;
        hMoveLateHit = true;
        hMoveLateHitBlank = clock >= 225;
    };

    // Can only be called during HBLANK!
    var performHMOVE = function() {
        // Change objects position
        var add;
        var changed = false;
        add = (hMoveHitBlank ? HMP0 : HMP0 + 8); if (add !== 0) {
            player0Pixel -= add; if (player0Pixel >= 160) player0Pixel -= 160; else if (player0Pixel < 0) player0Pixel += 160;
            if (player0Enabled) changed = true;
        }
        add = (hMoveHitBlank ? HMP1 : HMP1 + 8); if (add !== 0) {
            player1Pixel -= add; if (player1Pixel >= 160) player1Pixel -= 160; else if (player1Pixel < 0) player1Pixel += 160;
            if (player1Enabled) changed = true;
        }
        add = (hMoveHitBlank ? HMM0 : HMM0 + 8); if (add !== 0) {
            missile0Pixel -= add; if (missile0Pixel >= 160) missile0Pixel -= 160; else if (missile0Pixel < 0) missile0Pixel += 160;
            if (missile0Enabled) changed = true;
        }
        add = (hMoveHitBlank ? HMM1 : HMM1 + 8); if (add !== 0) {
            missile1Pixel -= add; if (missile1Pixel >= 160) missile1Pixel -= 160; else if (missile1Pixel < 0) missile1Pixel += 160;
            if (missile1Enabled) changed = true;
        }
        add = (hMoveHitBlank ? HMBL : HMBL + 8); if (add !== 0) {
            ballPixel -= add; if (ballPixel >= 160) ballPixel -= 160; else if (ballPixel < 0) ballPixel += 160;
            if (ballEnabled) changed = true;
        }

        if (changed) changeClock = hMoveHitBlank ? HBLANK_DURATION + 8 : HBLANK_DURATION;
    };

    // Negative values mean hit during HBLANK. Invert negative values to get object position, then Alt must be defined considering starting from pixel 0
    function getRESxPixel() {
        // Hit after complete HBLANK or last pixel of Extended HBLANK
        if (clock >= HBLANK_DURATION + (hMoveHitBlank ? 8 - 1 : 0)) {
            return clock - HBLANK_DURATION;
        } else {
            // Hit during HBLANK
            if (hMoveHitBlank) {
                if (clock >= HBLANK_DURATION) {
                    return -6;
                } else {
                    var d = (clock - hMoveHitClock - 4) >> 2;   // Shift right proportionally to distance from HMOVE, up to 8 pixels
                    if (d > 8) return -6;
                    else if (d > 1) return -(d - 2);
                    else return -(158 + d);
                }
            } else
                return -158;
        }
    }

    function checkLateHMOVE() {
        if (hMoveLateHit) {
            hMoveLateHit = false;
            hMoveHitBlank = hMoveLateHitBlank;
            performHMOVE();
        } else
            hMoveHitBlank = false;
    }

    function updateExtendedHBLANK() {
        // Detect change in the extended HBLANK filling
        if (hMoveHitBlank !== (linePixels[HBLANK_DURATION] === hBlankColor)) {
            if (hMoveHitBlank) {
                // Fills the extended HBLANK portion of the current line
                linePixels[HBLANK_DURATION] = linePixels[HBLANK_DURATION + 1] = linePixels[HBLANK_DURATION + 2] = linePixels[HBLANK_DURATION + 3] =
                    linePixels[HBLANK_DURATION + 4] = linePixels[HBLANK_DURATION + 5] = linePixels[HBLANK_DURATION + 6] = linePixels[HBLANK_DURATION + 7] =
                        hBlankColor;    // This is faster than a fill
            } else
                changeClock = HBLANK_DURATION;
        }
        if (hMoveHitBlank) renderClock = HBLANK_DURATION + 8;
    }

    function endObjectsAltStatusMidLine() {
        if (player0Alt === 1)  { if (player0Enabled)  changeAtClock(); player0Alt = 0;  player0LineSpritePointer -= 20; }
        if (player1Alt === 1)  { if (player1Enabled)  changeAtClock(); player1Alt = 0;  player1LineSpritePointer -= 40; }
        if (missile0Alt === 1) { if (missile0Enabled) changeAtClock(); missile0Alt = 0; missile0LineSpritePointer -= 20; }
        if (missile1Alt === 1) { if (missile1Enabled) changeAtClock(); missile1Alt = 0; missile1LineSpritePointer -= 40; }
    }

    function endObjectsAltStatusEndOfLine() {
        if (player0Alt === 2)  { player0Alt = 0;  player0LineSpritePointer -= 20; }
        if (player1Alt === 2)  { player1Alt = 0;  player1LineSpritePointer -= 40; }
        if (missile0Alt === 2) { missile0Alt = 0; missile0LineSpritePointer -= 20; }
        if (missile1Alt === 2) { missile1Alt = 0; missile1LineSpritePointer -= 40; }
    }

    function vSyncSet(i) {
        if (debug) {
            debugPixel(VSYNC_COLOR);
            changeAtClock();
            vSyncOn = (i & 0x02) !== 0;
            vBlankColor = vSyncOn ? VSYNC_COLOR : DEBUG_VBLANK_COLOR;
        } else
            vSyncOn = (i & 0x02) !== 0;
    }

    var vBlankSet = function(blank) {
        var v = (blank & 0x02) !== 0;
        if (vBlankOn !== v) {
            changeVBlankAtClockPlus1();
            //changeAtClockPlus(1);
            vBlankOn = v;
        }

        if ((blank & 0x40) !== 0) {
            controlsButtonsLatched = true;			// Enable Joystick Button latches
        } else {
            controlsButtonsLatched = false;			// Disable latches and update registers with the current button state
            if (controlsJOY0ButtonPressed) INPT4 &= 0x7f; else INPT4 |= 0x80;
            if (controlsJOY1ButtonPressed) INPT5 &= 0x7f; else INPT5 |= 0x80;
        }

        if ((blank & 0x80) != 0) {					// Ground paddle capacitors
            paddleCapacitorsGrounded = true;
            paddle0CapacitorCharge = paddle1CapacitorCharge = 0;
            INPT0 &= 0x7f; INPT1 &= 0x7f; INPT2 &= 0x7f; INPT3 &= 0x7f;
        }
        else
            paddleCapacitorsGrounded = false;
    };

    var initLatchesAtPowerOn = function() {
        collisions = 0;
        INPT0 = INPT1 = INPT2 = INPT3 = 0;
        INPT4 = INPT5 = 0x80;
    };

    var debugPixel = function(color) {
        debugPixels[clock] = color;
    };

    var processDebugPixelsInLine = function() {
        jt.Util.arrayFillSegment(linePixels, 0, HBLANK_DURATION + (hMoveHitBlank ? 8 : 0), hBlankColor);
        // Marks
        if (debugLevel >= 3 && videoSignal.monitor.currentLine() % 10 == 0) {
            for (var i = 0; i < LINE_WIDTH; i++) {
                if (debugPixels[i]) continue;
                if (i < HBLANK_DURATION) {
                    if (i % 6 == 0 || i == 66 || i == 63)
                        debugPixels[i] = DEBUG_MARKS_COLOR;
                } else {
                    if ((i - HBLANK_DURATION - 1) % 6 == 0)
                        debugPixels[i] = DEBUG_MARKS_COLOR;
                }
            }
        }
        // Debug Pixels
        if (debugLevel >= 2) {
            for (i = 0; i < LINE_WIDTH; i++) {
                if (debugPixels[i]) {
                    linePixels[i] = debugPixels[i];
                    debugPixels[i] = 0;
                }
            }
        }
    };

    var debugSetColors = function() {
        player0Color = DEBUG_P0_COLOR;
        player1Color = DEBUG_P1_COLOR;
        missile0Color = DEBUG_M0_COLOR;
        missile1Color = DEBUG_M1_COLOR;
        ballColor = DEBUG_BL_COLOR;
        playfieldColor = playfieldLeftColor = playfieldRightColor = DEBUG_PF_COLOR;
        playfieldBackground = DEBUG_BK_COLOR;
        hBlankColor = debugLevel >= 1 ? DEBUG_HBLANK_COLOR : HBLANK_COLOR;
        vBlankColor = debugLevel >= 1 ? DEBUG_VBLANK_COLOR : VBLANK_COLOR;
    };

    var debugRestoreColors = function() {
        hBlankColor = HBLANK_COLOR;
        vBlankColor = VBLANK_COLOR;
        playfieldBackground = palette[0];
        jt.Util.arrayFill(linePixels, hBlankColor);
        changeAtClock();
    };

    var info = function(str) {
        console.error("Line: " + videoSignal.monitor.currentLine() +", Pixel: " + clock + ". " + str);
    };

    var debugInfo = function(str) {
        if (debug) console.error("Line: " + videoSignal.monitor.currentLine() +", Pixel: " + clock + ". " + str);
    };

    // All possible entire line pixels for players, for all 8 bit patterns (sprites), including all variations (copies) and mirrors
    function generateObjectsLineSprites() {
        // Players
        var line = new Uint8Array(160);
        for (var mirror = 0; mirror <= 1; ++mirror) {
            for (var pattern = 0; pattern < 256; ++pattern) {
                var sprite = !mirror ? jt.Util.reverseInt8(pattern) : pattern;
                // 1 copy
                paintSprite(line, sprite, 4 + 1); addPlayerSprite(mirror, pattern, 0, 0, line);                   // 4 + 1 means player is delayed 4 + 1 pixels
                // 2 copies close
                paintSprite(line, sprite, 4 + 16 + 1); addPlayerSprite(mirror, pattern, 1, 0, line);
                // 3 copies close
                paintSprite(line, sprite, 4 + 32 + 1); addPlayerSprite(mirror, pattern, 3, 0, line);
                // 2 copies medium
                paintSprite(line, 0, 4 + 16 + 1); addPlayerSprite(mirror, pattern, 2, 0, line);                   // erase close copy
                // 3 copies medium
                paintSprite(line, sprite, 4 + 64 + 1); addPlayerSprite(mirror, pattern, 6, 0, line);
                // 2 copies wide
                paintSprite(line, 0, 4 + 32 + 1); addPlayerSprite(mirror, pattern, 4, 0, line);                   // erase medium copy
                // 1 copy double
                paintSprite(line, 0, 4 + 64 + 1); line[4 + 1] = 0;                                                // erase wide copy and first pixel
                paintSpriteDouble(line, sprite, 4 + 1 + 1); addPlayerSprite(mirror, pattern, 5, 0, line);         // 4 + 1 + 1 means Double and Quad are delayed 1 extra pixel
                // 1 copy quad
                paintSpriteQuad(line, sprite, 4 + 1 + 1); addPlayerSprite(mirror, pattern, 7, 0, line);
                // empty line
                paintSpriteQuad(line, 0, 4 + 1 + 1);
            }
        }

        // Missiles & Ball
        jt.Util.arrayFill(line, 0);
        for (var size = 0; size < 4; ++size) {
            sprite = (1 << (1 << size)) - 1;
            // 1 copy
            paintSprite(line, sprite, 4);                                                                         // 4 means missile/ball is delayed 4 pixels
            addMissileBallSprite(size, 0, 0, line);
            addMissileBallSprite(size, 5, 0, line);
            addMissileBallSprite(size, 7, 0, line);
            // 2 copies close
            paintSprite(line, sprite, 4 + 16); addMissileBallSprite(size, 1, 0, line);
            // 3 copies close
            paintSprite(line, sprite, 4 + 32); addMissileBallSprite(size, 3, 0, line);
            // 2 copies medium
            paintSprite(line, 0, 4 + 16); addMissileBallSprite(size, 2, 0, line);                                 // erase close copy
            // 3 copies medium
            paintSprite(line, sprite, 4 + 64); addMissileBallSprite(size, 6, 0, line);
            // 2 copies wide
            paintSprite(line, 0, 4 + 32); addMissileBallSprite(size, 4, 0, line);                                 // erase medium copy
            paintSprite(line, 0, 4);                                                                              // clean line: erase first and wide copy
            paintSprite(line, 0, 4 + 64);
        }

        function paintSprite(line, pat, pos) {
            for (var b = 0; b < 8; ++b) line[pos + b] = (pat >> b) & 1;
        }
        function paintSpriteDouble(line, pat, pos) {
            for (var b = 0; b < 8; ++b) line[pos + b*2] = line[pos + b*2 + 1] = (pat >> b) & 1;
        }
        function paintSpriteQuad(line, pat, pos) {
            for (var b = 0; b < 8; ++b) line[pos + b*4] = line[pos + b*4 + 1] = line[pos + b*4 + 2] = line[pos + b*4 + 3] = (pat >> b) & 1;
        }
        function addPlayerSprite(mirror, pattern, vari, alt, line) {
            var pos = (((mirror << 11) | (pattern << 3) | vari) << 6) + alt * 20;
            for (var i = 0; i < 20; ++i)
                for (var b = 0; b < 8; ++b)
                    if (line[i * 8 + b]) playerLineSprites[pos + i] |= 1 << b;

        }
        function addMissileBallSprite(size, vari, alt, line) {
            var pos = (((size << 3) | vari) << 6) + alt * 20;
            for (var i = 0; i < 20; ++i)
                for (var b = 0; b < 8; ++b)
                    if (line[i * 8 + b]) missileBallLineSprites[pos + i] |= 1 << b;

        }
    }

    function generateObjectsCopiesOffsets() {
        var delays = new Uint8Array(40);
        delays[0] = 0; delays[1] = 1; delays[2] = 2; delays[3] = 3;

        // Players
        jt.Util.arrayFill(playerCopyOffsetsReset, 0x80);
        jt.Util.arrayFill(playerScanOffsetsShape, 0x80);
        // Normal Variations
        for (var p = 0; p < 13; ++p) {
            // Apply delays for Reset start signal
            var v = p - delays[p];
            playerCopyOffsetsReset[0*160 + p] = v;
            playerCopyOffsetsReset[1*160 + p] = v;  playerCopyOffsetsReset[1*160 + p + 16] = v;
            playerCopyOffsetsReset[2*160 + p] = v;  playerCopyOffsetsReset[2*160 + p + 32] = v;
            playerCopyOffsetsReset[3*160 + p] = v;  playerCopyOffsetsReset[3*160 + p + 16] = v; playerCopyOffsetsReset[3*160 + p + 32] = v;
            playerCopyOffsetsReset[4*160 + p] = v;  playerCopyOffsetsReset[4*160 + p + 64] = v;
            playerCopyOffsetsReset[6*160 + p] = v;  playerCopyOffsetsReset[6*160 + p + 32] = v; playerCopyOffsetsReset[6*160 + p + 64] = v;
            // Start signal and pixel scan info
            v = p < 5 ? p | 0x40 : p - 5;
            playerScanOffsetsShape[0*160 + p] = v;
            playerScanOffsetsShape[1*160 + p] = v;  playerScanOffsetsShape[1*160 + p + 16] = v;
            playerScanOffsetsShape[2*160 + p] = v;  playerScanOffsetsShape[2*160 + p + 32] = v;
            playerScanOffsetsShape[3*160 + p] = v;  playerScanOffsetsShape[3*160 + p + 16] = v; playerScanOffsetsShape[3*160 + p + 32] = v;
            playerScanOffsetsShape[4*160 + p] = v;  playerScanOffsetsShape[4*160 + p + 64] = v;
            playerScanOffsetsShape[6*160 + p] = v;  playerScanOffsetsShape[6*160 + p + 32] = v; playerScanOffsetsShape[6*160 + p + 64] = v;
        }

        // Double Variation
        for (p = 0; p < 22; p++) {
            v = p - delays[p];
            playerCopyOffsetsReset[5 * 160 + p] = v;
            v = p < 6 ? p | 0x40 : (p - 6) >> 1;
            playerScanOffsetsShape[5 * 160 + p] = v;
        }
        // Quad Variation
        for (p = 0; p < 38; p++) {
            v = p - delays[p];
            playerCopyOffsetsReset[7 * 160 + p] = v;
            v = p < 6 ? p | 0x40 : (p - 6) >> 2;
            playerScanOffsetsShape[7 * 160 + p] = v;
        }

        // Missiles
        jt.Util.arrayFill(missileCopyOffsetsReset, 0x80);
        jt.Util.arrayFill(missileScanOffsetsShape, 0x80);
        // All Size * Variations
        for (var s = 0; s <= 3; ++s) {
            var d = 4 + (1 << s);
            for (p = 0; p < d; ++p) {
                v = p - delays[p];
                missileCopyOffsetsReset[s*8*160 + 0*160 + p] = v;
                missileCopyOffsetsReset[s*8*160 + 1*160 + p] = v;  missileCopyOffsetsReset[s*8 + 1*160 + p + 16] = v;
                missileCopyOffsetsReset[s*8*160 + 2*160 + p] = v;  missileCopyOffsetsReset[s*8 + 2*160 + p + 32] = v;
                missileCopyOffsetsReset[s*8*160 + 3*160 + p] = v;  missileCopyOffsetsReset[s*8 + 3*160 + p + 16] = v; missileCopyOffsetsReset[s*8*160 + 3*160 + p + 32] = v;
                missileCopyOffsetsReset[s*8*160 + 4*160 + p] = v;  missileCopyOffsetsReset[s*8 + 4*160 + p + 64] = v;
                missileCopyOffsetsReset[s*8*160 + 5*160 + p] = v;
                missileCopyOffsetsReset[s*8*160 + 6*160 + p] = v;  missileCopyOffsetsReset[s*8 + 6*160 + p + 32] = v; missileCopyOffsetsReset[s*8*160 + 6*160 + p + 64] = v;
                missileCopyOffsetsReset[s*8*160 + 7*160 + p] = v;
                v = p < 4 ? p | 0x40 : (p - 4) >> s;
                missileScanOffsetsShape[s*8*160 + 0*160 + p] = v;
                missileScanOffsetsShape[s*8*160 + 1*160 + p] = v;  missileScanOffsetsShape[s*8 + 1*160 + p + 16] = v;
                missileScanOffsetsShape[s*8*160 + 2*160 + p] = v;  missileScanOffsetsShape[s*8 + 2*160 + p + 32] = v;
                missileScanOffsetsShape[s*8*160 + 3*160 + p] = v;  missileScanOffsetsShape[s*8 + 3*160 + p + 16] = v; missileScanOffsetsShape[s*8*160 + 3*160 + p + 32] = v;
                missileScanOffsetsShape[s*8*160 + 4*160 + p] = v;  missileScanOffsetsShape[s*8 + 4*160 + p + 64] = v;
                missileScanOffsetsShape[s*8*160 + 5*160 + p] = v;
                missileScanOffsetsShape[s*8*160 + 6*160 + p] = v;  missileScanOffsetsShape[s*8 + 6*160 + p + 32] = v; missileScanOffsetsShape[s*8*160 + 6*160 + p + 64] = v;
                missileScanOffsetsShape[s*8*160 + 7*160 + p] = v;
            }
        }
    }


    // Controls interface  -----------------------------------

    var controls = jt.ConsoleControls;

    this.controlStateChanged = function(control, state) {
        switch (control) {
            case controls.JOY0_BUTTON:
                if (state) {
                    controlsJOY0ButtonPressed = true;
                    INPT4 &= 0x7f;
                } else {
                    controlsJOY0ButtonPressed = false;
                    if (!controlsButtonsLatched)			// Does not lift the button if Latched Mode is on
                        INPT4 |= 0x80;
                }
                return;
            case controls.JOY1_BUTTON:
                if (state) {
                    controlsJOY1ButtonPressed = true;
                    INPT5 &= 0x7f;
                } else {
                    controlsJOY1ButtonPressed = false;
                    if (!controlsButtonsLatched)			// Does not lift the button if Latched Mode is on
                        INPT5 |= 0x80;
                }
                return;
        }
        // Toggles
        if (!state) return;
        switch (control) {
            case controls.DEBUG:
                self.debug(debugLevel + 1); return;
            case controls.SHOW_INFO:
                videoSignal.toggleShowInfo(); return;
            case controls.NO_COLLISIONS:
                debugNoCollisions = !debugNoCollisions;
                videoSignal.showOSD(debugNoCollisions ? "No Collisions: ON" : "No Collisions: OFF", true);
        }
    };

    this.controlValueChanged = function(control, position) {
        switch (control) {
            case controls.PADDLE0_POSITION:
                paddle0Position = position; return;
            case controls.PADDLE1_POSITION:
                paddle1Position = position; return;
        }
    };


    // Savestate  ------------------------------------------------

    this.saveState = function() {
        return {
            ccp: changeClockPrevLine,
            lpx: jt.Util.storeInt32BitArrayToStringBase64(linePixels),

            vs: vSyncOn,
            vb: vBlankOn,

            pfe: playfieldEnabled,
            pfl: playfieldPatternL,
            pfr: playfieldPatternR,
            pfc: playfieldColor,
            pflc: playfieldLeftColor,
            pfrc: playfieldRightColor,
            pfb: playfieldBackground,
            pfrl: playfieldReflected,
            pfsc: playfieldScoreMode,
            pfp: playfieldPriority,

            be: ballEnabled,
            bx: ballPixel,
            blp: ballLineSpritePointer,
            bc: ballColor,

            p0e: player0Enabled,
            p0x: player0Pixel,
            p0lp: player0LineSpritePointer,
            p0a: player0Alt,
            p0af: player0AltFrom,
            p0al: player0AltLength,
            p0ao: player0AltCopyOffset,
            p0c: player0Color,

            p1e: player1Enabled,
            p1x: player1Pixel,
            p1lp: player1LineSpritePointer,
            p1a: player1Alt,
            p1af: player1AltFrom,
            p1al: player1AltLength,
            p1ao: player1AltCopyOffset,
            p1c: player1Color,

            m0e: missile0Enabled,
            m0x: missile0Pixel,
            m0lp: missile0LineSpritePointer,
            m0a: missile0Alt,
            m0af: missile0AltFrom,
            m0al: missile0AltLength,
            m0ao: missile0AltCopyOffset,
            m0c: missile0Color,

            m1e: missile1Enabled,
            m1x: missile1Pixel,
            m1lp: missile1LineSpritePointer,
            m1a: missile1Alt,
            m1af: missile1AltFrom,
            m1al: missile1AltLength,
            m1ao: missile1AltCopyOffset,
            m1c: missile1Color,

            hmh: hMoveHitBlank,
            hmc: hMoveHitClock,
            hmlh: hMoveLateHit,
            hmlb: hMoveLateHitBlank,

            co: collisions,
            cop: collisionsPossible,

            CTRLPF: CTRLPF,
            COLUPF: COLUPF,
            COLUBK: COLUBK,
            PF0: PF0,
            PF1: PF1,
            PF2: PF2,
            ENABL: ENABL,
            ENABLd: ENABLd,
            VDELBL: VDELBL,
            NUSIZ0: NUSIZ0,
            COLUP0: COLUP0,
            REFP0: REFP0,
            GRP0: GRP0,
            GRP0d: GRP0d,
            VDELP0: VDELP0,
            NUSIZ1: NUSIZ1,
            COLUP1: COLUP1,
            REFP1: REFP1,
            GRP1: GRP1,
            GRP1d: GRP1d,
            VDELP1: VDELP1,
            ENAM0: ENAM0,
            RESMP0: RESMP0,
            ENAM1: ENAM1,
            RESMP1: RESMP1,
            HMP0: HMP0,
            HMP1: HMP1,
            HMM0: HMM0,
            HMM1: HMM1,
            HMBL: HMBL,
            AUDC0: AUDC0,
            AUDC1: AUDC1,
            AUDF0: AUDF0,
            AUDF1: AUDF1,
            AUDV0: AUDV0,
            AUDV1: AUDV1
        };
    };

    this.loadState = function(s) {
        changeClockPrevLine = s.ccp;
        jt.Util.restoreStringBase64ToInt32BitArray(s.lpx, linePixels);

        vSyncOn = s.vs;
        vBlankOn = s.vb;

        playfieldEnabled = s.pfe;
        playfieldPatternL = s.pfl | 0;
        playfieldPatternR = s.pfr | 0;
        playfieldColor = s.pfc | 0;
        playfieldLeftColor = s.pflc | 0;
        playfieldRightColor = s.pfrc | 0;
        playfieldBackground = s.pfb | 0;
        playfieldReflected = s.pfrl;
        playfieldScoreMode = s.pfsc;
        playfieldPriority = s.pfp;

        ballEnabled = s.be;
        ballPixel = s.bx | 0;
        ballLineSpritePointer = s.blp | 0;
        ballColor = s.bc | 0;

        player0Enabled = s.p0e;
        player0Pixel = s.p0x | 0;
        player0LineSpritePointer = s.p0lp | 0;
        player0Alt = s.p0a | 0;
        player0AltFrom = s.p0af | 0;
        player0AltLength = s.p0al | 0;
        player0AltCopyOffset = s.p0ao | 0;
        jt.Util.arrayFill(player0AltControl, 0);
        player0Color = s.p0c | 0;

        player1Enabled = s.p1e;
        player1Pixel = s.p1x | 0;
        player1LineSpritePointer = s.p1lp | 0;
        player1Alt = s.p1a | 0;
        player1AltFrom = s.p1af | 0;
        player1AltLength = s.p1al | 0;
        player1AltCopyOffset = s.p1ao | 0;
        jt.Util.arrayFill(player1AltControl, 0);
        player1Color = s.p1c | 0;

        missile0Enabled = s.m0e;
        missile0Pixel = s.m0x | 0;
        missile0LineSpritePointer = s.m0lp | 0;
        missile0Alt = s.m0a | 0;
        missile0AltFrom = s.m0af | 0;
        missile0AltLength = s.m0al | 0;
        missile0AltCopyOffset = s.m0ao | 0;
        jt.Util.arrayFill(missile0AltControl, 0);
        missile0Color = s.m0c | 0;

        missile1Enabled = s.m1e;
        missile1Pixel = s.m1x | 0;
        missile1LineSpritePointer = s.m1lp | 0;
        missile1Alt = s.m1a | 0;
        missile1AltFrom = s.m1af | 0;
        missile1AltLength = s.m1al | 0;
        missile1AltCopyOffset = s.m1ao | 0;
        jt.Util.arrayFill(missile1AltControl, 0);
        missile1Color = s.m1c | 0;

        hMoveHitBlank = s.hmh;
        hMoveHitClock = s.hmc | 0;
        hMoveLateHit = s.hmlh;
        hMoveLateHitBlank = s.hmlb;

        collisions = s.co | 0;
        collisionsPossible = s.cop | 0;

        CTRLPF = s.CTRLPF | 0;
        COLUPF = s.COLUPF | 0;
        COLUBK = s.COLUBK | 0;
        PF0 = s.PF0 | 0;
        PF1 = s.PF1 | 0;
        PF2 = s.PF2 | 0;
        ENABL = s.ENABL | 0;
        ENABLd = s.ENABLd | 0;
        VDELBL = s.VDELBL | 0;
        NUSIZ0 = s.NUSIZ0 | 0;
        COLUP0 = s.COLUP0 | 0;
        REFP0 = s.REFP0 | 0;
        GRP0 = s.GRP0 | 0;
        GRP0d = s.GRP0d | 0;
        VDELP0 = s.VDELP0 | 0;
        NUSIZ1 = s.NUSIZ1 | 0;
        COLUP1 = s.COLUP1 | 0;
        REFP1 = s.REFP1 | 0;
        GRP1 = s.GRP1 | 0;
        GRP1d = s.GRP1d | 0;
        VDELP1 = s.VDELP1 | 0;
        ENAM0 = s.ENAM0 | 0;
        RESMP0 = s.RESMP0 | 0;
        ENAM1 = s.ENAM1 | 0;
        RESMP1 = s.RESMP1 | 0;
        HMP0 = s.HMP0 | 0;
        HMP1 = s.HMP1 | 0;
        HMM0 = s.HMM0 | 0;
        HMM1 = s.HMM1 | 0;
        HMBL = s.HMBL | 0;
        AUDC0 = s.AUDC0 | 0; audioSignal.getChannel0().setControl(AUDC0 & 0x0f);		// Also update the Audio Generator
        AUDC1 = s.AUDC1 | 0; audioSignal.getChannel1().setControl(AUDC1 & 0x0f);
        AUDF0 = s.AUDF0 | 0; audioSignal.getChannel0().setDivider((AUDF0 & 0x1f) + 1);
        AUDF1 = s.AUDF1 | 0; audioSignal.getChannel1().setDivider((AUDF1 & 0x1f) + 1);
        AUDV0 = s.AUDV0 | 0; audioSignal.getChannel0().setVolume(AUDV0 & 0x0f);
        AUDV1 = s.AUDV1 | 0; audioSignal.getChannel1().setVolume(AUDV1 & 0x0f);

        if (debug) debugSetColors();						// IF debug is on, ensure debug colors are used
    };


    // Constants  ------------------------------------------------

    var HBLANK_DURATION = 68;
    var LINE_WIDTH = 228;

    var VBLANK_COLOR = 0xff000000;		// CHECK: Full transparency needed for CRT emulation modes
    var HBLANK_COLOR = 0xfe000000;      // Alpha of 0xfe used to detect extended HBLANK (alpha is unnoticeable)
    var VSYNC_COLOR  = 0xffdddddd;

    var DEBUG_P0_COLOR     = 0xff0000ff;
    var DEBUG_P0_RES_COLOR = 0xff2222bb;
    var DEBUG_P0_GR_COLOR  = 0xff111177;
    var DEBUG_P1_COLOR     = 0xffff0000;
    var DEBUG_P1_RES_COLOR = 0xffbb2222;
    var DEBUG_P1_GR_COLOR  = 0xff771111;
    var DEBUG_M0_COLOR     = 0xff6666ff;
    var DEBUG_M1_COLOR     = 0xffff6666;
    var DEBUG_PF_COLOR     = 0xff448844;
    var DEBUG_PF_GR_COLOR  = 0xff33dd33;
    var DEBUG_BK_COLOR     = 0xff334433;
    var DEBUG_BL_COLOR     = 0xff00ffff;
    var DEBUG_MARKS_COLOR  = 0xff202020;
    var DEBUG_HBLANK_COLOR = 0xff444444;
    var DEBUG_VBLANK_COLOR = 0xff2a2a2a;
    var DEBUG_WSYNC_COLOR  = 0xff880088;
    var DEBUG_HMOVE_COLOR  = 0xffffffff;
    var DEBUG_ALT_COLOR    = 0xffaaaa00;

    var READ_ADDRESS_MASK  = 0x000f;
    var WRITE_ADDRESS_MASK = 0x003f;

    // Collision bit patterns:   P0P1, P0M0, P0M1, P0PF,   P0BL, P1M0, P1M1, P1PF,   P1BL, M0M1, M0PF, M0BL,   M1PF, M1BL, PFBL, none

    var P0C = ~0xf800;   //  1111 1000 0000 0000
    var P1C = ~0x8780;   //  1000 0111 1000 0000
    var M0C = ~0x4470;   //  0100 0100 0111 0000
    var M1C = ~0x224c;   //  0010 0010 0100 1100
    var PFC = ~0x112a;   //  0001 0001 0010 1010
    var BLC = ~0x0896;   //  0000 1000 1001 0110


    // Variables  ---------------------------------------------------

    var cpu = pCpu;
    var pia = pPia;
    var bus;

    var powerOn = false;

    var clock, changeClock, changeClockPrevLine, renderClock;
    var linePixels = new Uint32Array(LINE_WIDTH);

    var vSyncOn = false;
    var vBlankOn = false;
    var vBlankColor = VBLANK_COLOR;
    var hBlankColor = HBLANK_COLOR;

    var playfieldEnabled = false, playfieldPatternL = 0, playfieldPatternR = 0;
    var playfieldColor = 0xff000000, playfieldLeftColor = 0xff000000, playfieldRightColor = 0xff000000;
    var playfieldBackground = 0xff000000;
    var playfieldReflected = false;
    var playfieldScoreMode = false;
    var playfieldPriority = false;

    var ballEnabled = false, ballPixel = 0, ballLineSpritePointer = 0;
    var ballColor = 0xff000000;

    var player0Enabled = false, player0Pixel = 0, player0LineSpritePointer = 0;
    var player0Alt = 0, player0AltFrom = 0, player0AltLength = 0, player0AltCopyOffset = 0;
    var player0AltControl = new Uint32Array(2 * 256 * 8);
    var player0Color = 0xff000000;

    var player1Enabled = false, player1Pixel = 0, player1LineSpritePointer = 0;
    var player1Alt = 0, player1AltFrom = 0, player1AltLength = 0, player1AltCopyOffset = 0;
    var player1AltControl = new Uint32Array(2 * 256 * 8);
    var player1Color = 0xff000000;

    var missile0Enabled = false, missile0Pixel = 0, missile0LineSpritePointer = 0;
    var missile0Alt = 0, missile0AltFrom = 0, missile0AltLength = 0, missile0AltCopyOffset = 0;
    var missile0AltControl = new Uint32Array(4 * 8);
    var missile0Color = 0xff000000;

    var missile1Enabled = false, missile1Pixel = 0, missile1LineSpritePointer = 0;
    var missile1Alt = 0, missile1AltFrom = 0, missile1AltLength = 0, missile1AltCopyOffset = 0;
    var missile1AltControl = new Uint32Array(4 * 8);
    var missile1Color = 0xff000000;

    var hMoveHitBlank = false;
    var hMoveHitClock = 0;
    var hMoveLateHit = false;
    var hMoveLateHitBlank = false;

    var collisions = 0, collisionsPossible = 0;

    var debug = false;
    var debugLevel = 0;
    var debugNoCollisions = false;
    var debugPixels = new Uint32Array(LINE_WIDTH);

    var controlsButtonsLatched = false;
    var controlsJOY0ButtonPressed = false;
    var controlsJOY1ButtonPressed = false;

    var paddleCapacitorsGrounded = false;
    var paddle0Position = -1;			                                    // 380 = Left, 190 = Middle, 0 = Right. -1 = disconnected, won't charge POTs
    var paddle0CapacitorCharge = 0;
    var paddle1Position = -1;
    var paddle1CapacitorCharge = 0;


    var playerLineSprites = new Uint8Array(2 * 256 * 8 * 64);               // 2 Mirrors * 256 Patterns * 8 Variations * (1 base + 2 alts) * 20 8Bits line data specifying 1bit pixels + 4 bytes spare
    var missileBallLineSprites = new Uint8Array(4 * 8 * 64);                // 4 Sizes * 8 Variations * (1 base + 2 alts) * 20 8Bits line data specifying 1bit pixels + 4 bytes spare

    var playerCopyLengthPerShape = new Uint8Array([13, 13, 13, 13, 13, 22, 13, 38]);
    var playerScanStartPerShape =  new Uint8Array([5, 5, 5, 5, 5, 6, 5, 6]);
    var playerPixelSizePerShape =  new Uint8Array([1, 1, 1, 1, 1, 2, 1, 4]);

    var playerCopyOffsetsReset = new Uint8Array(8 * 160);                   // 8 Variations * 160 1 byte data with copy pixel position
    var playerScanOffsetsShape = new Uint8Array(8 * 160);                   // 8 Variations * 160 1 byte data with copy pixel position

    var missileCopyOffsetsReset = new Uint8Array(4 * 8 * 160);              // 4 Sizes * 8 Variations * 160 1 byte data with copy pixel position
    var missileScanOffsetsShape = new Uint8Array(4 * 8 * 160);              // 4 Sizes * 8 Variations * 160 1 byte data with copy pixel position

    var objectsLineSpritePointerDeltaToSingleCopy = new Uint16Array([0 * 64, 1 * 64, 2 * 64, 3 * 64, 4 * 64, 0 * 64, 6 * 64, 0 * 64]);

    var missileCenterOffsetsPerPlayerSize = new Uint8Array([ 5, 5, 5, 5, 5, 10, 5, 18 ]);

    var videoSignal = new jt.VideoSignal();
    var palette;

    var audioSignal = new jt.TiaAudio(audioSocket);


    // Read registers -------------------------------------------

    var INPT0 =  0;     // Paddle0 Left pot port
    var INPT1 =  0;     // Paddle0 Right pot port
    var INPT2 =  0;     // Paddle1 Left pot port
    var INPT3 =  0;     // Paddle1 Right pot port
    var INPT4 =  0;     // input (Joy0 button)
    var INPT5 =  0;     // input (Joy1 button)


    // Write registers  ------------------------------------------

    var CTRLPF = 0;     // ..11.111  control playfield ball size & collisions
    var COLUPF = 0;     // 11111111  playfield and ball color
    var COLUBK = 0;     // 11111111  playfield background color
    var PF0 = 0;		// 1111....  playfield register byte 0
    var PF1 = 0;		// 11111111  playfield register byte 1
    var PF2 = 0;		// 11111111  playfield register byte 2
    var ENABL = 0;      // ......1.  graphics (enable) ball
    var ENABLd = 0;     // ......1.  graphics (enable) ball
    var VDELBL = 0;     // .......1  vertical delay ball

    var NUSIZ0 = 0;     // ..111111  number-size player-missile 0
    var COLUP0 = 0;     // 11111111  color-lum player 0 and missile 0
    var REFP0 = 0;      // ....1...  reflect player 0 (>> 3)
    var GRP0 = 0;       // 11111111  graphics player 0
    var GRP0d = 0;      // 11111111  graphics player 0 (delayed)
    var VDELP0 = 0;     // .......1  vertical delay player 0

    var NUSIZ1 = 0;     // ..111111  number-size player-missile 1
    var COLUP1 = 0;     // 11111111  color-lum player 1 and missile 1
    var REFP1 = 0;      // ....1...  reflect player 1 (>> 3)
    var GRP1 = 0;       // 11111111  graphics player 1
    var GRP1d = 0;      // 11111111  graphics player 1 (delayed)
    var VDELP1 = 0;     // .......1  vertical delay player 1

    var ENAM0 = 0;      // ......1.  graphics (enable) missile 0
    var RESMP0 = 0;     // ......1.  reset missile 0 to player 0

    var ENAM1 = 0;      // ......1.  graphics (enable) missile 1
    var RESMP1 = 0;     // ......1.  reset missile 1 to player 1

    var HMP0 = 0;		// 1111....  horizontal motion player 0
    var HMP1 = 0;		// 1111....  horizontal motion player 1
    var HMM0 = 0;		// 1111....  horizontal motion missile 0
    var HMM1 = 0;		// 1111....  horizontal motion missile 1
    var HMBL = 0;		// 1111....  horizontal motion ball

    var AUDC0 = 0;		// ....1111  audio control 0
    var AUDC1 = 0;		// ....1111  audio control 1
    var AUDF0 = 0;		// ...11111  audio frequency 0
    var AUDF1 = 0;		// ...11111  audio frequency 1
    var AUDV0 = 0;		// ....1111  audio volume 0
    var AUDV1 = 0;		// ....1111  audio volume 1

    init();

    self.eval = function(code) {
        return eval(code);
    }

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Clock Pulse generator. Intended to be synchronized with Host machine Video Frequency whenever possible

jt.Clock = function(clockPulse) {
"use strict";

    this.go = function() {
        if (!running) {
            //lastPulseTime = jt.Util.performanceNow();
            //timeMeasures = [];

            useRequestAnimationFrame = vSynch && (cyclesPerSecond === jt.Clock.HOST_NATIVE_FPS);

            running = true;
            if (useRequestAnimationFrame)
                animationFrame = requestAnimationFrame(pulse);
            else
                interval = setInterval(pulse, cycleTimeMs);
        }
    };

    this.pause = function() {
        running = false;
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    };

    this.isRunning = function() {
        return running;
    };

    this.getFrequency = function() {
        return cyclesPerSecond;
    };

    this.setFrequency = function(freq) {
        if (running) {
            this.pause();
            internalSetFrequency(freq);
            this.go();
        } else {
            internalSetFrequency(freq);
        }
    };

    this.setVSynch = function(boo) {
        if (running) {
            this.pause();
            vSynch = boo;
            this.go();
        } else {
            vSynch = boo;
        }
    };

    var internalSetFrequency = function(freq) {
        cyclesPerSecond = freq;
        cycleTimeMs = 1000 / freq;
    };

    var pulse = function() {
        //var pulseTime = jt.Util.performanceNow();
        //timeMeasures[timeMeasures.length] = pulseTime - lastPulseTime;
        //lastPulseTime = pulseTime;

        animationFrame = null;
        clockPulse();
        if (useRequestAnimationFrame && !animationFrame)
            animationFrame = requestAnimationFrame(pulse);

        //console.log(jt.Util.performanceNow() - pulseTime);
    };

    //this.getMeasures = function() {
    //    return timeMeasures;
    //};

    this.eval = function(str) {
        return eval(str);
    };


    var running = false;

    var cyclesPerSecond = 1;
    var cycleTimeMs = 1000;
    var useRequestAnimationFrame;
    var animationFrame = null;
    var interval = null;
    var vSynch = true;

    //var timeMeasures = [];
    //var lastPulseTime = 0;

};

jt.Clock.HOST_NATIVE_FPS = Javatari.SCREEN_FORCE_HOST_NATIVE_FPS;         // -1 = Unknown or not detected

jt.Clock.detectHostNativeFPSAndCallback = function(callback) {

    if (Javatari.SCREEN_VSYNCH_MODE === -1) {
        jt.Util.warning("Video native V-Synch disabled in configuration");
        if (callback) callback(jt.Clock.HOST_NATIVE_FPS);
        return;
    }

    if (jt.Clock.HOST_NATIVE_FPS !== -1) {
        jt.Util.warning("Host video frequency forced in configuration: " + jt.Clock.HOST_NATIVE_FPS);
        if (callback) callback(jt.Clock.HOST_NATIVE_FPS);
        return;
    }

    // Start detection

    var tries = 0;
    var samples = [];
    var lastTime = 0;
    var good60 = 0, good50 = 0, good120 = 0, good100 = 0;
    var tolerance = 0.06;

    var sampler = function() {

        // Detected?
        if (good60 >= 10 || good50 >= 10 || good120 >= 10 || good100 >= 10) {
            jt.Clock.HOST_NATIVE_FPS = good60 >= 10 ? 60 : good50 >= 10 ? 50 : good120 >= 10 ? 120 : 100;
            jt.Util.log("Video native frequency detected: " + jt.Clock.HOST_NATIVE_FPS + "Hz");
            if (callback) callback(jt.Clock.HOST_NATIVE_FPS);
            return;
        }

        tries++;
        if (tries <= 50) {
            var currentTime = jt.Util.performanceNow();
            var sample = currentTime - lastTime;
            samples[samples.length] = sample;
            lastTime = currentTime;

            if ((sample >= (1000 / 60) *  (1 - tolerance)) && (sample <= (1000 / 60) *  (1 + tolerance))) good60++;
            if ((sample >= (1000 / 50) *  (1 - tolerance)) && (sample <= (1000 / 50) *  (1 + tolerance))) good50++;
            if ((sample >= (1000 / 120) * (1 - tolerance)) && (sample <= (1000 / 120) * (1 + tolerance))) good120++;
            if ((sample >= (1000 / 100) * (1 - tolerance)) && (sample <= (1000 / 100) * (1 + tolerance))) good100++;

            requestAnimationFrame(sampler);
        } else {
            jt.Clock.HOST_NATIVE_FPS = -1;
            jt.Util.warning("Could not detect video native frequency. V-Synch DISABLED!");
            if (callback) callback(jt.Clock.HOST_NATIVE_FPS);
        }
    };

    sampler();

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Bus = function(pCpu, pTia, pPia, pRam) {
"use strict";

    function init(self) {
        cpu = pCpu;
        tia = pTia;
        pia = pPia;
        ram = pRam;
        cpu.connectBus(self);
        tia.connectBus(self);
        pia.connectBus(self);
    }

    this.powerOn = function() {
        data = 0;
        if (!cartridge) {
            tia.getVideoOutput().showOSD("NO CARTRIDGE INSERTED!", true);
            // Data in the bus comes random at powerOn if no Cartridge is present
            data = (Math.random()* 256) | 0;
        }
        // Power on devices connected to the BUS
        if (cartridge != null) cartridge.powerOn();
        ram.powerOn();
        pia.powerOn();
        cpu.powerOn();
        tia.powerOn();
    };

    this.powerOff = function() {
        tia.powerOff();
        cpu.powerOff();
        pia.powerOff();
        ram.powerOff();
    };

    this.setCartridge = function(pCartridge) {
        cartridge = pCartridge;
        if (cartridge) {
            data = 0;
            cartridge.connectBus(this);
        }
        cartridgeNeedsBusMonitoring = cartridge && cartridge.needsBusMonitoring();
    };

    this.getCartridge = function() {
        return cartridge;
    };

    this.getTia = function() {
        return tia;
    };

    this.clockPulse = function() {
        pia.clockPulse();
        cpu.clockPulse();
    };

    this.read = function(address) {
        // CART Bus monitoring
        if (cartridgeNeedsBusMonitoring) cartridge.monitorBusBeforeRead(address, data);

        if ((address & CART_MASK) === CART_SELECT) {
            if (cartridge) return data = cartridge.read(address);
            else return data;
        } else if ((address & RAM_MASK) === RAM_SELECT) {
            return data = ram.read(address);
        } else if ((address & PIA_MASK) === PIA_SELECT) {
            return data = pia.read(address);
        } else {
            // Only bit 7 and 6 are connected to TIA read registers.
            return data = data & 0x3f | tia.read(address);		// Use the retained data for bits 5-0
        }
    };

    this.write = function(address, val) {
        // CART Bus monitoring
        if (cartridgeNeedsBusMonitoring) cartridge.monitorBusBeforeWrite(address, val);

        data = val;

        if ((address & TIA_MASK) === TIA_SELECT) tia.write(address, val);
        else if ((address & RAM_MASK) === RAM_SELECT) ram.write(address, val);
        else if ((address & PIA_MASK) === PIA_SELECT) pia.write(address, val);
        else if (cartridge) cartridge.write(address, val);
    };


    var cpu;
    var tia;
    var pia;
    var ram;
    var cartridge;
    var cartridgeNeedsBusMonitoring = false;

    var data = 0;


    var CART_MASK = 0x1000;
    var CART_SELECT = 0x1000;
    var RAM_MASK = 0x1280;
    var RAM_SELECT = 0x0080;
    var TIA_MASK = 0x1080;
    var TIA_SELECT = 0x0000;
    var PIA_MASK = 0x1280;
    var PIA_SELECT = 0x0280;


    init(this);

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.AtariConsole = function() {
"use strict";

    var self = this;

    function init() {
        mainComponentsCreate();
        socketsCreate();
        self.setDefaults();
    }

    this.powerOn = function() {
		self.flushCorruption();
        if (this.powerIsOn) this.powerOff();
        bus.powerOn();
        this.powerIsOn = true;
        consoleControlsSocket.controlsStatesRedefined();
        updateVideoSynchronization();
        videoStandardAutoDetectionStart();
        consoleControlsSocket.firePowerAndUserPauseStateUpdate();
        if (!mainVideoClock.isRunning()) mainVideoClock.go();
    };

    this.powerOff = function() {
        bus.powerOff();
        this.powerIsOn = false;
        consoleControlsSocket.releaseControllers();
        consoleControlsSocket.controlsStatesRedefined();
        if (userPaused) this.userPause(false);
        else consoleControlsSocket.firePowerAndUserPauseStateUpdate();
    };

    this.userPowerOn = function() {
        if (!isLoading) this.powerOn();
    };

    this.setLoading = function(state) {
        isLoading = state;
    };

    this.userPause = function(pause, keepAudio) {
        var prev = userPaused;
        if (userPaused !== pause) {
            userPaused = !!pause; userPauseMoreFrames = -1;
            if (userPaused && !keepAudio) audioSocket.muteAudio();
            else audioSocket.unMuteAudio();
            consoleControlsSocket.firePowerAndUserPauseStateUpdate();
        }
        return prev;
    };

    this.systemPause = function(val) {
        var prev = systemPaused;
        if (systemPaused !== val) {
            systemPaused = !!val;
            if (systemPaused) audioSocket.pauseAudio();
            else audioSocket.unpauseAudio();
        }
        return prev;
    };

    this.isSystemPaused = function() {
        return systemPaused;
    };
	
	this.flushCorruption = function() {
		corruptCheckpoint = [];
		corruptCheckpointTime = -1;
	}
	
	this.doCorruptBytes = function() {
		// recovery still fails because CPU loses the
		// instruction set or somesuch.
		// we may need to wait for one frame 
		if (corruptCheckpoint.length > 0 && 
			corruptCheckpointTime > 8) {
			var cp = corruptCheckpoint[0];
			loadState(cp);
            self.showOSD("Recovered", true);
		}
		else if (corruptCheckpointTime < 0) {
			corruptCheckpoint.push(saveState());
			if (corruptCheckpoint.length > 100)
				corruptCheckpoint.shift();
			corruptCheckpointTime = 0;
			console.trace("checked in");
		}
		else {
			corruptCheckpointTime += 1;
		}
		var position = Math.floor(Math.random() * (128));
		var value = Math.floor(Math.random() * (256));
		var original_value = ram.read(position);
		ram.write(position, (original_value+1)%256);
	};

    this.videoClockPulse = function() {
        if (systemPaused) return;

        consoleControlsSocket.controlsClockPulse();

        if (!self.powerIsOn) return;
		
        if (videoPulldown.steps === 1) {
            // Simple pulldown with 1:1 cadence
            videoFrame();
        } else {
            // Complex pulldown
            var pulls = videoPulldown.cadence[--videoPulldownStep];
            if (videoPulldownStep === 0) videoPulldownStep = videoPulldown.steps;
            while(pulls > 0) {
                pulls--;
                videoFrame();
            }
        }
		
		// corruption waits until we've rendered at least
		// one frame so that it's initialized.
		if (corruptBytes) self.doCorruptBytes();

        // Finish audio signal (generate any missing samples to adjust to sample rate)
        audioSocket.audioFinishFrame();
    };

    function videoFrame() {
        if (userPaused && userPauseMoreFrames-- <= 0) return;
        if (videoStandardAutoDetectionInProgress) videoStandardAutoDetectionTry();
		pia.read_recently = false;
        tia.frame();
		if (pia.read_recently)
			corruptCheckpointTime = -1;
    }

    this.getCartridgeSocket = function() {
        return cartridgeSocket;
    };

    this.getConsoleControlsSocket = function() {
        return consoleControlsSocket;
    };

    this.getVideoOutput = function() {
        return tia.getVideoOutput();
    };

    this.getAudioOutput = function() {
        return tia.getAudioOutput();
    };

    this.getSavestateSocket = function() {
        return saveStateSocket;
    };

    this.getAudioSocket = function() {
        return audioSocket;
    };

    this.showOSD = function(message, overlap) {
        this.getVideoOutput().showOSD(message, overlap);
    };

    this.vSynchSetSupported = function(boo) {
        // To be called once and only by Room during Native Video Freq detection
        vSynchMode = boo
            ? Javatari.userPreferences.current.vSynch === null ? Javatari.SCREEN_VSYNCH_MODE : Javatari.userPreferences.current.vSynch
            : -1;
    };

    function vSynchToggleMode() {
        if (vSynchMode === -1) {
            self.showOSD("V-Synch is DISABLED / UNSUPPORTED", true, true);
            return;
        }
        vSynchMode = vSynchMode ? 0 : 1;
        updateVideoSynchronization();
        self.showOSD("V-Synch: " + (vSynchMode ? "ON" : "OFF"), true);

        // Persist
        Javatari.userPreferences.current.vSynch = vSynchMode;
        Javatari.userPreferences.setDirty();
        Javatari.userPreferences.save();
    }

    var setCartridge = function(cartridge) {
        Javatari.cartridge = cartridge;
        var removedCartridge = getCartridge();
        bus.setCartridge(cartridge);
        cartridgeSocket.cartridgeInserted(cartridge, removedCartridge);
    };

    var getCartridge = function() {
        return bus.getCartridge();
    };

    var setVideoStandard = function(pVideoStandard) {
        if (videoStandard !== pVideoStandard) {
            videoStandard = pVideoStandard;
            tia.setVideoStandard(videoStandard);
            updateVideoSynchronization();
        }
        self.showOSD((videoStandardIsAuto ? "AUTO: " : "") + videoStandard.name, false);
    };

    var setVideoStandardAuto = function() {
        videoStandardIsAuto = true;
        if (self.powerIsOn) videoStandardAutoDetectionStart();
        else setVideoStandard(jt.VideoStandard.NTSC);
    };

    var videoStandardAutoDetectionStart = function() {
        if (!videoStandardIsAuto || videoStandardAutoDetectionInProgress) return;
        // If no Cartridge present, use NTSC
        if (!bus.getCartridge()) {
            setVideoStandard(jt.VideoStandard.NTSC);
            return;
        }
        // Otherwise use the VideoStandard detected by the monitor
        if (!tia.getVideoOutput().monitor) return;
        videoStandardAutoDetectionInProgress = true;
        videoStandardAutoDetectionTries = 0;
        tia.getVideoOutput().monitor.videoStandardDetectionStart();
    };

    var videoStandardAutoDetectionTry = function() {
        videoStandardAutoDetectionTries++;
        var standard = tia.getVideoOutput().monitor.getVideoStandardDetected();
        if (!standard && videoStandardAutoDetectionTries < VIDEO_STANDARD_AUTO_DETECTION_FRAMES)
            return;

        if (standard) setVideoStandard(standard);
        else self.showOSD("AUTO: FAILED", false);
        videoStandardAutoDetectionInProgress = false;
    };

    var setVideoStandardForced = function(forcedVideoStandard) {
        videoStandardIsAuto = false;
        setVideoStandard(forcedVideoStandard);
    };

    function updateVideoSynchronization() {
        // According to the native video frequency detected, target Video Standard and vSynchMode, use a specific pulldown configuration
        if (vSynchMode === 1) {    // ON
            // Will V-synch to host freq if detected and supported, or use optimal timer configuration)
            videoPulldown = videoStandard.pulldowns[jt.Clock.HOST_NATIVE_FPS] || videoStandard.pulldowns.TIMER;
        } else {                  // OFF, DISABLED
            // No V-synch. Always use the optimal timer configuration)
            videoPulldown = videoStandard.pulldowns.TIMER;
        }

        videoPulldownStep = videoPulldown.steps;
        mainVideoClockUpdateSpeed();

        //console.error("Update Synchronization: " + videoPulldown.frequency);
    }

    var powerFry = function() {
        ram.powerFry();
    };

    var cycleCartridgeFormat = function() {
    };

    var saveState = function() {
        return {
            t: tia.saveState(),
            p: pia.saveState(),
            r: ram.saveState(),
            c: cpu.saveState(),
            ca: getCartridge() && getCartridge().saveState(),
            vs: videoStandard.name
        };
    };

    var loadState = function(state) {
        mainVideoClockUpdateSpeed();
        tia.loadState(state.t);
        pia.loadState(state.p);
        ram.loadState(state.r);
        cpu.loadState(state.c);
        setCartridge(state.ca && jt.CartridgeCreator.recreateCartridgeFromSaveState(state.ca, getCartridge()));
        setVideoStandard(jt.VideoStandard[state.vs]);
        consoleControlsSocket.controlsStatesRedefined();
    };

    this.setDefaults = function() {
        setVideoStandardAuto();
        speedControl = 1;
        alternateSpeed = null;
        mainVideoClockUpdateSpeed();
        tia.debug(0);
    };

    function mainVideoClockUpdateSpeed() {
        var freq = videoPulldown.frequency;
        mainVideoClock.setVSynch(vSynchMode > 0);
        mainVideoClock.setFrequency((freq * (alternateSpeed || speedControl)) | 0);
        audioSocket.setFps(freq);
    }

    var mainComponentsCreate = function() {
        // Main clock will be the Tia Frame VideoClock (60Hz/50Hz)
        // CPU and other clocks (Pia, Audio) will be sent by the Tia
        self.mainVideoClock = mainVideoClock = new jt.Clock(self.videoClockPulse);

        cpu = new jt.M6502();
        pia = new jt.Pia();
        tia = new jt.Tia(cpu, pia);
        self.tia = tia;
        ram = new jt.Ram();
        bus = new jt.Bus(cpu, tia, pia, ram);
    };

    var socketsCreate = function() {
        consoleControlsSocket = new ConsoleControlsSocket();
        cartridgeSocket = new CartridgeSocket();
        saveStateSocket = new SaveStateSocket();
        audioSocket = new AudioSocket();
        tia.getAudioOutput().connectAudioSocket(audioSocket);
    };


    this.powerIsOn = false;

    var isLoading = false;
    var userPaused = false;
    var userPauseMoreFrames = 0;
    var systemPaused = false;

    var speedControl = 1;
    var alternateSpeed = false;
	
	var corruptBytes = true;
	var corruptCheckpoint;
	var corruptCheckpointTime = 0;

    var mainVideoClock;
    var cpu;
    var pia;
    var tia;
    var ram;
    var bus;

    var videoStandard;
    var videoPulldown, videoPulldownStep;

    var consoleControlsSocket;
    var cartridgeSocket;
    var saveStateSocket;
    var audioSocket;

    var videoStandardIsAuto = false;
    var videoStandardAutoDetectionInProgress = false;
    var videoStandardAutoDetectionTries = 0;

    var vSynchMode = -1;

    var VIDEO_STANDARD_AUTO_DETECTION_FRAMES = 90;

    var SPEEDS = [ 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 2, 3, 5, 10 ];
    var SPEED_FAST = 10, SPEED_SLOW = 0.3;


    // Controls interface  --------------------------------------------

    var controls = jt.ConsoleControls;

    this.controlStateChanged = function (control, state) {
        // Normal state controls
        if (control === controls.FAST_SPEED) {
            if (state && alternateSpeed !== SPEED_FAST) {
                alternateSpeed = SPEED_FAST;
                mainVideoClockUpdateSpeed();
                self.showOSD("FAST FORWARD", true);
            } else if (!state && alternateSpeed === SPEED_FAST) {
                alternateSpeed = null;
                mainVideoClockUpdateSpeed();
                self.showOSD(null, true);
            }
            return;
        }
        if (control === controls.SLOW_SPEED) {
            if (state && alternateSpeed !== SPEED_SLOW) {
                alternateSpeed = SPEED_SLOW;
                mainVideoClockUpdateSpeed();
                self.showOSD("SLOW MOTION", true);
            } else if (!state && alternateSpeed === SPEED_SLOW) {
                alternateSpeed = null;
                mainVideoClockUpdateSpeed();
                self.showOSD(null, true);
            }
            return;
        }
        // Toggles
        if (!state) return;
        switch (control) {
            case controls.POWER:
                if (self.powerIsOn) self.powerOff();
                else self.userPowerOn();
                break;
            case controls.POWER_OFF:
                if (self.powerIsOn) self.powerOff();
                break;
            case controls.POWER_FRY:
                powerFry();
                break;
            case controls.PAUSE:
                self.userPause(!userPaused, false);
                self.getVideoOutput().showOSD(userPaused ? "PAUSE" : "RESUME", true);
                return;
            case controls.PAUSE_AUDIO_ON:
                self.userPause(!userPaused, true);
                self.getVideoOutput().showOSD(userPaused ? "PAUSE with AUDIO ON" : "RESUME", true);
                return;
            case controls.FRAME:
                if (userPaused) userPauseMoreFrames = 1;
                return;
            case controls.INC_SPEED: case controls.DEC_SPEED: case controls.NORMAL_SPEED: case controls.MIN_SPEED:
                var speedIndex = SPEEDS.indexOf(speedControl);
                if (control === controls.INC_SPEED && speedIndex < SPEEDS.length - 1) ++speedIndex;
                else if (control === controls.DEC_SPEED && speedIndex > 0) --speedIndex;
                else if (control === controls.MIN_SPEED) speedIndex = 0;
                else if (control === controls.NORMAL_SPEED) speedIndex = SPEEDS.indexOf(1);
                speedControl = SPEEDS[speedIndex];
                self.showOSD("Speed: " + ((speedControl * 100) | 0) + "%", true);
                mainVideoClockUpdateSpeed();
                break;
            case controls.SAVE_STATE_0: case controls.SAVE_STATE_1: case controls.SAVE_STATE_2: case controls.SAVE_STATE_3: case controls.SAVE_STATE_4: case controls.SAVE_STATE_5:
            case controls.SAVE_STATE_6: case controls.SAVE_STATE_7: case controls.SAVE_STATE_8: case controls.SAVE_STATE_9: case controls.SAVE_STATE_10: case controls.SAVE_STATE_11: case controls.SAVE_STATE_12:
                var wasPaused = self.systemPause(true);
                saveStateSocket.saveState(control.to);
                if (!wasPaused) self.systemPause(false);
                break;
            case controls.SAVE_STATE_FILE:
                wasPaused = self.systemPause(true);
                saveStateSocket.saveStateFile();
                if (!wasPaused) self.systemPause(false);
                break;
            case controls.LOAD_STATE_0: case controls.LOAD_STATE_1: case controls.LOAD_STATE_2: case controls.LOAD_STATE_3: case controls.LOAD_STATE_4: case controls.LOAD_STATE_5:
            case controls.LOAD_STATE_6: case controls.LOAD_STATE_7: case controls.LOAD_STATE_8: case controls.LOAD_STATE_9: case controls.LOAD_STATE_10: case controls.LOAD_STATE_11: case controls.LOAD_STATE_12:
                wasPaused = self.systemPause(true);
                saveStateSocket.loadState(control.from);
                if (!wasPaused) self.systemPause(false);
            break;
            case controls.VIDEO_STANDARD:
                self.showOSD(null, true);	// Prepares for the upcoming "AUTO" OSD to always show
                if (videoStandardIsAuto) setVideoStandardForced(jt.VideoStandard.NTSC);
                else if (videoStandard == jt.VideoStandard.NTSC) setVideoStandardForced(jt.VideoStandard.PAL);
                else setVideoStandardAuto();
                break;
            case controls.VSYNCH:
                vSynchToggleMode();
                break;
            case controls.CARTRIDGE_FORMAT:
                cycleCartridgeFormat();
                break;
        }
    };

    this.controlsStateReport = function (report) {
        //  Only Power Control is visible from outside
        report[controls.POWER] = self.powerIsOn;
    };


    // CartridgeSocket  -----------------------------------------

    function CartridgeSocket() {

        this.insert = function (cartridge, autoPower) {
            if (autoPower && self.powerIsOn) self.powerOff();
            setCartridge(cartridge);
            if (autoPower && !self.powerIsOn) self.powerOn();
        };

        this.inserted = function () {
            return getCartridge();
        };

        this.cartridgeInserted = function (cartridge, removedCartridge) {
            tia.getAudioOutput().cartridgeInserted(cartridge, removedCartridge);
            consoleControlsSocket.cartridgeInserted(cartridge, removedCartridge);
            saveStateSocket.cartridgeInserted(cartridge, removedCartridge);
            tia.getVideoOutput().monitor.cartridgeInserted(cartridge, removedCartridge);
        };

        // Data operations unavailable
        this.loadCartridgeData = function (port, name, arrContent) {
        };
        this.saveCartridgeDataFile = function (port) {
        };

    }


    // ConsoleControlsSocket  -----------------------------------------

    function ConsoleControlsSocket() {

        this.setDefaults = function() {
            self.setDefaults();
        };

        this.connectControls = function(pControls) {
            controls = pControls;
        };

        this.cartridgeInserted = function(cartridge, removedCartridge) {
            if (controls) controls.cartridgeInserted(cartridge, removedCartridge);
        };

        this.controlStateChanged = function(control, state) {
            self.controlStateChanged(control, state);
            pia.controlStateChanged(control, state);
            tia.controlStateChanged(control, state);
            tia.getVideoOutput().monitor.controlStateChanged(control, state);
        };

        this.controlValueChanged = function(control, position) {
            tia.controlValueChanged(control, position);
        };

        this.controlsStateReport = function(report) {
            self.controlsStateReport(report);
            pia.controlsStateReport(report);
        };

        this.controlsStatesRedefined = function() {
            tia.getVideoOutput().monitor.controlsStatesRedefined();
        };

        this.firePowerAndUserPauseStateUpdate = function() {
            controls.consolePowerAndUserPauseStateUpdate(self.powerIsOn, userPaused);
            tia.getVideoOutput().monitor.consolePowerAndUserPauseStateUpdate(self.powerIsOn, userPaused);
        };

        this.releaseControllers = function() {
            controls.releaseControllers();
        };

        this.controlsClockPulse = function() {
            controls.controlsClockPulse();
        };

        this.getControlReport = function(control) {
            switch(control) {
                case jt.ConsoleControls.VIDEO_STANDARD:
                    return { label: videoStandardIsAuto ? "Auto" : videoStandard.name, active: !videoStandardIsAuto };
                case jt.ConsoleControls.VSYNCH:
                    return { label: vSynchMode === -1 ? "DISABL" : vSynchMode ? "ON" : "OFF", active: vSynchMode === 1 };
                case jt.ConsoleControls.NO_COLLISIONS:
                    return { label: tia.getDebugNoCollisions() ? "ON" : "OFF", active: tia.getDebugNoCollisions() };
                default:
                    return { label: "Unknown", active: false };
            }
        };

        var controls;
    }


    // SavestateSocket  -----------------------------------------

    function SaveStateSocket() {

        this.connectMedia = function(pMedia) {
            media = pMedia;
        };

        this.getMedia = function() {
            return media;
        };

        this.cartridgeInserted = function(cartridge) {
            if (cartridge) cartridge.connectSaveStateSocket(this);
        };

        this.externalStateChange = function() {
            // Nothing (no Multiplayer yet)
        };

        this.saveState = function(slot) {
            if (!self.powerIsOn) return;
            var state = saveState();
            state.v = VERSION;
            if (media.saveState(slot, state))
                self.showOSD("State " + slot + " saved", true);
            else
                self.showOSD("State " + slot + " save failed", true);
        };

        this.loadState = function(slot) {
            var state = media.loadState(slot);
            if (!state) {
                self.showOSD("State " + slot + " not found", true);
                return;
            }
            if (state.v !== VERSION) {
                self.showOSD("State " + slot + " load failed, wrong version", true);
                return;
            }
            if (!self.powerIsOn) self.powerOn();
            loadState(state);
            self.showOSD("State " + slot + " loaded", true);
        };

        this.saveStateFile = function() {
            if (!self.powerIsOn) return;
            // Use Cartrige label as file name
            var fileName = cartridgeSocket.inserted() && cartridgeSocket.inserted().rom.info.l;
            var state = saveState();
            state.v = VERSION;
            if (media.saveStateFile(fileName, state))
                self.showOSD("State Cartridge saved", true);
            else
                self.showOSD("State file save failed", true);
        };

        this.loadStateFile = function(data) {       // Return true if data was indeed a SaveState
            var state = media.loadStateFile(data);
            if (!state) return;
            if (state.v !== VERSION) {
                self.showOSD("State file load failed, wrong version", true);
                return true;
            }
            if (!self.powerIsOn) self.powerOn();
            loadState(state);
            self.showOSD("State file loaded", true);
            return true;
        };

        var media;
        var VERSION = 2;
    }


    // Audio Socket  ---------------------------------------------

    function AudioSocket() {

        this.connectMonitor = function (pMonitor) {
            monitor = pMonitor;
            for (var i = signals.length - 1; i >= 0; i--) monitor.connectAudioSignal(signals[i]);
        };

        this.connectAudioSignal = function(signal) {
            if (signals.indexOf(signal) >= 0) return;
            jt.Util.arrayAdd(signals, signal);
            this.flushAllSignals();                            // To always keep signals in synch
            signal.setFps(fps);
            if (monitor) monitor.connectAudioSignal(signal);
        };

        this.disconnectAudioSignal = function(signal) {
            jt.Util.arrayRemoveAllElement(signals, signal);
            if (monitor) monitor.disconnectAudioSignal(signal);
        };

        this.audioClockPulse = function() {
            for (var i = signals.length - 1; i >= 0; --i) signals[i].audioClockPulse();
        };

        this.audioFinishFrame = function() {
            for (var i = signals.length - 1; i >= 0; --i) signals[i].audioFinishFrame();
        };

        this.muteAudio = function() {
            if (monitor) monitor.mute();
        };

        this.unMuteAudio = function() {
            if (monitor) monitor.unMute();
        };

        this.setFps = function(pFps) {
            fps = pFps;
            for (var i = signals.length - 1; i >= 0; --i) signals[i].setFps(fps);
        };

        this.pauseAudio = function() {
            if (monitor) monitor.pause();
        };

        this.unpauseAudio = function() {
            if (monitor) monitor.unpause();
        };

        this.flushAllSignals = function() {
            for (var i = signals.length - 1; i >= 0; --i) signals[i].flush();
        };

        var signals = [];
        var monitor;
        var fps;
    }


    // Debug methods  ------------------------------------------------------

    this.runFramesAtTopSpeed = function(frames) {
        mainVideoClock.pause();
        var start = jt.Util.performanceNow();
        for (var i = 0; i < frames; i++) {
            //var pulseTime = jt.Util.performanceNow();
            self.videoClockPulse();
            //console.log(jt.Util.performanceNow() - pulseTime);
        }
        var duration = jt.Util.performanceNow() - start;
        jt.Util.log("Done running " + frames + " frames in " + (duration | 0) + " ms");
        jt.Util.log((frames / (duration/1000)).toFixed(2) + "  frames/sec");
        mainVideoClock.go();
    };

    this.eval = function(str) {
        return eval(str);
    };


    init();

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.JoystickButtons = {

    // Real Atari 2600 buttons, register mask
    J_UP:     { button: "J_UP",    mask: 0x01, n: "UP" },
    J_DOWN:   { button: "J_DOWN",  mask: 0x02, n: "DOWN" },
    J_LEFT:   { button: "J_LEFT",  mask: 0x04, n: "LEFT" },
    J_RIGHT:  { button: "J_RIGHT", mask: 0x08, n: "RIGHT" },
    J_A:      { button: "J_A",     mask: 0x10, n: "A" },
    J_B:      { button: "J_B",     mask: 0x20, n: "B" },

    J_AB:     { button: "J_AB",    mask: 0x30, n: "AB" },        // Special case, both A and B buttons

    // Virtual buttons, no valid mask
    J_X:      { button: "J_X",     n: "X" },
    J_Y:      { button: "J_Y",     n: "Y" },
    J_L:      { button: "J_L",     n: "L" },
    J_R:      { button: "J_R",     n: "R" },
    J_BACK:   { button: "J_BACK",  n: "BACK" },
    J_START:  { button: "J_START", n: "START" }

};


// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.ConsoleControls = {

    JOY0_UP: 11, JOY0_DOWN: 12, JOY0_LEFT: 13, JOY0_RIGHT: 14, JOY0_BUTTON: 15,
    JOY1_UP: 21, JOY1_DOWN: 22, JOY1_LEFT: 23, JOY1_RIGHT: 24, JOY1_BUTTON: 25,
    PADDLE0_POSITION: 31, PADDLE1_POSITION: 32,		// Position from 380 (Left) to 190 (Center) to 0 (Right); -1 = disconnected, won't charge POTs
    PADDLE0_BUTTON: 41, PADDLE1_BUTTON: 42,

    POWER: 51, BLACK_WHITE: 52, SELECT: 53, RESET: 54,
    DIFFICULTY0: 55, DIFFICULTY1: 56,
    POWER_OFF: 57, POWER_FRY: 58,

    CARTRIDGE_FORMAT: 91,

    DEBUG: 101, TRACE: 102, SHOW_INFO: 103, NO_COLLISIONS: 104, PAUSE: 105, PAUSE_AUDIO_ON: 106, FRAME: 107,
    FAST_SPEED: 111, SLOW_SPEED: 112, INC_SPEED: 113, DEC_SPEED: 114, NORMAL_SPEED: 115, MIN_SPEED: 116,

    VIDEO_STANDARD: 123, VSYNCH: 124,

    SAVE_STATE_0: {to: 0}, SAVE_STATE_1: {to: 1}, SAVE_STATE_2: {to: 2}, SAVE_STATE_3: {to: 3}, SAVE_STATE_4: {to: 4}, SAVE_STATE_5: {to: 5},
    SAVE_STATE_6: {to: 6}, SAVE_STATE_7: {to: 7}, SAVE_STATE_8: {to: 8}, SAVE_STATE_9: {to: 9}, SAVE_STATE_10: {to: 10}, SAVE_STATE_11: {to: 11}, SAVE_STATE_12: {to: 12},
    LOAD_STATE_0: {from: 0}, LOAD_STATE_1: {from: 1}, LOAD_STATE_2: {from: 2}, LOAD_STATE_3: {from: 3}, LOAD_STATE_4: {from: 4}, LOAD_STATE_5: {from: 5},
    LOAD_STATE_6: {from: 6}, LOAD_STATE_7: {from: 7}, LOAD_STATE_8: {from: 8}, LOAD_STATE_9: {from: 9}, LOAD_STATE_10: {from: 10}, LOAD_STATE_11: {from: 11}, LOAD_STATE_12: {from: 12},

    SAVE_STATE_FILE: 201

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.ROM = function(source, content, info, formatHint) {
"use strict";

    this.source = source;
    this.content = content;
    if (info) this.info = info;
    else this.info = jt.CartridgeCreator.produceInfo(this, formatHint);


    // Savestate  -------------------------------------------

    this.saveState = function(includeContent) {
        return {
            s: this.source,
            i: this.info,
            c: includeContent ? jt.Util.compressInt8BitArrayToStringBase64(this.content) : null     // content may not be needed in savestates
        };
    };

};

jt.ROM.loadState = function(state) {
"use strict";
    var c = state.c ? jt.Util.uncompressStringBase64ToInt8BitArray(state.c) : null;
    return new jt.ROM(state.s, c, state.i);
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.
// Many thanks to ROM Hunter for sharing the info!

// Version 20170310

jt.CartridgeDatabase = {

    uncompress: function () {
        // Throw away the compressed version, will be garbage collected
        jt.CartridgeDatabase = JSON.parse(jt.Util.uncompressStringBase64ToString(this.data));
    },

    data: "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"

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Cartridge = function() {
"use strict";

    this.powerOn = function() {
    };

    this.powerOff = function() {
    };

    this.connectBus = function(bus) {
    };

    this.connectSaveStateSocket = function(socket) {
    };

    this.read = function(address) {
    };

    this.write = function(address, val) {
        // Writing to ROMs is possible, but nothing is changed
    };

    this.getDataDesc = function() {
        return null;
    };

    this.needsBusMonitoring = function() {
        return false;
    };

    this.monitorBusBeforeRead = function(address, data)  {
    };

    this.monitorBusBeforeWrite = function(address, val)  {
    };

    this.needsAudioClock = function() {
        return false;
    };

    this.audioClockPulse = function() {
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
    };

    this.loadState = function(state) {
    };


    this.rom = null;

};

jt.Cartridge.base = new jt.Cartridge();

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 4K unbanked format. Smaller ROMs will be copied multiple times to fill the entire 4K

jt.Cartridge4K = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        // Always use a 4K ROM image, multiplying the ROM internally
        bytes = new Array(4096);
        var len = rom.content.length;
        for (var pos = 0; pos < bytes.length; pos += len)
            jt.Util.arrayCopy(rom.content, 0, bytes, pos, len);
    }

    this.read = function(address) {
        return bytes[address & ADDRESS_MASK];
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes)
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
    };


    var bytes;

    var ADDRESS_MASK = 0x0fff;


    if (rom) init(this);

};

jt.Cartridge4K.prototype = jt.Cartridge.base;

jt.Cartridge4K.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge4K();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 2K "CV" Commavid + 1K RAM format

jt.Cartridge2K_CV = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        // Always use a 4K ROM image, multiplying the ROM internally
        bytes = new Array(4096);
        var len = rom.content.length;
        for (var pos = 0; pos < bytes.length; pos += len)
            jt.Util.arrayCopy(rom.content, 0, bytes, pos, len);
    }

    this.read = function(address) {
        var maskedAddress = maskAddress(address);
        // Check for Extra RAM reads
        if (maskedAddress < 0x0400)				// RAM
            return extraRAM[maskedAddress];
        else
            return bytes[maskedAddress];	    // ROM
    };

    this.write = function(address, val) {
        var maskedAddress = maskAddress(address);
        // Check for Extra RAM writes
        if (maskedAddress >= 0x0400 && maskedAddress <= 0x07ff)
            extraRAM[maskedAddress - 0x0400] = val;
    };

    var maskAddress = function(address) {
        return address & ADDRESS_MASK;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b:  jt.Util.compressInt8BitArrayToStringBase64(bytes),
            ra: jt.Util.compressInt8BitArrayToStringBase64(extraRAM)
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        extraRAM = jt.Util.uncompressStringBase64ToInt8BitArray(state.ra, extraRAM);
    };


    var bytes;
    var extraRAM = jt.Util.arrayFill(new Array(1024), 0);

    var ADDRESS_MASK = 0x0fff;


    if (rom) init(this);

};

jt.Cartridge2K_CV.prototype = jt.Cartridge.base;

jt.Cartridge2K_CV.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge2K_CV();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

/**
 * Implements the simple bank switching method by masked address range access (within Cart area)
 * Supports SuperChip extra RAM (ON/OFF/AUTO).
 * Used by several n * 4K bank formats with varying extra RAM sizes
 */

jt.CartridgeBankedByMaskedRange = function(rom, format, pBaseBankSwitchAddress, superChip, pExtraRAMSize) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
        var numBanks = bytes.length / BANK_SIZE;
        baseBankSwitchAddress = pBaseBankSwitchAddress;
        topBankSwitchAddress = baseBankSwitchAddress + numBanks - 1;
        extraRAMSize = pExtraRAMSize;
        // SuperChip mode. null = automatic mode
        if (superChip == null || superChip == undefined) {
            superChipMode = false;
            superChipAutoDetect = true;
        } else {
            superChipMode = !!superChip;
            superChipAutoDetect = false;
        }
        extraRAM = superChip !== false ? jt.Util.arrayFill(new Array(extraRAMSize), 0) : null;
    }

    this.read = function(address) {
        var maskedAddress = maskAddress(address);
        // Check for SuperChip Extra RAM reads
        if (superChipMode && (maskedAddress >= extraRAMSize) && (maskedAddress < extraRAMSize * 2))
            return extraRAM[maskedAddress - extraRAMSize];
        else
        // Always add the correct offset to access bank selected
            return bytes[bankAddressOffset + maskedAddress];
    };

    this.write = function(address, val) {
        var maskedAddress = maskAddress(address);
        // Check for Extra RAM writes and then turn superChip mode on
        if (maskedAddress < extraRAMSize && (superChipMode || superChipAutoDetect)) {
            if (!superChipMode) superChipMode = true;
            extraRAM[maskedAddress] = val;
        }
    };

    var maskAddress = function(address) {
        var maskedAddress = address & ADDRESS_MASK;
        // Check and perform bank-switch as necessary
        if (maskedAddress >= baseBankSwitchAddress && maskedAddress <= topBankSwitchAddress)
            bankAddressOffset = BANK_SIZE * (maskedAddress - baseBankSwitchAddress);
        return maskedAddress;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset,
            bb: baseBankSwitchAddress,
            es: extraRAMSize,
            tb: topBankSwitchAddress,
            s: superChipMode | 0,
            sa: superChipAutoDetect | 0,
            e: extraRAM && jt.Util.compressInt8BitArrayToStringBase64(extraRAM)
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
        baseBankSwitchAddress = state.bb;
        extraRAMSize = state.es;
        topBankSwitchAddress =  state.tb;
        superChipMode = !!state.s;
        superChipAutoDetect = !!state.sa;
        extraRAM = state.e && jt.Util.uncompressStringBase64ToInt8BitArray(state.e, extraRAM);
    };


    var bytes;

    var bankAddressOffset = 0;
    var baseBankSwitchAddress;
    var topBankSwitchAddress;

    var superChipMode = false;
    var superChipAutoDetect;
    var extraRAMSize;
    var extraRAM;


    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 4096;


    if (rom) init(this);

};

jt.CartridgeBankedByMaskedRange.prototype = jt.Cartridge.base;

jt.CartridgeBankedByMaskedRange.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.CartridgeBankedByMaskedRange();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 8K "E0" Parker Bros. format

jt.Cartridge8K_E0 = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
    }

    this.read = function(address) {
        var maskedAddress = maskAddress(address);
        // Always add the correct offset to access bank selected on the corresponding slice
        if (maskedAddress < 0x0400)		// Slice 0
            return bytes[slice0AddressOffset + maskedAddress];
        if (maskedAddress < 0x0800)		// Slice 1
            return bytes[slice1AddressOffset + maskedAddress - 0x0400];
        if (maskedAddress < 0x0c00)		// Slice 2
            return bytes[slice2AddressOffset + maskedAddress - 0x0800];
        // Slice 3 (0x0c00 - 0x0fff) is always at 0x1c00 (bank 7)
        return bytes[0x1000 + maskedAddress];
    };

    this.write = function(address, val) {
        maskAddress(address);
        // Writing to ROMs is possible, but nothing is changed
    };

    var maskAddress = function(address) {
        var maskedAddress = address & ADDRESS_MASK;
        // Check if address is within range of bank selection
        if (maskedAddress >= 0x0fe0 && maskedAddress <= 0x0ff7) {
            // Each bank is 0x0400 bytes each, 0 to 7
            if (/* maskedAddress >= 0x0fe0 && */ maskedAddress <= 0x0fe7)	    // Slice 0 bank selection
                slice0AddressOffset = (maskedAddress - 0x0fe0) * 0x0400;
            else if (/* maskedAddress >= 0x0fe8 && */ maskedAddress <= 0x0fef)	// Slice 1 bank selection
                slice1AddressOffset = (maskedAddress - 0x0fe8) * 0x0400;
            else if (/* maskedAddress >= 0x0ff0 && */ maskedAddress <= 0x0ff7)	// Slice 2 bank selection
                slice2AddressOffset = (maskedAddress - 0x0ff0) * 0x0400;
        }
        return maskedAddress;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            s0: slice0AddressOffset,
            s1: slice1AddressOffset,
            s2: slice2AddressOffset
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        slice0AddressOffset = state.s0;
        slice1AddressOffset = state.s1;
        slice2AddressOffset = state.s2;
    };


    var bytes;
    var slice0AddressOffset = 0;
    var slice1AddressOffset = 0;
    var slice2AddressOffset = 0;
    // Slice 3 is fixed at bank 7


    var ADDRESS_MASK = 0x0fff;


    if (rom) init(this);

};

jt.Cartridge8K_E0.prototype = jt.Cartridge.base;

jt.Cartridge8K_E0.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge8K_E0();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 64K "F0" Dynacom Megaboy format

jt.Cartridge64K_F0 = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
    }

    this.read = function(address) {
        var maskedAddress = maskAddress(address);
        return bytes[bankAddressOffset + maskedAddress];
    };

    this.write = function(address, val) {
        maskAddress(address);
        // Writing to ROMs is possible, but nothing is changed
    };

    var maskAddress = function(address) {
        var maskedAddress = address & ADDRESS_MASK;
        // Check and perform bank-switch as necessary
        if (maskedAddress == BANKSW_ADDRESS) {	// Bank selection. Increments bank
            bankAddressOffset += BANK_SIZE;
            if (bankAddressOffset >= SIZE) bankAddressOffset = 0;
        }
        return maskedAddress;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
    };


    var bytes;
    var bankAddressOffset = 0;

    var ADDRESS_MASK = 0x0fff;
    var SIZE = 65536;
    var BANK_SIZE = 4096;
    var BANKSW_ADDRESS = 0x0ff0;


    if (rom) init(this);

};

jt.Cartridge64K_F0.prototype = jt.Cartridge.base;

jt.Cartridge64K_F0.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge64K_F0();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 8K "FE" Robotank/Decathlon format

jt.Cartridge8K_FE = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
    }

    this.read = function(address) {
        var maskedAddress = maskAddress(address);
        return bytes[bankAddressOffset + maskedAddress];
    };

    this.write = function(address, val) {
        maskAddress(address);
        // Writing to ROMs is possible, but nothing is changed
    };

    var maskAddress = function(address) {
        // Bankswitching: Look at the address to determine the correct bank to be
        if ((address & 0x2000) !== 0) {		// Check bit 13. Address is like Fxxx or Dxxx?
            if (bankAddressOffset !== 0) bankAddressOffset = 0;
        } else {
            if (bankAddressOffset != BANK_SIZE) bankAddressOffset = BANK_SIZE;
        }
        return address & ADDRESS_MASK;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
    };


    var bytes;
    var bankAddressOffset = 0;

    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 4096;


    if (rom) init(this);

};

jt.Cartridge8K_FE.prototype = jt.Cartridge.base;

jt.Cartridge8K_FE.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge8K_FE();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 16K "E7" M-Network format

jt.Cartridge16K_E7 = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
    }

    this.read = function(address) {
        var maskedAddress = maskAddress(address);
        // Check for Extra RAM Slice1 (always ON)
        if (maskedAddress >= 0x0900 && maskedAddress <= 0x09ff)
            return extraRAM[extraRAMSlice1Offset + maskedAddress - 0x0900];
        // Check for Extra RAM Slice0
        if (extraRAMSlice0Active && maskedAddress >= 0x0400 && maskedAddress <= 0x07ff)
            return extraRAM[maskedAddress - 0x0400];
        // ROM
        if (maskedAddress < ROM_FIXED_SLICE_START)
            return bytes[bankAddressOffset + maskedAddress];		// ROM Selectable Slice
        else
            return bytes[ROM_FIXED_SLICE_OFFSET + maskedAddress];	// ROM Fixed Slice
    };

    this.write = function(address, val) {
        var maskedAddress = maskAddress(address);
        // Check for Extra RAM Slice1 (always ON)
        if (maskedAddress >= 0x0800 && maskedAddress <= 0x08ff)
            extraRAM[extraRAMSlice1Offset + maskedAddress - 0x0800] = val;
        else // Check for Extra RAM Slice0
            if (extraRAMSlice0Active && maskedAddress <= 0x03ff)
                extraRAM[maskedAddress] = val;
    };

    var maskAddress = function(address) {
        var maskedAddress = address & ADDRESS_MASK;
        // Check if address is within range of bank selection
        if (maskedAddress >= 0x0fe0 && maskedAddress <= 0x0feb) {
            if (/* maskedAddress >= 0x0fe0 && */ maskedAddress <= 0x0fe6)	    // Selectable ROM Slice
                bankAddressOffset = BANK_SIZE * (maskedAddress - 0x0fe0);
            else if (maskedAddress == 0x0fe7)								    // Extra RAM Slice0
                extraRAMSlice0Active = true;
            else if (/* maskedAddress >= 0x0fe8 && */ maskedAddress <= 0x0feb)	// Extra RAM Slice1
                extraRAMSlice1Offset = EXTRA_RAM_SLICE1_START + EXTRA_RAM_SLICE1_BANK_SIZE * (maskedAddress - 0x0fe8);
        }
        return maskedAddress;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset,
            rs: extraRAMSlice0Active,
            ro: extraRAMSlice1Offset,
            ra: jt.Util.compressInt8BitArrayToStringBase64(extraRAM)
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
        extraRAMSlice0Active = state.rs;
        extraRAMSlice1Offset = state.ro;
        extraRAM = jt.Util.uncompressStringBase64ToInt8BitArray(state.ra, extraRAM);
    };


    var bytes;
    var bankAddressOffset = 0;

    var EXTRA_RAM_SLICE1_START = 1024;

    var extraRAM = jt.Util.arrayFill(new Array(2048), 0);
    var extraRAMSlice0Active = false;
    var extraRAMSlice1Offset = EXTRA_RAM_SLICE1_START;

    var ADDRESS_MASK = 0x0fff;
    var SIZE = 16384;
    var BANK_SIZE = 2048;
    var ROM_FIXED_SLICE_START = 0x0800;
    var ROM_FIXED_SLICE_OFFSET = SIZE - BANK_SIZE - ROM_FIXED_SLICE_START;
    var EXTRA_RAM_SLICE1_BANK_SIZE = 256;


    if (rom) init(this);

};

jt.Cartridge16K_E7.prototype = jt.Cartridge.base;

jt.Cartridge16K_E7.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge16K_E7();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 8K + 2K "DPCa" (Pitfall2) format, enhanced version with TIA audio updates every DPC audio clock!

jt.Cartridge10K_DPCa = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
    }

    this.powerOn = function() {
        audioClockStep = AUDIO_CLOCK_DEFAULT_STEP;
        audioClockCycles = 0;
    };

    this.connectBus = function(bus) {
        dpcAudioChannel = bus.getTia().getAudioOutput().getChannel0();
    };

    this.needsAudioClock = function() {
        return true;
    };

    this.read = function(address) {
        var maskedAddress = maskAddress(address);
        // Check for DPC register read
        if (maskedAddress <= 0x03f || (maskedAddress >= 0x800 && maskedAddress <= 0x83f))
            return readDPCRegister(maskedAddress & 0x00ff);
        // Always add the correct bank offset
        return bytes[bankAddressOffset + maskedAddress];	// ROM
    };

    this.write = function(address, val) {
        var maskedAddress = maskAddress(address);
        // Check for DPC register write
        if ((maskedAddress >= 0x040 && maskedAddress <= 0x07f) ||
            (maskedAddress >= 0x840 && maskedAddress <= 0x87f))
            writeDPCRegister(maskedAddress & 0x00ff, val);
    };

    this.audioClockPulse = function() {
        if (((audioClockCycles + audioClockStep) | 0) > (audioClockCycles | 0)) {
            // Actual integer clock
            for (var f = 5; f <= 7; f++) {
                if (!audioMode[f]) continue;
                fetcherPointer[f]--;
                if ((fetcherPointer[f] & 0x00ff) == 0xff)
                    setFetcherPointer(f, fetcherPointer[f] & 0xff00 | fetcherStart[f]);
                updateFetcherMask(f);
                if (!audioChanged) audioChanged = true;
            }
        }
        audioClockCycles += audioClockStep;
        if (!audioChanged) return;
        // Send a volume update directly to TIA Audio Channel 0
        updateAudioOutput();
        dpcAudioChannel.setVolume(audioOutput);
    };

    var maskAddress = function(address) {
        var maskedAddress = address & ADDRESS_MASK;
        // Check and perform bank-switch as necessary
        if (maskedAddress === 0xff8) bankAddressOffset = 0;
        else if (maskedAddress === 0xff9) bankAddressOffset = 4096;
        return maskedAddress;
    };

    var updateAudioOutput = function() {
        audioOutput = AUDIO_MIXED_OUTPUT[
        (audioMode[5] ? fetcherMask[5] & 0x04 : 0) |
        (audioMode[6] ? fetcherMask[6] & 0x02 : 0) |
        (audioMode[7] ? fetcherMask[7] & 0x01 : 0)];
        audioChanged = false;
    };

    // TODO Fix bug when reading register as normal fetcher while in audio mode
    var readDPCRegister = function(reg) {
        var res;
        // Random number
        if (reg >= 0x00 && reg <= 0x03) {
            clockRandomNumber();
            return randomNumber;
        }
        // Audio value (MOVAMT not supported)
        if (reg >= 0x04 && reg <= 0x07) {
            if (audioChanged) updateAudioOutput();
            return audioOutput;
        }
        // Fetcher unmasked value
        if (reg >= 0x08 && reg <= 0x0f) {
            res = bytes[DPC_ROM_END - fetcherPointer[reg - 0x08]];
            clockFetcher(reg - 0x08);
            return res;
        }
        // Fetcher masked value
        if (reg >= 0x10 && reg <= 0x17) {
            res = bytes[DPC_ROM_END - fetcherPointer[reg - 0x10]] & fetcherMask[reg - 0x10];
            clockFetcher(reg - 0x10);
            return res;
        }
        // Fetcher masked value, nibbles swapped
        if (reg >= 0x18 && reg <= 0x1f) {
            res = bytes[DPC_ROM_END - fetcherPointer[reg - 0x18]] & fetcherMask[reg - 0x18];
            clockFetcher(reg - 0x18);
            res = (res & 0x0f << 4) | (res & 0xf0 >>> 4);
            return res;
        }
        // Fetcher masked value, byte reversed
        if (reg >= 0x20 && reg <= 0x27) {
            res = bytes[DPC_ROM_END - fetcherPointer[reg - 0x20]] & fetcherMask[reg - 0x20];
            clockFetcher(reg - 0x20);
            res = (res & 0x01 << 7) |  (res & 0x02 << 5) |  (res & 0x04 << 3) |  (res & 0x08 << 1) |
                  (res & 0x10 >>> 1) | (res & 0x20 >>> 3) | (res & 0x40 >>> 5) | (res & 0x80 >> 7);
            return res;
        }
        // Fetcher masked value, byte rotated right
        if (reg >= 0x28 && reg <= 0x2f) {
            res = bytes[DPC_ROM_END - fetcherPointer[reg - 0x28]] & fetcherMask[reg - 0x28];
            clockFetcher(reg - 0x28);
            res = ((res >>> 1) | (res << 7)) & 0xff;
            return res;
        }
        // Fetcher masked value, byte rotated left
        if (reg >= 0x30 && reg <= 0x37) {
            res = bytes[DPC_ROM_END - fetcherPointer[reg - 0x30]] & fetcherMask[reg - 0x30];
            clockFetcher(reg - 0x30);
            res = ((res << 1) | ((res >> 7) & 0x01)) & 0xff;
            return res;
        }
        // Fetcher mask
        if (reg >= 0x38 && reg <= 0x3f) {
            return fetcherMask[reg - 0x38];
        }
        return 0;
    };

    var writeDPCRegister = function(reg, b) {
        // Fetchers Start
        if (reg >= 0x40 && reg <= 0x47) {
            var f = reg - 0x40;
            fetcherStart[f] = b;
            if ((fetcherPointer[f] & 0xff) === fetcherStart[f]) fetcherMask[f] = 0xff;
            return;
        }
        // Fetchers End
        if (reg >= 0x48 && reg <= 0x4f) {
            fetcherEnd[reg - 0x48] = b; fetcherMask[reg - 0x48] = 0x00; return;
        }
        // Fetchers Pointers LSB
        if (reg >= 0x50 && reg <= 0x57) {
            setFetcherPointer(reg - 0x50, (fetcherPointer[reg - 0x50] & 0xff00) | (b & 0xff)); return;			// LSB
        }
        // Fetchers 0-3 Pointers MSB
        if (reg >= 0x58 && reg <= 0x5b) {
            setFetcherPointer(reg - 0x58, (fetcherPointer[reg - 0x58] & 0x00ff) | ((b & (0x07)) << 8)); return;	// MSB bits 0-2
        }
        // Fetchers 4 Pointers MSB (Draw Line enable not supported)
        if (reg == 0x5c) {
            setFetcherPointer(4, (fetcherPointer[4] & 0x00ff) | ((b & (0x07)) << 8));							// MSB bits 0-2
            return;
        }
        // Fetchers 5-7 Pointers MSB and Audio Mode enable
        if (reg >= 0x5d && reg <= 0x5f) {
            setFetcherPointer(reg - 0x58, (fetcherPointer[reg - 0x58] & 0x00ff) + ((b & (0x07)) << 8));			// MSB bits 0-2
            audioMode[reg - 0x58] = ((b & 0x10) >>> 4);
            return;
        }
        // Draw Line MOVAMT value (not supported)
        if (reg >= 0x60 && reg <= 0x67) {
            return;
        }
        // 0x68 - 0x6f Not used
        // Random Number reset
        if (reg >= 0x70 && reg <= 0x77) {
            randomNumber = 0x00;
        }
        // 0x78 - 0x7f Not used
    };

    var setFetcherPointer = function(f, pointer) {
        fetcherPointer[f] = pointer;
    };

    var clockFetcher = function(f) {
        var newPointer = fetcherPointer[f] - 1;
        if (newPointer < 0 ) newPointer = 0x07ff;
        setFetcherPointer(f, newPointer);
        updateFetcherMask(f);
    };

    var updateFetcherMask = function(f) {
        var lsb = fetcherPointer[f] & 0xff;
        if (lsb == fetcherStart[f]) fetcherMask[f] = 0xff;
        else if (lsb == fetcherEnd[f]) fetcherMask[f] = 0x00;
    };

    var clockRandomNumber = function() {
        randomNumber = ((randomNumber << 1) |
            (~((randomNumber >> 7) ^ (randomNumber >> 5) ^
            (randomNumber >> 4) ^ (randomNumber >> 3)) & 0x01)) & 0xff;
        if (randomNumber === 0xff) randomNumber = 0;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset,
            rn: randomNumber,
            fp: jt.Util.compressInt8BitArrayToStringBase64(fetcherPointer),
            fs: jt.Util.compressInt8BitArrayToStringBase64(fetcherStart),
            fe: jt.Util.compressInt8BitArrayToStringBase64(fetcherEnd),
            fm: jt.Util.compressInt8BitArrayToStringBase64(fetcherMask),
            a:  jt.Util.compressInt8BitArrayToStringBase64(audioMode)
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
        randomNumber = state.rn;
        fetcherPointer = jt.Util.uncompressStringBase64ToInt8BitArray(state.fp, fetcherPointer);
        fetcherStart = jt.Util.uncompressStringBase64ToInt8BitArray(state.fs, fetcherStart);
        fetcherEnd = jt.Util.uncompressStringBase64ToInt8BitArray(state.fe, fetcherEnd);
        fetcherMask = jt.Util.uncompressStringBase64ToInt8BitArray(state.fm, fetcherMask);
        audioMode = jt.Util.uncompressStringBase64ToInt8BitArray(state.a, audioMode);
    };


    var AUDIO_MIXED_OUTPUT = [0x0, 0x5, 0x5, 0xa, 0x5, 0xa, 0xa, 0xf];
    // var AUDIO_MIXED_OUTPUT = [0x0, 0x4, 0x5, 0x9, 0x6, 0xa, 0xb, 0xf];   // Per specification

    var ADDRESS_MASK = 0x0fff;
    var AUDIO_CLOCK_DEFAULT_STEP = 0.62;
    var DPC_ROM_END = 8192 + 2048 - 1;

    var dpcAudioChannel;

    var bytes;
    var bankAddressOffset = 0;
    var randomNumber = 0;
    var fetcherPointer = jt.Util.arrayFill(new Array(8), 0);
    var fetcherStart =   jt.Util.arrayFill(new Array(8), 0);
    var fetcherEnd =     jt.Util.arrayFill(new Array(8), 0);
    var fetcherMask =    jt.Util.arrayFill(new Array(8), 0);
    var audioMode =      jt.Util.arrayFill(new Array(8), 0);
    var audioClockStep = AUDIO_CLOCK_DEFAULT_STEP;
    var audioClockCycles = 0;
    var audioChanged = true;
    var audioOutput = 0;


    if (rom) init(this);

};

jt.Cartridge10K_DPCa.prototype = jt.Cartridge.base;

jt.Cartridge10K_DPCa.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge10K_DPCa();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 24K/28K/32K "FA2" CBS RAM Plus format
// Also supports SC RAM Saving on Harmony Flash memory (emulated to a "savestate" file)

jt.Cartridge24K_28K_32K_FA2 = function(rom, format, pRomStartAddress) {
"use strict";

    var self = this;

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
        romStartAddress = pRomStartAddress || 0;
        bankAddressOffset = romStartAddress;
        var numBanks = (bytes.length - romStartAddress) / BANK_SIZE;
        topBankSwitchAddress = baseBankSwitchAddress + numBanks - 1;
    }

    this.connectBus = function(pBus) {
        bus = pBus;
    };

    this.connectSaveStateSocket = function(socket) {
        saveStateSocket = socket;
    };

    this.read = function(address) {
        var val;
        var maskedAddress = maskAddress(address);

        // Check for SuperChip Extra RAM reads
        if (maskedAddress >= 256 && maskedAddress < (256 * 2))
            val = extraRAM[maskedAddress - 256];
        else
            val = bytes[bankAddressOffset + maskedAddress];

        // Normal behavior if not the Flash Operation Hotspot address
        if (maskedAddress !== FLASH_OP_HOTSPOT) return val;

        // Should trigger new operation?
        if (harmonyFlashOpInProgress === 0) {
            var op = extraRAM[FLASH_OP_CONTROL];
            if (op === 1 || op === 2) {
                performFlashOperation(op);
                return val | 0x40;	    // In progress, set bit 6
            }
        }

        // Report operation completion
        if (harmonyFlashOpInProgress !== 0) detectFlashOperationCompletion();
        else return val & 0xbf;	        // Not busy, clear bit 6

        if (harmonyFlashOpInProgress !== 0) return val | 0x40;	    // Still in progress, set bit 6
        else return val & 0xbf;		        						// Finished, clear bit 6

    };

    this.write = function(address, val) {
        var maskedAddress = maskAddress(address);
        // Check for Extra RAM writes
        if (maskedAddress < 256) extraRAM[maskedAddress] = val;
    };

    var maskAddress = function(address) {
        var maskedAddress = address & ADDRESS_MASK;
        // Check and perform bank-switch as necessary
        if (maskedAddress >= baseBankSwitchAddress && maskedAddress <= topBankSwitchAddress)
            bankAddressOffset = romStartAddress + BANK_SIZE * (maskedAddress - baseBankSwitchAddress);
        return maskedAddress;
    };

    var performFlashOperation = function(op) {
        harmonyFlashOpInProgress = op;
        harmonyFlashOpStartTime = Date.now();
        // 1 = read, 2 = write
        if (op === 1) readMemoryFromFlash();
        else if (op === 2) saveMemoryToFlash();
    };

    var readMemoryFromFlash = function() {
        bus.getTia().getVideoOutput().showOSD("Reading from Cartridge Flash Memory...", true);
        if (saveStateSocket) {
            var data = saveStateSocket.getMedia().loadResource(flashMemoryResourceName());
            if (data) harmonyFlashMemory = jt.Util.uncompressStringBase64ToInt8BitArray(data, harmonyFlashMemory);
        }
        jt.Util.arrayCopy(harmonyFlashMemory, 0, extraRAM);
    };

    var saveMemoryToFlash = function() {
        bus.getTia().getVideoOutput().showOSD("Writing to Cartridge Flash Memory...", true);
        jt.Util.arrayCopy(extraRAM, 0, harmonyFlashMemory);
        if (saveStateSocket)
            saveStateSocket.getMedia().saveResource(flashMemoryResourceName(), jt.Util.compressInt8BitArrayToStringBase64(harmonyFlashMemory));
    };

    var detectFlashOperationCompletion = function() {
        if (Date.now() - harmonyFlashOpStartTime > 1100) {		// 1.1 seconds
            harmonyFlashOpStartTime = Date.now();
            harmonyFlashOpInProgress = 0;
            extraRAM[FLASH_OP_CONTROL] = 0;			// Set return code for Successful operation
            bus.getTia().getVideoOutput().showOSD("Done.", true);
            // Signal a external state modification
            // Flash memory may have been loaded from file and changed
            // Also the waiting timer is a source of indeterminism!
            if (saveStateSocket) saveStateSocket.externalStateChange();
        }
    };

    var flashMemoryResourceName = function() {
        return "hfm" + self.rom.info.h;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            rs: romStartAddress,
            bo: bankAddressOffset,
            tb: topBankSwitchAddress,
            e: jt.Util.compressInt8BitArrayToStringBase64(extraRAM),
            ho: harmonyFlashOpInProgress,
            ht: harmonyFlashOpStartTime
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        romStartAddress = state.rs || 0;
        bankAddressOffset = state.bo;
        topBankSwitchAddress =  state.tb;
        extraRAM = jt.Util.uncompressStringBase64ToInt8BitArray(state.e, extraRAM);
        harmonyFlashOpInProgress = state.ho || 0;
        harmonyFlashOpStartTime = Date.now();   // Always as if operation just started
    };


    var bus;
    var saveStateSocket;

    var bytes;
    var romStartAddress = 0;
    var bankAddressOffset = 0;
    var baseBankSwitchAddress = 0x0ff5;
    var topBankSwitchAddress;
    var extraRAM = jt.Util.arrayFill(new Array(256), 0);

    var harmonyFlashOpStartTime = Date.now();
    var harmonyFlashOpInProgress = 0;					// 0 = none, 1 = read, 2 = write
    var harmonyFlashMemory = jt.Util.arrayFill(new Array(256), 0);

    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 4096;
    var FLASH_OP_HOTSPOT = 0x0ff4;
    var FLASH_OP_CONTROL = 0x00ff;


    if (rom) init(this);

};

jt.Cartridge24K_28K_32K_FA2.prototype = jt.Cartridge.base;

jt.Cartridge24K_28K_32K_FA2.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge24K_28K_32K_FA2();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements generic bank switching using unmasked address access via bus monitoring (outside Cart area)

jt.CartridgeBankedByBusMonitoring = function(rom, format) {
"use strict";

    this.needsBusMonitoring = function() {
        return true;
    };

    this.monitorBusBeforeRead = function(address, data) {
        this.performBankSwitchOnMonitoredAccess(address)
    };

    this.monitorBusBeforeWrite = function(address, data) {
        this.performBankSwitchOnMonitoredAccess(address)
    };

    this.performBankSwitchOnMonitoredAccess = function(address) {
    };

};

jt.CartridgeBankedByBusMonitoring.prototype = jt.Cartridge.base;

jt.CartridgeBankedByBusMonitoring.base = new jt.CartridgeBankedByBusMonitoring();



// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 8K-512K "Enhanced 3F" Tigervision format

jt.Cartridge8K_512K_3F = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
        selectableSliceMaxBank = (bytes.length - BANK_SIZE) / BANK_SIZE - 1;
        fixedSliceAddressOffset = bytes.length - BANK_SIZE * 2;
    }

    this.read = function(address) {
        var maskedAddress = address & ADDRESS_MASK;
        if (maskedAddress >= FIXED_SLICE_START_ADDRESS)			// Fixed slice
            return bytes[fixedSliceAddressOffset + maskedAddress];
        else
            return bytes[bankAddressOffset + maskedAddress];	// Selectable slice
    };

     // Bank switching is done only on monitored writes
    this.monitorBusBeforeWrite = function(address, data) {
        // Perform bank switching as needed
        if (address <= 0x003f) {
            var bank = data & 0xff;		// unsigned
            if (bank <= selectableSliceMaxBank)
                bankAddressOffset = bank * BANK_SIZE;
        }
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset,
            sm: selectableSliceMaxBank,
            fo: fixedSliceAddressOffset
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
        selectableSliceMaxBank = state.sm;
        fixedSliceAddressOffset = state.fo;
    };


    var bytes;

    var bankAddressOffset = 0;
    var selectableSliceMaxBank;
    var fixedSliceAddressOffset;		    // This slice is fixed at the last bank

    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 2048;
    var FIXED_SLICE_START_ADDRESS = 2048;


    if (rom) init(this);

};

jt.Cartridge8K_512K_3F.prototype = jt.CartridgeBankedByBusMonitoring.base;

jt.Cartridge8K_512K_3F.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge8K_512K_3F();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 8K-512K "3E" Tigervision (+RAM) format

jt.Cartridge8K_512K_3E = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
        selectableSliceMaxBank = (bytes.length - BANK_SIZE) / BANK_SIZE - 1;
        fixedSliceAddressOffset = bytes.length - BANK_SIZE * 2;
    }

    this.read = function(address) {
        var maskedAddress = maskAddress(address);
        if (maskedAddress >= FIXED_SLICE_START_ADDRESS)						// ROM Fixed Slice
            return bytes[fixedSliceAddressOffset + maskedAddress];
        else
        if (extraRAMBankAddressOffset >= 0 && maskedAddress < 0x0400)		// RAM
            return extraRAM[extraRAMBankAddressOffset + maskedAddress] || 0;
        else
            return bytes[bankAddressOffset + maskedAddress];				// ROM Selectable Slice
    };

    this.write = function(address, val) {
        // Check if Extra RAM bank is selected
        if (extraRAMBankAddressOffset < 0) return;

        var maskedAddress = maskAddress(address);
        // Check for Extra RAM writes
        if (maskedAddress >= 0x0400 && maskedAddress <= 0x07ff)
            extraRAM[extraRAMBankAddressOffset + maskedAddress - 0x0400] = val;
    };

    var maskAddress = function(address) {
        return address & ADDRESS_MASK;
    };

    // Bank switching is done only on monitored writes
    this.monitorBusBeforeWrite = function(address, data) {
        // Perform ROM bank switching as needed
        if (address === 0x003f) {
            var bank = data & 0xff;		// unsigned
            if (bank <= selectableSliceMaxBank) {
                bankAddressOffset = bank * BANK_SIZE;
                extraRAMBankAddressOffset = -1;
            }
            return;
        }
        // Perform RAM bank switching as needed
        if (address === 0x003e) {
            var ramBank = data & 0xff;	// unsigned
            extraRAMBankAddressOffset = ramBank * EXTRA_RAM_BANK_SIZE;
        }
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset,
            sm: selectableSliceMaxBank,
            fo: fixedSliceAddressOffset,
            ro: extraRAMBankAddressOffset,
            ra: jt.Util.compressInt8BitArrayToStringBase64(extraRAM)
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
        selectableSliceMaxBank = state.sm;
        fixedSliceAddressOffset = state.fo;
        extraRAMBankAddressOffset = state.ro;
        extraRAM = jt.Util.uncompressStringBase64ToInt8BitArray(state.ra, extraRAM);
    };


    var bytes;

    var EXTRA_RAM_BANK_SIZE = 1024;

    var bankAddressOffset = 0;
    var selectableSliceMaxBank;
    var fixedSliceAddressOffset;		                                // This slice is fixed at the last bank
    var extraRAMBankAddressOffset = -1;		                            // No Extra RAM bank selected
    var extraRAM = jt.Util.arrayFill(new Array(EXTRA_RAM_BANK_SIZE), 0);   // Pre allocate minimum RAM bank for performance


    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 2048;
    var FIXED_SLICE_START_ADDRESS = 2048;


    if (rom) init(this);

};

jt.Cartridge8K_512K_3E.prototype = jt.CartridgeBankedByBusMonitoring.base;

jt.Cartridge8K_512K_3E.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge8K_512K_3E();
    cart.loadState(state);
    return cart;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 8K-256K "SB" Superbanking format

jt.Cartridge8K_256K_SB = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
        maxBank = bytes.length / BANK_SIZE - 1;
    }

    this.read = function(address) {
        // Always add the correct offset to access bank selected
        return bytes[bankAddressOffset + (address & ADDRESS_MASK)];
    };

    this.performBankSwitchOnMonitoredAccess = function(address) {
        if ((address & 0x1800) !== 0x0800) return;
        var bank = address & 0x007f;
        if (bank > maxBank) return;
        bankAddressOffset = bank * BANK_SIZE;
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset,
            m: maxBank
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
        maxBank = state.m;
    };


    var bytes;
    var bankAddressOffset = 0;
    var maxBank;

    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 4096;


    if (rom) init(this);

};

jt.Cartridge8K_256K_SB.prototype = jt.CartridgeBankedByBusMonitoring.base;

jt.Cartridge8K_256K_SB.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge8K_256K_SB();
    cart.loadState(state);
    return cart;
};




// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the n * 8448 byte "AR" Arcadia/Starpath/Supercharger tape format

jt.Cartridge8K_64K_AR = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        // Cannot use the contents of the ROM directly, as cartridge is all RAM and can be modified
        // Also, ROM content represents the entire tape and can have multiple parts
        bytes = jt.Util.arrayFill(new Array(4 * BANK_SIZE));
        loadBIOS();
    }

    this.powerOn = function() {
        // Always start with bank configuration 000 (bank2, bank3 = BIOS ROM), writes disabled and BIOS ROM powered on
        setControlRegister(0x00);
        // Rewind Tape
        tapeOffset = 0;
        // BIOS will ask to load Part Number 0 at System Reset
    };

    this.connectBus = function(pBus) {
        bus = pBus;
    };

    this.read = function(address) {
        // maskedAddress already set on bus monitoring method
        // bank0
        if (maskedAddress < BANK_SIZE)
            return bytes[bank0AddressOffset + maskedAddress];
        else
        // bank1
            return bytes[bank1AddressOffset + maskedAddress - BANK_SIZE];
    };

    this.write = function(address, b) {
        // No direct writes are possible
        // But check for BIOS Load Part Hotspot range
        if (bank1AddressOffset === BIOS_BANK_OFFSET &&
            maskedAddress >= BIOS_INT_EMUL_LOAD_HOTSPOT && maskedAddress < BIOS_INT_EMUL_LOAD_HOTSPOT + 256) {
            loadPart(maskedAddress - BIOS_INT_EMUL_LOAD_HOTSPOT);
        }
    };

    this.performBankSwitchOnMonitoredAccess = function(address) {
        maskedAddress = address & ADDRESS_MASK;
        address &= 0x1fff;

        // Set ControlRegister if the hotspot was triggered
        if (address == 0x1ff8) {
            setControlRegister(valueToWrite);
            return;
        }

        // Check for writes pending and watch for address transitions
        if (addressChangeCountdown > 0) {
            if (address !== lastAddress) {
                lastAddress = address;
                if (--addressChangeCountdown === 0) {
                    // 5th address transition detected, perform write
                    if ((address & CHIP_MASK) === CHIP_SELECT) {		// Do not write outside Cartridge range
                        // bank0
                        if (maskedAddress < BANK_SIZE)
                            bytes[bank0AddressOffset + maskedAddress] = valueToWrite;
                        // bank1
                        else if (bank1AddressOffset < BIOS_BANK_OFFSET)	// Do not write to BIOS ROM
                            bytes[bank1AddressOffset + maskedAddress - BANK_SIZE] = valueToWrite;
                    }
                }
            }
            return;
        }

        // Check and store desired value to write
        if (((address & CHIP_MASK) === CHIP_SELECT) && maskedAddress <= 0x00ff) {
            valueToWrite = maskedAddress;
            if (writeEnabled) {
                lastAddress = address;		// Will be watched for the 5th address change
                addressChangeCountdown = 5;
            }
        }
    };

    var setControlRegister = function(controlRegister) {
        var banksConfig = (controlRegister >> 2) & 0x07;
        switch (banksConfig) {
            case 0: bank0AddressOffset = 2 * BANK_SIZE; bank1AddressOffset = BIOS_BANK_OFFSET; break;
            case 1: bank0AddressOffset = 0 * BANK_SIZE; bank1AddressOffset = BIOS_BANK_OFFSET; break;
            case 2: bank0AddressOffset = 2 * BANK_SIZE; bank1AddressOffset = 0 * BANK_SIZE; break;	// as used in Commie Mutants and many others
            case 3: bank0AddressOffset = 0 * BANK_SIZE; bank1AddressOffset = 2 * BANK_SIZE; break;	// as used in Suicide Mission
            case 4: bank0AddressOffset = 2 * BANK_SIZE; bank1AddressOffset = BIOS_BANK_OFFSET; break;
            case 5: bank0AddressOffset = 1 * BANK_SIZE; bank1AddressOffset = BIOS_BANK_OFFSET; break;
            case 6: bank0AddressOffset = 2 * BANK_SIZE; bank1AddressOffset = 1 * BANK_SIZE; break;	// as used in Killer Satellites
            case 7: bank0AddressOffset = 1 * BANK_SIZE; bank1AddressOffset = 2 * BANK_SIZE; break;	// as we use for 2k/4k ROM cloning		}
            default: throw new Error("Invalid bank configuration");
        }
        addressChangeCountdown = 0;	// Setting ControlRegister cancels any pending write
        writeEnabled = (controlRegister & 0x02) !== 0;
        biosRomPower = (controlRegister & 0x01) === 0;
        // System.out.println("Banks: " + banksConfig + ", Writes: " + (writeEnabled ? "ON" : "OFF"));
    };

    var loadPart = function(part) {
        var tapeRewound = false;
        do {
            // Check for tape end
            if (tapeOffset > rom.content.length - 1) {
                // Check if tape was already rewound once to avoid infinite tries
                if (tapeRewound) {
                    if (part === 0) bus.getTia().getVideoOutput().showOSD("Could not load Tape from Start. Not a Start Tape ROM!", true);
                    else bus.getTia().getVideoOutput().showOSD("Could not find next Part to load in Tape!", true);
                    signalPartLoadedOK(false);		// BIOS will handle this
                    return;
                }
                // Rewind tape
                tapeOffset = 0;
                tapeRewound = true;
            }
            // Check if the next part is the one we are looking for
            if (jt.Cartridge8K_64K_AR.peekPartNoOnTape(rom.content, tapeOffset) === part) {
                if (part === 0) bus.getTia().getVideoOutput().showOSD("Loaded Tape from Start", true);
                else bus.getTia().getVideoOutput().showOSD("Loaded next Part from Tape", true);
                loadNextPart();
                return;
            } else {
                // Advance tape
                tapeOffset += PART_SIZE;
            }
        } while(true);
    };

    var loadNextPart = function() {
        loadHeaderData();
        loadPagesIntoBanks();
        patchPartDataIntoBIOS();
    };

    var loadHeaderData = function() {
        // Store header info
        jt.Util.arrayCopy(rom.content, tapeOffset + 4 * BANK_SIZE, header, 0, header.length);
        romStartupAddress = (header[1] << 8) | (header[0] & 0xff);
        romControlRegister = header[2];
        romPageCount = header[3];
        romChecksum = header[4];
        romMultiLoadIndex = header[5];
        romProgressBarSpeed = (header[7] << 8) | (header[6] & 0xff);
        romPageOffsets = jt.Util.arrayFill(new Array(romPageCount), 0);
        jt.Util.arrayCopy(header, 16, romPageOffsets, 0, romPageCount);
    };

    var loadPagesIntoBanks = function() {
        // Clear last page of first bank, as per original BIOS
        jt.Util.arrayFillSegment(bytes, 7 * PAGE_SIZE, 8 * PAGE_SIZE - 1, 0);

        // Load pages
        var romOffset = tapeOffset;
        for (var i = 0, len = romPageOffsets.length; i < len; i++) {
            var pageInfo = romPageOffsets[i];
            var bankOffset = (pageInfo & 0x03) * BANK_SIZE;
            var pageOffset = (pageInfo >> 2) * PAGE_SIZE;
            // Only write if not in BIOS area
            if (bankOffset + pageOffset + 255 < BIOS_BANK_OFFSET)
                jt.Util.arrayCopy(rom.content, romOffset, bytes, bankOffset + pageOffset, PAGE_SIZE);
            romOffset += PAGE_SIZE;
        }
        // Advance tape
        tapeOffset += PART_SIZE;
    };

    var patchPartDataIntoBIOS = function() {
        // Patch BIOS interface area with correct values from stored Header data
        bytes[BIOS_BANK_OFFSET + BIOS_INT_CONTROL_REG_ADDR - 0xf800] = romControlRegister;
        bytes[BIOS_BANK_OFFSET + BIOS_INT_PART_NO_ADDR - 0xf800] = romMultiLoadIndex;
        // TODO This random is a source of indeterminism. Potential problem in multiplayer sync
        bytes[BIOS_BANK_OFFSET + BIOS_INT_RANDOM_SEED_ADDR - 0xf800] = ((Math.random() * 256) | 0);
        bytes[BIOS_BANK_OFFSET + BIOS_INT_START_ADDR - 0xf800] = romStartupAddress & 0xff;
        bytes[BIOS_BANK_OFFSET + BIOS_INT_START_ADDR + 1 - 0xf800] = (romStartupAddress >> 8) & 0xff;
        signalPartLoadedOK(true);
    };

    var signalPartLoadedOK = function(ok) {
        bytes[BIOS_BANK_OFFSET + BIOS_INT_PART_LOADED_OK - 0xf800] = (ok ? 1 : 0);
    };

    var loadBIOS = function() {
        var bios = jt.Util.uncompressStringBase64ToInt8BitArray(STARPATH_BIOS);
        jt.Util.arrayCopy(bios, 0, bytes, BIOS_BANK_OFFSET, BANK_SIZE);
    };


    var bus;

    var bytes;
    var maskedAddress;

    var HEADER_SIZE = 256;

    var bank0AddressOffset = 0;
    var bank1AddressOffset = 0;
    var header = jt.Util.arrayFill(new Array(HEADER_SIZE), 0);
    var valueToWrite = 0;
    var writeEnabled = false;
    var lastAddress = -1;
    var addressChangeCountdown = 0;
    var biosRomPower = false;

    var romStartupAddress = 0;
    var romControlRegister = 0;
    var romPageCount = 0;
    var romChecksum = 0;
    var romMultiLoadIndex = 0;
    var romProgressBarSpeed = 0;
    var romPageOffsets;

    var tapeOffset = 0;


    var BIOS_INT_PART_NO_ADDR 		= 0xfb00;
    var BIOS_INT_CONTROL_REG_ADDR	= 0xfb01;
    var BIOS_INT_START_ADDR 		= 0xfb02;
    var BIOS_INT_RANDOM_SEED_ADDR	= 0xfb04;
    var BIOS_INT_PART_LOADED_OK	= 0xfb05;
    var BIOS_INT_EMUL_LOAD_HOTSPOT	= 0x0c00;

    var PAGE_SIZE = 256;
    var BANK_SIZE = 8 * PAGE_SIZE;
    var BIOS_BANK_OFFSET = 3 * BANK_SIZE;
    var PART_SIZE = 4 * BANK_SIZE + HEADER_SIZE;	// 4 * 2048 banks + header

    // Bios is 2048 bytes. This is compressed (zip) and stored in base64
    var STARPATH_BIOS = "7dSxCsIwEAbgv6niGkeddPVZ8kCOXc43yCIokkGIUN+gLxAoZHTxHRxjYq2xk7vSIPS75bb7uYNTuOJWu/bod3iU42BzUTiBe9sTzSj" +
        "ToBnNBVxfQz/nQ+2NhA2a05KYmhhjmxhoQZymxGil8gpeesOdyioW5DN25yxsiri3chQOUO1WeCSI/hPx9AJ/m/576KROMUhlfdE4dQ+AfJoPNBikgOZdLw==";

    var ADDRESS_MASK = 0x0fff;
    var CHIP_MASK = 0x1000;
    var CHIP_SELECT = 0x1000;


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes)
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
    };


    if (rom) init(this);

};

jt.Cartridge8K_64K_AR.prototype = jt.CartridgeBankedByBusMonitoring.base;

jt.Cartridge8K_64K_AR.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge8K_64K_AR();
    cart.loadState(state);
    return cart;
};

jt.Cartridge8K_64K_AR.HEADER_SIZE = 256;
jt.Cartridge8K_64K_AR.PAGE_SIZE = 256;
jt.Cartridge8K_64K_AR.BANK_SIZE = 8 * jt.Cartridge8K_64K_AR.PAGE_SIZE;
jt.Cartridge8K_64K_AR.PART_SIZE = 4 * jt.Cartridge8K_64K_AR.BANK_SIZE + jt.Cartridge8K_64K_AR.HEADER_SIZE;	// 4 * 2048 banks + header

jt.Cartridge8K_64K_AR.peekPartNoOnTape = function(tapeContent, tapeOffset) {
    return tapeContent[tapeOffset + 4*jt.Cartridge8K_64K_AR.BANK_SIZE + 5];
};

jt.Cartridge8K_64K_AR.checkTape = function(rom) {
    if (jt.Cartridge8K_64K_AR.peekPartNoOnTape(rom.content, 0) === 0) return true;

    jt.Util.warning("Wrong Supercharger Tape Part ROM! Please load a Full Tape ROM file");
    return false;
};



// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 64K "X07" AtariAge format

jt.Cartridge64K_X07 = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
    }

    this.read = function(address) {
        // Always add the correct offset to access bank selected
        return bytes[bankAddressOffset + (address & ADDRESS_MASK)];
    };

    this.performBankSwitchOnMonitoredAccess = function(address) {
        if ((address & 0x180f) === 0x080d)		                                            // Method 1
            bankAddressOffset = ((address & 0x00f0) >> 4) * BANK_SIZE;	                    // Pick bank from bits 7-4
        else if (bankAddressOffset >= BANK_14_ADDRESS && (address & 0x1880) === 0x0000) 	// Method 2, only if at bank 14 or 15
            bankAddressOffset = ((address & 0x0040) === 0 ? 14 : 15) * BANK_SIZE;	        // Pick bank 14 or 15 from bit 6
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
    };


    var bytes;
    var bankAddressOffset = 0;

    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 4096;
    var BANK_14_ADDRESS = 14 * BANK_SIZE;


    if (rom) init(this);

};

jt.Cartridge64K_X07.prototype = jt.CartridgeBankedByBusMonitoring.base;

jt.Cartridge64K_X07.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge64K_X07();
    cart.loadState(state);
    return cart;
};




// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 8K "0840" Econobanking format

jt.Cartridge8K_0840 = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
    }

    this.read = function(address) {
        // Always add the correct offset to access bank selected
        return bytes[bankAddressOffset + (address & ADDRESS_MASK)];
    };

    this.performBankSwitchOnMonitoredAccess = function(address) {
        var addrBank = address & 0x1840;
        if (addrBank === 0x0800) {
            if (bankAddressOffset !== 0) bankAddressOffset = 0;
        } else if (addrBank === 0x0840) {
            if (bankAddressOffset !== BANK_SIZE) bankAddressOffset = BANK_SIZE;
        }
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
    };


    var bytes;
    var bankAddressOffset = 0;

    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 4096;


    if (rom) init(this);

};

jt.Cartridge8K_0840.prototype = jt.CartridgeBankedByBusMonitoring.base;

jt.Cartridge8K_0840.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge8K_0840();
    cart.loadState(state);
    return cart;
};




// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Implements the 8K "UA" UA Limited format

jt.Cartridge8K_UA = function(rom, format) {
"use strict";

    function init(self) {
        self.rom = rom;
        self.format = format;
        bytes = rom.content;        // uses the content of the ROM directly
    }

    this.read = function(address) {
        // Always add the correct offset to access bank selected
        return bytes[bankAddressOffset + (address & ADDRESS_MASK)];
    };

    this.performBankSwitchOnMonitoredAccess = function(address) {
        if (address === 0x0220) {
            if (bankAddressOffset !== 0) bankAddressOffset = 0;
        } else if (address === 0x0240) {
            if (bankAddressOffset !== BANK_SIZE) bankAddressOffset = BANK_SIZE;
        }
    };


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: jt.Util.compressInt8BitArrayToStringBase64(bytes),
            bo: bankAddressOffset
        };
    };

    this.loadState = function(state) {
        this.format = jt.CartridgeFormats[state.f];
        this.rom = jt.ROM.loadState(state.r);
        bytes = jt.Util.uncompressStringBase64ToInt8BitArray(state.b, bytes);
        bankAddressOffset = state.bo;
    };


    var bytes;
    var bankAddressOffset = 0;

    var ADDRESS_MASK = 0x0fff;
    var BANK_SIZE = 4096;


    if (rom) init(this);

};

jt.Cartridge8K_UA.prototype = jt.CartridgeBankedByBusMonitoring.base;

jt.Cartridge8K_UA.recreateFromSaveState = function(state, prevCart) {
    var cart = prevCart || new jt.Cartridge8K_UA();
    cart.loadState(state);
    return cart;
};




// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.CartridgeFormats = {

    "4K": {
        name: "4K",
        desc: "4K Atari",
        priority: 101,
        tryFormat: function (rom) {
            if (rom.content.length >= 8 && rom.content.length <= 4096 && 4096 % rom.content.length === 0) return this;
        },
        createCartridgeFromRom: function (rom) {
            return new jt.Cartridge4K(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge4K.recreateFromSaveState(state, cart);
        }
    },

    "CV": {
        name: "CV",
        desc: "2K Commavid +RAM",
        priority: 102,
        tryFormat: function (rom) {
            if (rom.content.length === 2048 || rom.content.length === 4096) return this;	// Also accepts 4K ROMs
        },
        createCartridgeFromRom: function (rom) {
            return new jt.Cartridge2K_CV(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge2K_CV.recreateFromSaveState(state, cart);
        }
    },

    "E0": {
        name: "E0",
        desc: "8K Parker Bros.",
        priority: 102,
        tryFormat: function (rom) {
            if (rom.content.length === 8192) return this;
        },
        createCartridgeFromRom: function (rom) {
            return new jt.Cartridge8K_E0(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge8K_E0.recreateFromSaveState(state, cart);
        }
    },

    "F0": {
        name: "F0",
        desc: "64K Dynacom Megaboy",
        priority: 101,
        tryFormat: function (rom) {
            if (rom.content.length === 65536) return this;
        },
        createCartridgeFromRom: function (rom) {
            return new jt.Cartridge64K_F0(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge64K_F0.recreateFromSaveState(state, cart);
        }
    },

    "FE": {
        name: "FE",
        desc: "8K Robotank/Decathlon",
        priority: 103,
        tryFormat: function (rom) {
            if (rom.content.length === 8192) return this;
        },
        createCartridgeFromRom: function (rom) {
            return new jt.Cartridge8K_FE(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge8K_FE.recreateFromSaveState(state, cart);
        }
    },

    "E7": {
        name: "E7",
        desc: "16K M-Network",
        priority: 102,
        tryFormat: function (rom) {
            if (rom.content.length === 16384) return this;
        },
        createCartridgeFromRom: function (rom) {
            return new jt.Cartridge16K_E7(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge16K_E7.recreateFromSaveState(state, cart);
        }
    },

    "F8": {
        name: "F8",
        desc: "8K Atari (+RAM)",
        priority: 101,
        tryFormat: function(rom) {
            if (rom.content.length === 8192) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.CartridgeBankedByMaskedRange(rom, this, 0x0ff8, null, 128);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(state, cart);
        }
    },

    "F6": {
        name: "F6",
        desc: "16K Atari (+RAM)",
        priority: 101,
        tryFormat: function(rom) {
            if (rom.content.length === 16384) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.CartridgeBankedByMaskedRange(rom, this, 0x0ff6, null, 128);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(state, cart);
        }
    },

    "F4": {
        name: "F4",
        desc: "32K Atari (+RAM)",
        priority: 101,
        tryFormat: function(rom) {
            if (rom.content.length === 32768) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.CartridgeBankedByMaskedRange(rom, this, 0x0ff4, null, 128);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(state, cart);
        }
    },

    "FA2cu": {
        name: "FA2cu",
        desc: "32K CBS RAM Plus CU Image",
        priority: 103,
        tryFormat: function(rom) {
            if (rom.content.length === 32768) {
                // Check for the values $10adab1e, for "loadable", starting at position 32 (33rd byte)
                // This is a hint that the content is in CU format
                var foundHint = jt.Util.arraysEqual(rom.content.slice(32, 32 + 4), this.cuMagicWord);
                this.priority = 103 - (foundHint ? 30 : 0);
                return this;
            }
        },
        createCartridgeFromRom: function(rom) {
            // ROM is only 28K. The first 1024 bytes are custom ARM content. ROM begins after that
            return new jt.Cartridge24K_28K_32K_FA2(rom, this, 1024);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge24K_28K_32K_FA2.recreateFromSaveState(state, cart);
        },
        cuMagicWord: [0x1e, 0xab, 0xad, 0x10]
    },

    "FA2": {
        name: "FA2",
        desc: "24K/28K/32K CBS RAM Plus",
        priority: 102,
        tryFormat: function(rom) {
            if (rom.content.length === 24576 || rom.content.length === 28672 || rom.content.length === 32768) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge24K_28K_32K_FA2(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge24K_28K_32K_FA2.recreateFromSaveState(state, cart);
        }
    },

    "FA": {
        name: "FA",
        desc: "12K CBS RAM Plus",
        priority: 101,
        tryFormat: function(rom) {
            if (rom.content.length === 12288) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.CartridgeBankedByMaskedRange(rom, this, 0x0ff8, true, 256);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(state, cart);
        }
    },

    "EF": {
        name: "EF",
        desc: "8K-64K H. Runner (+RAM)",
        priority: 114,
        tryFormat: function(rom) {
            if (rom.content.length % 4096 === 0 && rom.content.length >= 8192 && rom.content.length <= 65536) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.CartridgeBankedByMaskedRange(rom, this, 0x0fe0, null, 128);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.CartridgeBankedByMaskedRange.recreateFromSaveState(state, cart);
        }
    },

    "DPC": {
        name: "DPC",
        desc: "10K DPC Pitfall 2 (Enhanced Audio)",
        priority: 101,
        tryFormat: function(rom) {
            if (rom.content.length >= (8192 + 2048) && rom.content.length <= (8192 + 2048 + 256)) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge10K_DPCa(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge10K_DPCa.recreateFromSaveState(state, cart);
        }
    },

    "3F": {
        name: "3F",
        desc: "8K-512K Tigervision",
        priority: 112,
        tryFormat: function(rom) {
            if (rom.content.length % 2048 === 0 && rom.content.length <= 256 * 2048) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge8K_512K_3F(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge8K_512K_3F.recreateFromSaveState(state, cart);
        }
    },

    "3E": {
        name: "3E",
        desc: "8K-512K Tigervision (+RAM)",
        priority: 111,
        tryFormat: function(rom) {
            if (rom.content.length % 2048 === 0 && rom.content.length <= 256 * 2048) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge8K_512K_3E(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge8K_512K_3E.recreateFromSaveState(state, cart);
        }
    },

    "X07": {
        name: "X07",
        desc: "64K AtariAge",
        priority: 102,
        tryFormat: function(rom) {
            if (rom.content.length === 65536) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge64K_X07(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge64K_X07.recreateFromSaveState(state, cart);
        }
    },

    "0840": {
        name: "0840",
        desc: "8K Econobanking",
        priority: 116,
        tryFormat: function(rom) {
            if (rom.content.length === 8192) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge8K_0840(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge8K_0840.recreateFromSaveState(state, cart);
        }
    },

    "UA": {
        name: "UA",
        desc: "8K UA Limited",
        priority: 115,
        tryFormat: function(rom) {
            if (rom.content.length === 8192) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge8K_UA(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge8K_UA.recreateFromSaveState(state, cart);
        }
    },

    "SB": {
        name: "SB",
        desc: "8K-256K Superbanking",
        priority: 113,
        tryFormat: function(rom) {
            if (rom.content.length % 4096 === 0 && rom.content.length >= 8192 && rom.content.length <= 64 * 4096) return this;
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge8K_256K_SB(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge8K_256K_SB.recreateFromSaveState(state, cart);
        }
    },

    "AR": {
        name: "AR",
        desc: "8K-64K Arcadia/Starpath/Supercharger",
        priority: 101,
        tryFormat: function(rom) {
            // Any number of parts between 1 and 8
            if (rom.content.length % jt.Cartridge8K_64K_AR.PART_SIZE === 0 && rom.content.length / jt.Cartridge8K_64K_AR.PART_SIZE >= 1
                && rom.content.length / jt.Cartridge8K_64K_AR.PART_SIZE <= 8) {
                // Check if the content starts with Part 0
                if (jt.Cartridge8K_64K_AR.checkTape(rom)) return this;       // Accepts only a Tape Start or Full Tape
            }
        },
        createCartridgeFromRom: function(rom) {
            return new jt.Cartridge8K_64K_AR(rom, this);
        },
        recreateCartridgeFromSaveState: function(state, cart) {
            return jt.Cartridge8K_64K_AR.recreateFromSaveState(state, cart);
        }
    }

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.CartridgeCreatorImpl = function() {
"use strict";

    this.createCartridgeFromRom = function(rom) {
        // Try to build the Cartridge if a supported format is found
        var options = getFormatOptions(rom);
        if (options.length === 0) return;

        // Choose the best option
        var bestOption = options[0];
        jt.Util.log("" + bestOption.name + ": " + bestOption.desc + ", priority: " + bestOption.priority + (bestOption.priorityBoosted ? " (" + bestOption.priorityBoosted + ")" : ""));
        return bestOption.createCartridgeFromRom(rom);
    };

    this.recreateCartridgeFromSaveState = function(saveState, cartridge) {
        var cartridgeFormat = jt.CartridgeFormats[saveState.f];
        if (!cartridgeFormat) throw new Error ("Unsupported ROM Format: " + saveState.f);
        if (cartridge && cartridge.format !== cartridgeFormat) cartridge = null;       // Only possible to reuse cartridge if the format is the same!
        return cartridgeFormat.recreateCartridgeFromSaveState(saveState, cartridge);
    };

    this.produceInfo = function(rom, formatHint) {
        // Preserve original length as MD5 computation may increase it
        var origLen = rom.content.length;
        var hash = jt.MD5(rom.content);
        if (rom.content.length > origLen) rom.content.splice(origLen);

        // Get info from the library
        var info = jt.CartridgeDatabase[hash];
        if (info) {
            jt.Util.log("" + info.n + " (" + hash + ")");
        } else {
            info = buildInfo(rom.source);
            jt.Util.log("Unknown ROM: " + info.n + " (" + hash + ")");
        }

        finishInfo(info, rom.source, hash, formatHint);
        return info;
    };

    var getFormatOptions = function(rom) {
        var formatOptions = [];
        var formatOption;
        var denialEx;
        for (var format in jt.CartridgeFormats) {
            try {
                formatOption = jt.CartridgeFormats[format].tryFormat(rom);
                if (!formatOption) continue;	    	    // rejected by format
                boostPriority(formatOption, rom.info);	    // adjust priority based on ROM info
                formatOptions.push(formatOption);
            } catch (ex) {
                if (!ex.formatDenial) throw ex;
                if (!denialEx) denialEx = ex;               // Keep only the first one
            }
        }

        // Sort according to priority
        formatOptions.sort(function formatOptionComparator(a, b) {
           return (a.priorityBoosted || a.priority) - (b.priorityBoosted || b.priority);
        });

        return formatOptions;
    };

    var buildInfo = function(romSource) {
        var info = { n: "Unknown" };
        if (!romSource || !romSource.trim()) return info;

        var name = romSource;

        // Get the last part of the URL (file name)
        var slash = name.lastIndexOf("/");
        var bslash = name.lastIndexOf("\\");
        var question = name.lastIndexOf("?");
        var i = Math.max(slash, Math.max(bslash, question));
        if (i >= 0 && i < name.length - 1) name = name.substring(i + 1);
        // Get only the file name without the extension
        var dot = name.lastIndexOf(".");
        if (dot >= 0) name = name.substring(0, dot);

        info.n = name.trim() || "Unknown";
        return info;
    };

    // Fill absent information based on ROM name
    var finishInfo = function(info, romSource, hash, formatHint) {
        // Saves the hash on the info
        info.h = hash;
        // Compute label based on name
        if (!info.l) info.l = produceCartridgeLabel(info.n);
        var name = info.n.toUpperCase();
        // Adjust Paddles information if absent
        Paddles: if (!info.p) {
            info.p = 0;
            if (!name.match(HINTS_PREFIX_REGEX + "JOYSTICK(S)?" + HINTS_SUFFIX_REGEX)) {
                if (name.match(HINTS_PREFIX_REGEX + "PADDLE(S)?" + HINTS_SUFFIX_REGEX))
                    info.p = 1;
                else
                    for (var i = 0; i < PADDLES_ROM_NAMES.length; i++)
                        if (name.match(PADDLES_ROM_NAMES[i])) {
                            info.p = 1;
                            break Paddles;
                        }
            }
        }
        // Adjust CRT Mode information if absent
        CrtMode: if (!info.c) {
            if (name.match(HINTS_PREFIX_REGEX + "CRT(_|-)?MODE" + HINTS_SUFFIX_REGEX))
                info.c = 1;
            else
                for (i = 0; i < CRT_MODE_ROM_NAMES.length; i++)
                    if (name.match(CRT_MODE_ROM_NAMES[i])) {
                        info.c = 1;
                        break CrtMode;
                    }
        }
        // Adjust Format information if hint passed
        if (formatHint) {
            formatHint = formatHint.trim().toUpperCase();
            for (var formatName in jt.CartridgeFormats)
                if (formatName.toUpperCase() === formatHint) {
                    info.f = formatName;
                    break;
                }
        }
        // Adjust Format information if absent
        Format: if (!info.f) {
            // First by explicit format hint
            var romURL = romSource.toUpperCase();
            for (formatName in jt.CartridgeFormats)
                if (formatMatchesByHint(formatName, name) || formatMatchesByHint(formatName, romURL)) {
                    info.f = formatName;
                    break Format;
                }
            // Then by name
            for (formatName in FORMAT_ROM_NAMES)
                if (formatMatchesByName(formatName, name)) {
                    info.f = formatName;
                    break Format;
                }
        }
    };

    var boostPriority = function(formatOption, info) {
        if (info.f && formatOption.name === info.f)
            formatOption.priorityBoosted = formatOption.priority - FORMAT_PRIORITY_BOOST;
        else
            formatOption.priorityBoosted = undefined;
    };

    var produceCartridgeLabel = function(name) {
        return name.split(/(\(|\[)/)[0].trim();   //  .toUpperCase();   // TODO Validate
    };

    var formatMatchesByHint = function(formatName, hint) {
        return hint.match(HINTS_PREFIX_REGEX + formatName + HINTS_SUFFIX_REGEX);
    };

    var formatMatchesByName = function(formatName, name) {
        var namesForFormat = FORMAT_ROM_NAMES[formatName];
        if (!namesForFormat) return false;
        for (var i = 0; i < namesForFormat.length; i++)
            if (name.match(namesForFormat[i]))
                return true;
        return false;
    };


    var FORMAT_ROM_NAMES = {
        "E0": [
            "^.*MONTEZUMA.*$",						"^.*MONTZREV.*$",
            "^.*GYRUS.*$",
            "^.*TOOTH.*PROTECTORS.*$",				"^.*TOOTHPRO.*$",
            "^.*DEATH.*STAR.*BATTLE.*$",			"^.*DETHSTAR.*$",
            "^.*JAMES.*BOND.*$",					"^.*JAMEBOND.*$",
            "^.*SUPER.*COBRA.*$",					"^.*SPRCOBRA.*$",
            "^.*TUTANKHAM.*$",						"^.*TUTANK.*$",
            "^.*POPEYE.*$",
            "^.*(SW|STAR.?WARS).*ARCADE.*GAME.*$",	"^.*SWARCADE.*$",
            "^.*Q.*BERT.*QUBES.*$",					"^.*QBRTQUBE.*$",
            "^.*FROGGER.?(2|II).*$",
            "^.*DO.*CASTLE.*$"
        ],
        "FE": [
            "^.*ROBOT.*TANK.*$",		"^.*ROBOTANK.*$",
            "^.*DECATHLON.*$"	, 		"^.*DECATHLN.*$"		// There is also a 16K F6 version
        ],
        "E7": [
            "^.*BUMP.*JUMP.*$",			"^.*BNJ.*$",
            "^.*BURGER.*TIME.*$",		"^.*BURGTIME.*$",
            "^.*POWER.*HE.?MAN.*$",		"^.*HE_MAN.*$"
        ],
        "3F": [
            "^.*POLARIS.*$",
            "^.*RIVER.*PATROL.*$",		 "^.*RIVERP.*$",
            "^.*SPRINGER.*$",
            "^.*MINER.*2049.*$",		 "^.*MNR2049R.*$",
            "^.*MINER.*2049.*VOLUME.*$", "^.*MINRVOL2.*$",
            "^.*ESPIAL.*$",
            "^.*ANDREW.*DAVIE.*$",       "^.*DEMO.*IMAGE.*AD.*$" 		// Various 32K Image demos
        ],
        "3E": [
            "^.*BOULDER.*DASH.*$", 		 "^.*BLDRDASH.*$"
        ],
        "DPC": [
            "^.*PITFALL.*II.*$"
        ]
    };

    var PADDLES_ROM_NAMES = [
        "^.*PADDLES.*$",										// Generic hint
        "^.*BREAKOUT.*$",
        "^.*SUPER.*BREAKOUT.*$",		  "^.*SUPERB.*$",
        "^.*WARLORDS.*$",
        "^.*STEEPLE.*CHASE.*$",			  "^.*STEPLCHS.*$",
        "^.*VIDEO.*OLYMPICS.*$",		  "^.*VID(|_)OLYM(|P).*$",
        "^.*CIRCUS.*ATARI.*$", 			  "^.*CIRCATRI.*$",
        "^.*KABOOM.*$",
        "^.*BUGS((?!BUNNY).)*",								// Bugs, but not Bugs Bunny!
        "^.*BACHELOR.*PARTY.*$", 		  "^.*BACHELOR.*$",
        "^.*BACHELORETTE.*PARTY.*$", 	  "^.*BACHLRTT.*$",
        "^.*BEAT.*EM.*EAT.*EM.*$", 		  "^.*BEATEM.*$",
        "^.*PHILLY.*FLASHER.*$",	 	  "^.*PHILLY.*$",
        "^.*JEDI.*ARENA.*$",			  "^.*JEDIAREN.*$",
        "^.*EGGOMANIA.*$",				  "^.*EGGOMANA.*$",
        "^.*PICNIC.*$",
        "^.*PIECE.*O.*CAKE.*$",			  "^.*PIECECKE.*$",
        "^.*BACKGAMMON.*$", 			  "^.*BACKGAM.*$",
        "^.*BLACKJACK.*$",				  "^.*BLACK(|_)J.*$",
        "^.*CANYON.*BOMBER.*$", 		  "^.*CANYONB.*$",
        "^.*CASINO.*$",
        "^.*DEMONS.*DIAMONDS.*$",	      "^.*DEMONDIM.*$",
        "^.*DUKES.*HAZZARD.*2.*$",    	  "^.*STUNT.?2.*$",
        "^.*ENCOUNTER.*L.?5.*$", 		  "^.*ENCONTL5.*$",
        "^.*G.*I.*JOE.*COBRA.*STRIKE.*$", "^.*GIJOE.*$",
        "^.*GUARDIAN.*$",
        "^.*MARBLE.*CRAZE.*$",			  "^.*MARBCRAZ.*$",
        "^.*MEDIEVAL.*MAYHEM.*$",
        "^.*MONDO.*PONG.*$",
        "^.*NIGHT.*DRIVER.*$",			  "^.*NIGHTDRV.*$",
        "^.*PARTY.*MIX.*$",
        "^.*POKER.*PLUS.*$",
        "^.*PONG.*SPORTS.*$",
        "^.*SCSICIDE.*$",
        "^.*SECRET.*AGENT.*$",
        "^.*SOLAR.*STORM.*$", 			  "^.*SOLRSTRM.*$",
        "^.*SPEEDWAY.*$",
        "^.*STREET.*RACER.*$", 			  "^.*STRTRACE.*$",
        "^.*STUNT.*CYCLE.*$", 			  "^.*STUNT.?1.*$",
        "^.*TAC.?SCAN.*$",
        "^.*MUSIC.*MACHINE.*$", 		  "^.*MUSCMACH.*$",
        "^.*VONG.*$",
        "^.*WARPLOCK.*$"
    ];

    var CRT_MODE_ROM_NAMES = [
        "^.*STAR.*CASTLE.*$",
        "^.*SEAWEED.*$",
        "^.*ANDREW.*DAVIE.*$",          "^.*DEMO.*IMAGE.*AD.*$" 		// Various 32K Image demos
    ];

    var HINTS_PREFIX_REGEX = "^(|.*?(\\W|_|%20))";
    var HINTS_SUFFIX_REGEX = "(|(\\W|_|%20).*)$";

    var FORMAT_PRIORITY_BOOST = 50;

};

jt.CartridgeCreator = new jt.CartridgeCreatorImpl();

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Images = {

    embedded: false,
    count: 5,

    urls: {
        logo: Javatari.IMAGES_PATH + "logo.png",
        loading: Javatari.IMAGES_PATH + "loading.gif",
        mouseCursor: Javatari.IMAGES_PATH + "mouse-cursor.png",
        panel: Javatari.IMAGES_PATH + "panel.jpg",
        panelSprites: Javatari.IMAGES_PATH + "panel-sprites.jpg",
        controllers: Javatari.IMAGES_PATH + "controllers.jpg",
        iconSprites: Javatari.IMAGES_PATH + "icon-sprites.png"
    }

};


// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.RecentStoredROMs = function() {

    this.getCatalog = function() {
        if (!storedList) {
            try {
                storedList = JSON.parse(localStorage.javataristoredromsicatalog);
            } catch (e) {
                // giveup
            }
            if (!storedList) initStore();
        }
        return storedList;
    };

    this.storeROM = function(rom) {
        this.getCatalog();
        var found = storedList.find(function(stored) { return stored && stored.h === rom.info.h; });

        if (!found || (found.n != rom.info.n || found.f != rom.info.f)) {
            getStoredROMs();
            if (found) {
                var oldIdx = storedList.indexOf(found);
                storedList.splice(oldIdx, 1);
                storedROMs.splice(oldIdx, 1);
            } else if (storedList.length >= MAX_ITMES) {
                storedList = storedList.slice(0, MAX_ITMES - 1);
                storedROMs = storedROMs.slice(0, MAX_ITMES - 1);
            }
            storedList.unshift({ n: rom.info.l, h: rom.info.h, f: rom.info.f });
            for (var i = 0; i < storedList.length; ++i) storedList[i].i = i;
            localStorage.javataristoredromsicatalog = JSON.stringify(storedList);
            storedROMs.unshift(rom.saveState(true));        // true: include content bytes
            localStorage.javataristoredromsdata = JSON.stringify(storedROMs);
            this.lastROMLoadedIndex = 0;
            jt.Util.log("New ROM stored: " + rom.info.n + ", " + rom.info.h);
        } else
            this.lastROMLoadedIndex = storedList.indexOf(found);

        localStorage.javataristoredromslastindex = this.lastROMLoadedIndex;
    };

    this.getROM = function(index) {
        this.lastROMLoadedIndex = index;
        localStorage.javataristoredromslastindex = index;
        var romState = getStoredROMs()[index];
        return romState ? jt.ROM.loadState(romState) : null;
    };


    function getStoredROMs() {
        if (!storedROMs) {
            try {
                storedROMs = JSON.parse(localStorage.javataristoredromsdata);
            } catch (e) {
                // giveup
            }
            if (!storedROMs) initStore();
        }
        return storedROMs;
    }

    function initStore() {
        storedList = [];
        localStorage.javataristoredromsicatalog = JSON.stringify(storedList);
        storedROMs = [];
        localStorage.javataristoredromsdata = JSON.stringify(storedROMs);
    }

    var last = localStorage.javataristoredromslastindex;
    this.lastROMLoadedIndex = last !== undefined ? Number.parseInt(last) : -1;

    var storedList, storedROMs;

    var MAX_ITMES = 10;

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.FileLoader = function(recentStoredROMs) {
"use strict";

    var self = this;

    this.connect = function(pConsole) {
        console = pConsole;
        cartridgeSocket = console.getCartridgeSocket();
        saveStateSocket = console.getSavestateSocket();
    };

    this.registerForDnD = function (element) {
        element.addEventListener("dragover", onDragOver, false);
        element.addEventListener("drop", onDrop, false);
    };

    this.registerForFileInputElement = function (element) {
        fileInputElementParent = element;
    };

    this.openFileChooserDialog = function (openType, altPower, inSecondaryPort, asExpansion) {
        if (!fileInputElement) createFileInputElement();
        fileInputElement.multiple = INPUT_MULTI[OPEN_TYPE[openType] || OPEN_TYPE.AUTO];
        fileInputElement.accept = INPUT_ACCEPT[OPEN_TYPE[openType] || OPEN_TYPE.AUTO];

        chooserOpenType = openType;
        chooserPort = inSecondaryPort ? 1 : 0;
        chooserAltPower = altPower;
        chooserAsExpansion = asExpansion;
        fileInputElement.click();
    };

    this.openURLChooserDialog = function (openType, altPower, inSecondaryPort, asExpansion) {
        var port = inSecondaryPort ? 1 : 0;
        var url;
        try {
            url = localStorage && localStorage[LOCAL_STORAGE_LAST_URL_KEY];
        } catch (e) {
            // give up
        }

        var wasPaused = console.systemPause(true);

        url = prompt("Load file from URL:", url || "");
        url = url && url.toString().trim();

        if (url) {
            try {
                localStorage[LOCAL_STORAGE_LAST_URL_KEY] = url;
            } catch (e) {
                // give up
            }
            this.readFromURL(url, openType, port, altPower, asExpansion, function () {
                if (!wasPaused) console.systemPause(false);
            });
        } else {
            if (!wasPaused) console.systemPause(false);
        }
    };

    this.readFromFile = function (file, openType, port, altPower, asExpansion, then) {      // Auto detects type
        jt.Util.log("Reading file: " + file.name);
        var reader = new FileReader();
        reader.onload = function (event) {
            var content = new Uint8Array(event.target.result);
            var aFile = { name: file.name, content: content, lastModifiedDate: file.lastModified ? new Date(file.lastModified) : file.lastModifiedDate };     // lastModifiedDate deprecated?
            self.loadFromFile(aFile, openType, port, altPower, asExpansion);
            if (then) then(true);
        };
        reader.onerror = function (event) {
            showError("File reading error: " + event.target.error.name + DIR_NOT_SUPPORTED_HINT);     // Directories not supported
            if (then) then(false);
        };

        reader.readAsArrayBuffer(file);
    };

    this.readFromURL = function (url, openType, port, altPower, asExpansion, then) {
        new jt.MultiDownloader(
            [{ url: url }],
            function onAllSuccess(urls) {
                var aFile = { name: url, content: urls[0].content, lastModifiedDate: null };
                self.loadFromFile(aFile, openType, port, altPower, asExpansion);
                if (then) then(true);
            },
            function onAnyError(urls) {
                showError("URL reading error: " + urls[0].error);
                if (then) then(false);
            }
        ).start();
    };

    this.readFromFiles = function (files, openType, port, altPower, asExpansion, then) {
        var reader = new jt.MultiFileReader(files,
            function onSuccessAll(files) {
                self.loadFromFiles(files, openType, port, altPower, asExpansion);
                if (then) then(true);
            },
            function onFirstError(files, error, known) {
                if (!known) error += DIR_NOT_SUPPORTED_HINT;                  // Directories not supported
                showError("File reading error: " + error);
                if (then) then(false);
            }
        );
        reader.start();
    };

    this.loadFromContent = function(name, content, openType, port, altPower, asExpansion, format) {
        return this.loadFromFile({ name: name, content: content }, openType, port, altPower, asExpansion, format);
    };

    this.loadFromFile = function(file, openType, port, altPower, asExpansion, format) {
        var zip, mes;
        zip = jt.Util.checkContentIsZIP(file.content);
        if (zip) {
            try {
                // Try normal loading from files
                var files = jt.Util.getZIPFilesSorted(zip);
                if (tryLoadFilesAsMedia(files, openType, port, altPower, asExpansion, format, true)) return;
            } catch(ez) {
                jt.Util.error(ez);      // Error decompressing files. Abort
            }
        } else {
            // Try normal loading from files
            if (tryLoadFilesAsMedia([file], openType, port, altPower, asExpansion, format, false)) return;
        }
        showError("No valid " + TYPE_DESC[openType] + " found.")
    };

    this.loadFromFiles = function(files, openType, port, altPower, asExpansion) {
        // Sort files by name
        files = jt.Util.asNormalArray(files).slice(0);
        files.sort(function sortFiles(a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });

        if (tryLoadFilesAsMedia(files, openType, port, altPower, asExpansion, null, false)) return;
        showError("No valid " + TYPE_DESC[openType] + " found.")
    };

    this.loadROM = function(rom, port, altPower, chooserAsExpansion) {
        var cart = jt.CartridgeCreator.createCartridgeFromRom(rom);
        if (!cart) return false;
        cartridgeSocket.insert(cart, !altPower);
        recentStoredROMs.storeROM(rom);
        return true;
    };

    function tryLoadFilesAsMedia(files, openType, port, altPower, asExpansion, format, filesFromZIP) {
        // Try as Single media (first found)
        for (var i = 0; i < files.length; i++)
            if (tryLoadFileAsSingleMedia(files[i], openType, port, altPower, asExpansion, format, filesFromZIP)) return true;
        return false;
    }

    function tryLoadFileAsSingleMedia(file, openType, port, altPower, asExpansion, format, fileFromZIP, stopRecursion) {
        try {
            if (fileFromZIP && !file.content) file.content = file.asUint8Array();
            var content = file.content;

            if (!stopRecursion) {
                var zip = jt.Util.checkContentIsZIP(content);
                if (zip) {
                    var files = jt.Util.getZIPFilesSorted(zip);
                    for (var i = 0; i < files.length; i++)
                        if (tryLoadFileAsSingleMedia(files[i], openType, port, altPower, asExpansion, format, true, true)) return true;
                    return false;
                }
            }

            var gzip = jt.Util.checkContentIsGZIP(content);
            if (gzip) return tryLoadFileAsSingleMedia({ name: file.name, content: gzip }, openType, port, altPower, asExpansion, format, false, true);
        } catch (ez) {
            jt.Util.error(ez);      // Error decompressing files. Abort
            return false;
        }

        return tryLoadContentAsSingleMedia(file.name, content, openType, port, altPower, asExpansion, format);
    }

    function tryLoadContentAsSingleMedia(name, content, openType, port, altPower, asExpansion, format) {
        openType = openType || OPEN_TYPE.AUTO;
        // Try as a SaveState file
        if (openType === OPEN_TYPE.STATE || openType === OPEN_TYPE.AUTO)
            if (saveStateSocket.loadStateFile(content)) return true;
        // Try as Cartridge Data (SRAM, etc)
        if (openType === OPEN_TYPE.CART_DATA || openType === OPEN_TYPE.AUTO)
            if (cartridgeSocket.loadCartridgeData(port, name, content)) return true;
        // Try to load as ROM (Cartridge)
        if (openType === OPEN_TYPE.ROM || openType === OPEN_TYPE.AUTO) {
            var rom = new jt.ROM(name, content, null, format);
            return self.loadROM(rom, port, altPower, asExpansion);
        }
        // Not a valid content
        return false;
    }

    function onFileInputChange(e) {
        e.returnValue = false;  // IE
        e.preventDefault();
        e.stopPropagation();
        e.target.focus();
        if (!this.files || this.files.length === 0) return;           // this will have a property "files"!

        var files = jt.Util.asNormalArray(this.files);

        // Tries to clear the last selected file so the same file can be chosen
        try {
            fileInputElement.value = "";
        } catch (ex) {
            // Ignore
        }

        var wasPaused = console.systemPause(true);
        var resume = function (s) {
            if (!wasPaused) console.systemPause(false);
        };

        if (files && files.length > 0) {
            if (files.length === 1)
                self.readFromFile(files[0], chooserOpenType, chooserPort, chooserAltPower, chooserAsExpansion, resume);
            else
                self.readFromFiles(files, chooserOpenType, chooserPort, chooserAltPower, chooserAsExpansion, resume);
        }

        return false;
    }

    function onDragOver(e) {
        e.returnValue = false;  // IE
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer) {
            if (Javatari.CARTRIDGE_CHANGE_DISABLED)
                e.dataTransfer.dropEffect = "none";
            else if (e.ctrlKey)
                e.dataTransfer.dropEffect = "copy";
            else if (e.altKey)
                e.dataTransfer.dropEffect = "link";
        }

        dragButtons = e.buttons > 0 ? e.buttons : MOUSE_BUT1_MASK;      // If buttons not supported, consider it a left-click
    }

    function onDrop(e) {
        e.returnValue = false;  // IE
        e.preventDefault();
        e.stopPropagation();
        e.target.focus();

        if (Javatari.CARTRIDGE_CHANGE_DISABLED) return;
        if (!e.dataTransfer) return;

        var wasPaused = console.systemPause(true);

        var port = e.shiftKey ? 1 : 0;
        var altPower = dragButtons & MOUSE_BUT2_MASK;
        var asExpansion = e.ctrlKey;

        var openType = OPEN_TYPE.AUTO;

        // Try to get local file/files if present
        var files = e.dataTransfer && e.dataTransfer.files;
        var resume = function (s) {
            if (!wasPaused) console.systemPause(false);
        };
        if (files && files.length > 0) {
            if (files.length === 1)
                self.readFromFile(files[0], openType, port, altPower, asExpansion, resume);
            else
                self.readFromFiles(files, openType, port, altPower, asExpansion, resume);
        } else {
            // If not, try to get URL
            var url = e.dataTransfer.getData("text");
            if (url && url.length > 0)
                self.readFromURL(url, openType, port, altPower, asExpansion, resume);
            else
                resume();
        }
    }

    function showError(message) {
        jt.Util.message("Could not load file(s):\n\n" + message + "\n");
    }

    function createFileInputElement() {
        fileInputElement = document.createElement("input");
        fileInputElement.id = "jt-file-loader-input";
        fileInputElement.type = "file";
        fileInputElement.multiple = true;
        fileInputElement.accept = INPUT_ACCEPT.AUTO;
        fileInputElement.style.display = "none";
        fileInputElement.addEventListener("change", onFileInputChange);
        fileInputElementParent.appendChild(fileInputElement);
    }


    var console;
    var cartridgeSocket;
    var saveStateSocket;

    var fileInputElement;
    var fileInputElementParent;

    var chooserOpenType;
    var chooserPort = 0;
    var chooserAltPower = false;
    var chooserAsExpansion = false;

    var dragButtons = 1;

    var MOUSE_BUT1_MASK = 1;
    var MOUSE_BUT2_MASK = 2;


    var OPEN_TYPE = jt.FileLoader.OPEN_TYPE;
    this.OPEN_TYPE = OPEN_TYPE;                         // For the programatic interface

    var INPUT_ACCEPT = {
        ROM:   ".bin,.BIN,.rom,.ROM,.a26,.A26,.zip,.ZIP,.gz,.GZ,.gzip,.GZIP",
        STATE: ".jst,.JST",
        CART_DATA: ".dat,.DAT,.sram,.SRAM",
        AUTO:   ".bin,.BIN,.rom,.ROM,.a26,.A26,.jst,.JST,.zip,.ZIP,.gz,.GZ,.gzip,.GZIP"
    };

    var INPUT_MULTI = {
        ROM:   false,
        STATE: false,
        CART_DATA: false,
        AUTO:   false
    };

    var TYPE_DESC = {
        ROM:   "ROM",
        STATE: "Savestate",
        CART_DATA: "Cartridge Data",
        AUTO:   "ROM"
    };

    var LOCAL_STORAGE_LAST_URL_KEY = "javatarilasturl";

    var DIR_NOT_SUPPORTED_HINT = '\n\nIMPORTANT: Directories are not supported for loading!';

    Javatari.fileLoader = this;

};

jt.FileLoader.OPEN_TYPE = {  AUTO: "AUTO", ROM: "ROM", STATE: "STATE", CART_DATA: "CART_DATA" };
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.FileDownloader = function() {
"use strict";

    this.connectPeripherals = function(pScreen) {
        screen = pScreen;
    };

    this.registerForDownloadElement = function (element) {
        downloadLinkElementParent = element;
    };

    this.startDownloadBinary = function (fileName, data, desc) {
        try {
            if (!saveType) setup();
            if (checkNone()) return;

            var href;
            if (saveType === "BLOB") {
                // Release previous URL
                if (downloadLinkElement.href) (window.URL || window.webkitURL).revokeObjectURL(downloadLinkElement.href);
                var blob = new Blob([data], {type: "data:application/octet-stream"});
                href = (window.URL || window.webkitURL).createObjectURL(blob);
            } else
                href = "data:application/octet-stream;base64," + btoa(typeof data === "string" ? data : jt.Util.int8BitArrayToByteString(data));

            downloadLinkElement.download = fileName && fileName.trim();
            downloadLinkElement.href = href;
            downloadLinkElement.click();

            screen.showOSD(desc + " saved", true);
        } catch(ex) {
            screen.showOSD(desc + " save FAILED!", true, true);
            jt.Util.error(ex);
        }
    };

    this.startDownloadURL = function (fileName, url, desc) {
        try {
            if (!saveType) setup();
            if (checkNone()) return;

            if (saveType === "BLOB")
                // Release previous URL
                if (downloadLinkElement.href) (window.URL || window.webkitURL).revokeObjectURL(downloadLinkElement.href);

            downloadLinkElement.download = fileName && fileName.trim();
            downloadLinkElement.href = url;
            downloadLinkElement.click();

            screen.showOSD(desc + " saved", true);
        } catch(ex) {
            screen.showOSD(desc + " save FAILED!", true, true);
            jt.Util.error(ex);
        }
    };

    function checkNone() {
        if (saveType === "NONE") {
            alert("Unfortunately file saving in WebApps is broken in this version of iOS. The file could not be saved. If you really need to save a file, you must run Javatari on the official homepage." );
            return true;
        }
    }

    function setup() {
        saveType = jt.Util.isIOSDevice()
            ? jt.Util.isBrowserStandaloneMode() ? "NONE" : "DATA"
            : jt.Util.browserInfo().name === "SAFARI" ? "DATA" : "BLOB";

        // No need to create link element if we won't use it
        if (saveType === "NONE") return;

        downloadLinkElement = document.createElement('a');
        downloadLinkElement.style.display = "none";
        downloadLinkElement.target = "_blank";
        downloadLinkElement.href = "#";
        downloadLinkElementParent.appendChild(downloadLinkElement);
    }


    var saveType;
    var downloadLinkElement;
    var downloadLinkElementParent;
    var screen;

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// General, immutable info about host keys on different browsers and keyboard languages/layouts

jt.DOMKeys = {};

jt.DOMKeys.MOD_SHIFT = 16;
jt.DOMKeys.LOC_SHIFT = 24;

jt.DOMKeys.SHIFT =   0x10000;
jt.DOMKeys.CONTROL = 0x20000;
jt.DOMKeys.ALT =     0x40000;
jt.DOMKeys.META =    0x80000;

jt.DOMKeys.LOCNONE =  0x0000000;
jt.DOMKeys.LOCLEFT =  0x1000000;
jt.DOMKeys.LOCRIGHT = 0x2000000;
jt.DOMKeys.LOCNUM =   0x3000000;

jt.DOMKeys.IGNORE_ALL_MODIFIERS_MASK = ~(jt.DOMKeys.SHIFT | jt.DOMKeys.CONTROL | jt.DOMKeys.ALT | jt.DOMKeys.META);


(function(k, left, right, num) {

    // Common keys (US)

    k.VK_F1 = {c: 112, n: "F1" };
    k.VK_F2 = {c: 113, n: "F2" };
    k.VK_F3 = {c: 114, n: "F3" };
    k.VK_F4 = {c: 115, n: "F4" };
    k.VK_F5 = {c: 116, n: "F5" };
    k.VK_F6 = {c: 117, n: "F6" };
    k.VK_F7 = {c: 118, n: "F7" };
    k.VK_F8 = {c: 119, n: "F8" };
    k.VK_F9 = {c: 120, n: "F9" };
    k.VK_F10 = {c: 121, n: "F10" };
    k.VK_F11 = {c: 122, n: "F11" };
    k.VK_F12 = {c: 123, n: "F12" };

    k.VK_1 = {c: 49, n: "1" };
    k.VK_2 = {c: 50, n: "2" };
    k.VK_3 = {c: 51, n: "3" };
    k.VK_4 = {c: 52, n: "4" };
    k.VK_5 = {c: 53, n: "5" };
    k.VK_6 = {c: 54, n: "6" };
    k.VK_7 = {c: 55, n: "7" };
    k.VK_8 = {c: 56, n: "8" };
    k.VK_9 = {c: 57, n: "9" };
    k.VK_0 = {c: 48, n: "0" };

    k.VK_Q = {c: 81, n: "Q" };
    k.VK_W = {c: 87, n: "W" };
    k.VK_E = {c: 69, n: "E" };
    k.VK_R = {c: 82, n: "R" };
    k.VK_T = {c: 84, n: "T" };
    k.VK_Y = {c: 89, n: "Y" };
    k.VK_U = {c: 85, n: "U" };
    k.VK_I = {c: 73, n: "I" };
    k.VK_O = {c: 79, n: "O" };
    k.VK_P = {c: 80, n: "P" };
    k.VK_A = {c: 65, n: "A" };
    k.VK_S = {c: 83, n: "S" };
    k.VK_D = {c: 68, n: "D" };
    k.VK_F = {c: 70, n: "F" };
    k.VK_G = {c: 71, n: "G" };
    k.VK_H = {c: 72, n: "H" };
    k.VK_J = {c: 74, n: "J" };
    k.VK_K = {c: 75, n: "K" };
    k.VK_L = {c: 76, n: "L" };
    k.VK_Z = {c: 90, n: "Z" };
    k.VK_X = {c: 88, n: "X" };
    k.VK_C = {c: 67, n: "C" };
    k.VK_V = {c: 86, n: "V" };
    k.VK_B = {c: 66, n: "B" };
    k.VK_N = {c: 78, n: "N" };
    k.VK_M = {c: 77, n: "M" };

    k.VK_ESCAPE = {c: 27, n: "Esc" };
    k.VK_ENTER = {c: 13, n: "Enter" };
    k.VK_SPACE = {c: 32, n: "Space" };
    k.VK_TAB = {c: 9, n: "Tab" };
    k.VK_BACKSPACE = {c: 8, n: "BackSpc" };

    k.VK_CONTEXT = {c: 93, n: "Context" };

    k.VK_LSHIFT = {c: 16 | left, n: "L-Shift" };
    k.VK_LCONTROL = {c: 17 | left, n: "L-Control" };
    k.VK_LALT = {c: 18 | left, n: "L-Alt" };
    k.VK_LMETA = {c: 91 | left, n: "L-Meta" };

    k.VK_RSHIFT = {c: 16 | right, n: "R-Shift" };
    k.VK_RCONTROL = {c: 17 | right, n: "R-Control" };
    k.VK_RALT = {c: 18 | right, n: "R-Alt" };
    k.VK_RMETA = {c: 91 | right, n: "R-Meta" };

    k.VK_CAPS_LOCK = {c: 20, n: "CapsLock" };
    k.VK_PRINT_SCREEN = {c: 44, n: "PrtScr" };
    k.VK_SCROLL_LOCK = {c: 145, n: "ScrLck" };
    k.VK_PAUSE = {c: 19, n: "Pause" };
    k.VK_BREAK = {c: 3, n: "Break" };

    k.VK_INSERT = {c: 45, n: "Ins" };
    k.VK_DELETE = {c: 46, n: "Del" };
    k.VK_HOME = {c: 36, n: "Home" };
    k.VK_END = {c: 35, n: "End" };
    k.VK_PAGE_UP = {c: 33, n: "PgUp" };
    k.VK_PAGE_DOWN = {c: 34, n: "PgDown" };

    k.VK_NUM_INSERT = {c: 45 | num, n: "Num Ins" };
    k.VK_NUM_DELETE = {c: 46 | num, n: "Num Del" };
    k.VK_NUM_HOME = {c: 36 | num, n: "Num Home" };
    k.VK_NUM_END = {c: 35 | num, n: "Num End" };
    k.VK_NUM_PAGE_UP = {c: 33 | num, n: "Num PgUp" };
    k.VK_NUM_PAGE_DOWN = {c: 34 | num, n: "Num PgDown" };

    k.VK_UP = {c: 38, n: "Up" };
    k.VK_DOWN = {c: 40, n: "Down" };
    k.VK_LEFT = {c: 37, n: "Left" };
    k.VK_RIGHT = {c: 39, n: "Right" };

    k.VK_NUM_UP = {c: 38 | num, n: "Num Up" };
    k.VK_NUM_DOWN = {c: 40 | num, n: "Num Down" };
    k.VK_NUM_LEFT = {c: 37 | num, n: "Num Left" };
    k.VK_NUM_RIGHT = {c: 39 | num, n: "Num Right" };

    k.VK_NUMLOCK = {c: 144, n: "NumLock" };
    k.VK_NUM_COMMA = {c: 110 | num, n: "Num ," };
    k.VK_NUM_DIVIDE = {c: 111 | num, n: "Num /" };
    k.VK_NUM_MULTIPLY = {c: 106 | num, n: "Num *" };
    k.VK_NUM_MINUS = {c: 109 | num, n: "Num -" };
    k.VK_NUM_PLUS = {c: 107 | num, n: "Num +" };
    k.VK_NUM_PERIOD = {c: 194 | num, n: "Num ." };
    k.VK_NUM_0 = {c: 96 | num, n: "Num 0" };
    k.VK_NUM_1 = {c: 97 | num, n: "Num 1" };
    k.VK_NUM_2 = {c: 98 | num, n: "Num 2" };
    k.VK_NUM_3 = {c: 99 | num, n: "Num 3" };
    k.VK_NUM_4 = {c: 100 | num, n: "Num 4" };
    k.VK_NUM_5 = {c: 101 | num, n: "Num 5" };
    k.VK_NUM_6 = {c: 102 | num, n: "Num 6" };
    k.VK_NUM_7 = {c: 103 | num, n: "Num 7" };
    k.VK_NUM_8 = {c: 104 | num, n: "Num 8" };
    k.VK_NUM_9 = {c: 105 | num, n: "Num 9" };
    k.VK_NUM_CLEAR = {c: 12 | num, n: "Num Clear" };
    k.VK_NUM_ENTER = {c: 13 | num, n: "Num Enter" };

    k.VK_QUOTE = {c: 222, n: "'" };
    k.VK_BACKQUOTE = {c: 192, n: "`" };
    k.VK_MINUS = {c: 189, n: "-" };
    k.VK_EQUALS = {c: 187, n: "=" };
    k.VK_OPEN_BRACKET = {c: 219, n: "[" };
    k.VK_CLOSE_BRACKET = {c: 221, n: "]" };
    k.VK_COMMA = {c: 188, n: "," };
    k.VK_PERIOD = {c: 190, n: "." };
    k.VK_SEMICOLON = {c: 186, n: ";" };
    k.VK_SLASH = {c: 191, n: "/" };
    k.VK_BACKSLASH = {c: 220, n: "\\" };

    k.VK_ALTERNATE_ESC = { c: k.VK_F1.c | jt.DOMKeys.ALT, n: [ "Alt", "F1" ] };

    // Alternate codes for FF
    k.VK_FF_MINUS = {c: 173, n: "-" };
    k.VK_FF_EQUALS = {c: 61, n: "=" };
    k.VK_FF_SEMICOLON = {c: 59, n: ";" };

    // BR alternate codes
    k.VK_BR_QUOTE = {c: 192, n: "'" };
    k.VK_BR_OPEN_BRACKET = {c: 221, n: "[" };
    k.VK_BR_CLOSE_BRACKET = {c: 220, n: "]" };
    k.VK_BR_SEMICOLON = {c: 191, n: ";" };
    k.VK_BR_SLASH = {c: 193, n: "/" };
    k.VK_BR_BACKSLASH = {c: 226, n: "\\" };

    // BR additional keys
    k.VK_BR_CEDILLA = {c: 186, n: "Ç" };
    k.VK_BR_TILDE = {c: 222, n: "~" };
    k.VK_BR_ACUTE = {c: 219, n: "´" };

    k.VK_FF_BR_TILDE = {c: 176, n: "~" };
    //k.VK_FF_BR_CEDILLA = {c: 0, n: "Ç" };

    k.VK_VOID = {c: -1, n: ""}

})(jt.DOMKeys, jt.DOMKeys.LOCLEFT, jt.DOMKeys.LOCRIGHT, jt.DOMKeys.LOCNUM);

jt.DOMKeys.forcedNames = {
    27:  "Esc",
    13:  "Enter",
    32:  "Space",
    9:   "Tab",
    8:   "BkSpc",
    16:  "Shift",
    17:  "Ctrl",
    18:  "Alt",
    91:  "Meta",
    93:  "Context",
    20:  "Caps",
    44:  "PrtScr",
    145: "ScrLck",
    19:  "Pause",
    3:   "Break",
    45:  "Ins",
    46:  "Del",
    36:  "Home",
    35:  "End",
    33:  "PgUp",
    34:  "PgDown",
    38:  "Up",
    40:  "Down",
    37:  "Left",
    39:  "Right"
};

jt.DOMKeys.isModifierKeyCode = function(keyCode) {
    return keyCode === 16 || keyCode === 17 || keyCode === 18 || keyCode === 91;
};

jt.DOMKeys.codeForKeyboardEvent = function(e) {
    var code = e.keyCode;

    // Ignore modifiers for modifier keys SHIFT, CONTROL, ALT, META
    if (this.isModifierKeyCode(code))
        return (code & this.IGNORE_ALL_MODIFIERS_MASK) | (e.location << this.LOC_SHIFT);

    return code
        | (e.location << this.LOC_SHIFT)
        | (e.shiftKey ? this.SHIFT : 0)
        | (e.ctrlKey ? this.CONTROL : 0)
        | (e.altKey  ? this.ALT : 0)
        | (e.metaKey ? this.META : 0);
};

jt.DOMKeys.nameForKeyboardEvent = function(e) {
    var keyCode = e.keyCode;
    var name = this.forcedNames[keyCode] || e.key;
    var nameUp = name && name.toUpperCase();
    if (!nameUp || nameUp === "UNIDENTIFIED" || nameUp === "UNDEFINED" || nameUp === "UNKNOWN") name = "#" + keyCode;
    else if (nameUp === "DEAD") name = "Dead#" + keyCode;

    if (name.length === 1) name = name.toUpperCase();                           // For normal letters
    else if (name.length > 12) name = name.substr(0, 12);                       // Limit size

    // Add location info
    switch(e.location) {
        case 1: name = "L-" + name; break;
        case 2: name = "R-" + name; break;
        case 3: name = "Num " + name;
    }

    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
        name = [ name ];
        // Add modifiers info
        if (e.metaKey) name.unshift("Meta");
        if (e.altKey) name.unshift("Alt");
        if (e.ctrlKey) name.unshift("Ctrl");
        if (e.shiftKey) name.unshift("Shift");
    }

    return name;
};

jt.DOMKeys.nameForKeyboardEventSingle = function(e) {
    var keyCode = e.keyCode;
    var name = this.forcedNames[keyCode] || e.key;
    var nameUp = name && name.toUpperCase();
    if (!nameUp || nameUp === "UNIDENTIFIED" || nameUp === "UNDEFINED" || nameUp === "UNKNOWN") name = "#" + keyCode;
    else if (nameUp === "DEAD") name = "Dead#" + keyCode;

    if (name.length === 1) name = name.toUpperCase();                           // For normal letters
    else if (name.length > 12) name = name.substr(0, 12);                       // Limit size

    // Add location info
    switch(e.location) {
        case 1: name = "L-" + name; break;
        case 2: name = "R-" + name; break;
        case 3: name = "Num " + name;
    }

    return name;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// General, immutable info about host Gamepad Buttons

jt.GamepadButtons = {

    GB_1:     { b:  0, n: "1" },
    GB_2:     { b:  1, n: "2" },
    GB_3:     { b:  2, n: "3" },
    GB_4:     { b:  3, n: "4" },
    GB_L1:    { b:  4, n: "L1" },
    GB_R1:    { b:  5, n: "R1" },
    GB_L2:    { b:  6, n: "L2" },
    GB_R2:    { b:  7, n: "R2" },
    GB_BACK:  { b:  8, n: "BACK" },
    GB_START: { b:  9, n: "START" },
    GB_S1:    { b: 10, n: "S1" },
    GB_S2:    { b: 11, n: "S2" },
    GB_UP:    { b: 12, n: "&#9650;" },
    GB_DOWN:  { b: 13, n: "&#9660;" },
    GB_LEFT:  { b: 14, n: "&#9668;" },
    GB_RIGHT: { b: 15, n: "&#9658;" },
    GB_LOGO:  { b: 16, n: "LOGO" },

    GB_VOID:  { b: -1, n: "Unbound" }

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// General, immutable info about host Touch Buttons

jt.TouchControls = {

    buttons: [ "T_B", "T_A" ]       // Specific order for vertical in-line placement on the screen

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.GamepadConsoleControls = function(consoleControls) {
"use strict";

    this.connect = function(pConsoleControlsSocket) {
        consoleControlsSocket = pConsoleControlsSocket;
    };

    this.connectScreen = function(pScreen) {
        screen = pScreen;
    };

    this.powerOn = function() {
        supported = !!navigator.getGamepads;
        if (!supported) return;
        this.applyPreferences();
        resetStates();
    };

    this.powerOff = function() {
        supported = false;
    };

    this.toggleMode = function() {
        if (!supported) {
            screen.showOSD("Joysticks unavailable (not supported by browser)", true, true);
            return;
        }
        ++mode; if (mode > 0) mode = -2;

        if (mode === -2) {
            joystick0 = joystick1 = null;
        } else if (mode === -1) {
            gamepadsDetectionDelay = 60;
            this.controlsClockPulse();
        }

        swappedMode = mode === 0;
        this.applyPreferences();
        resetStates();

        screen.showOSD("Gamepads " + this.getModeDesc(), true);
    };

    this.setPaddleMode = function(state) {
        if (!supported) return;
        paddleMode = state;
        joy0State.xPosition = joy1State.xPosition = -1;
    };

    this.setP1ControlsMode = function(state) {
        p1ControlsMode = state;
        this.applyPreferences();
    };

    this.controlsClockPulse = function() {
        if (!supported || mode === -2) return;

        // Try to avoid polling at gamepads if none are present, as it may be expensive
        // Only try to detect connected gamepads once each 60 clocks (frames)
        if (++gamepadsDetectionDelay >= 60) gamepadsDetectionDelay = 0;
        if (!joystick0 && !joystick1 && gamepadsDetectionDelay !== 0) return;

        var gamepads = navigator.getGamepads();     // Just one poll per clock here then use it several times

        if (joystick0) {
            if (joystick0.update(gamepads)) {
                if (joystick0.hasMoved())
                    update(joystick0, joy0State, joy0Prefs, joy0Keys);
            } else {
                joystick0 = null;
                joystickConnectionMessage(true, false);
            }
        } else {
            if (gamepadsDetectionDelay === 0) {
                joystick0 = detectNewJoystick(joy0Prefs, joy1Prefs, gamepads);
                if (joystick0) joystickConnectionMessage(true, true);
            }
        }

        if (joystick1) {
            if (joystick1.update(gamepads)) {
                if (joystick1.hasMoved())
                    update(joystick1, joy1State, joy1Prefs, joy1Keys);
            } else {
                joystick1 = null;
                joystickConnectionMessage(false, false);
            }
        } else {
            if (gamepadsDetectionDelay === 0) {
                joystick1 = detectNewJoystick(joy1Prefs, joy0Prefs, gamepads);
                if (joystick1) joystickConnectionMessage(false, true);
            }
        }
    };

    var joystickConnectionMessage = function (joy0, conn) {
        screen.showOSD((joy0 ^ p1ControlsMode ^ swappedMode ? "P1" : "P2") + " Gamepad " + (conn ? "connected" : "disconnected"), joy0);
    };

    var detectNewJoystick = function(prefs, notPrefs, gamepads) {
        if (!gamepads || gamepads.length === 0) return;
        // Fixed index detection. Also allow the same gamepad to control both players
        var device = prefs.device;
        if (device >= 0)   // pref.device == -1 means "auto"
            return gamepads[device] && gamepads[device].buttons.length > 0 ? new Joystick(device, prefs) : null;
        // Auto detection
        for (var i = 0, len = gamepads.length; i < len; i++)
            if (gamepads[i] && gamepads[i].buttons.length > 0)
                if (i !== notPrefs.device && (!joystick0 || joystick0.index !== i) && (!joystick1 || joystick1.index !== i))
                    // New Joystick found!
                    return new Joystick(i, prefs);
    };

    var resetStates = function() {
        joy0State = newControllerState();
        joy1State = newControllerState();
    };

    var update = function (joystick, joyState, joyPrefs, joyKeys) {
        // Paddle Analog
        if (paddleMode && joyPrefs.paddleSens !== 0) {
            var newPosition = joystick.getPaddlePosition();
            if (newPosition !== joyState.xPosition) {
                joyState.xPosition = newPosition;
                consoleControlsSocket.controlValueChanged(joyPrefs.player ? controls.PADDLE1_POSITION : controls.PADDLE0_POSITION, newPosition);
            }
        }
        // Joystick direction (Analog or POV) and Paddle Digital (Analog or POV)
        var newDirection = joystick.getDPadDirection();
        if (newDirection === -1 && (!paddleMode || joyPrefs.paddleSens === 0))
            newDirection = joystick.getStickDirection();
        if (newDirection !== joyState.direction) {
            var newUp = false, newRight = false, newDown = false, newLeft = false;
            switch (newDirection) {
                case 0: newUp = true; break;
                case 1: newUp = newRight = true; break;
                case 2: newRight = true; break;
                case 3: newDown = newRight = true; break;
                case 4: newDown = true; break;
                case 5: newDown = newLeft = true; break;
                case 6: newLeft = true; break;
                case 7: newUp = newLeft = true; break;
            }
            consoleControls.processKey(joyKeys.up.c, newUp);
            consoleControls.processKey(joyKeys.right.c, newRight);
            consoleControls.processKey(joyKeys.down.c, newDown);
            consoleControls.processKey(joyKeys.left.c, newLeft);
            joyState.direction = newDirection;
        }
        // Joystick Normal Button
        var newButton = joystick.getButtonDigital(joyPrefs.button);
        if (newButton !== joyState.button) {
            consoleControls.processKey(joyKeys.button.c, newButton);
            joyState.button = newButton;
        }
        // Joystick Turbo Button
        newButton = joystick.getButtonDigital(joyPrefs.buttonT);
        if (newButton !== joyState.buttonT) {
            consoleControls.processKey(joyKeys.buttonT.c, newButton);
            joyState.buttonT = newButton;
        }
        // Other Console controls
        var newSelect = joystick.getButtonDigital(joyPrefs.select);
        if (newSelect !== joyState.select) {
            consoleControlsSocket.controlStateChanged(controls.SELECT, newSelect);
            joyState.select = newSelect;
        }
        var newReset = joystick.getButtonDigital(joyPrefs.reset);
        if (newReset !== joyState.reset) {
            consoleControlsSocket.controlStateChanged(controls.RESET, newReset);
            joyState.reset = newReset;
        }
        var newPause = joystick.getButtonDigital(joyPrefs.pause);
        if (newPause !== joyState.pause) {
            consoleControlsSocket.controlStateChanged(controls.PAUSE, newPause);
            joyState.pause = newPause;
        }
        var newFastSpeed = joystick.getButtonDigital(joyPrefs.fastSpeed);
        if (newFastSpeed !== joyState.fastSpeed) {
            consoleControlsSocket.controlStateChanged(controls.FAST_SPEED, newFastSpeed);
            joyState.fastSpeed = newFastSpeed;
        }
        var newSlowSpeed = joystick.getButtonDigital(joyPrefs.slowSpeed);
        if (newSlowSpeed !== joyState.slowSpeed) {
            consoleControlsSocket.controlStateChanged(controls.SLOW_SPEED, newSlowSpeed);
            joyState.slowSpeed = newSlowSpeed;
        }
    };

    var newControllerState = function() {
        return {
            direction: -1,         // CENTER
            button: false, buttonT: false, select: false, reset: false, fastSpeed: false, pause: false,
            xPosition: -1          // PADDLE POSITION
        }
    };

    this.getModeDesc = function() {
        switch (mode) {
            case -1: return "AUTO";
            case 0:  return "AUTO (swapped)";
            default: return !supported ? "NOT SUPPORTED" : "DISABLED";
        }
    };

    this.applyPreferences = function() {
        var p0 = swappedMode ? 1 : 0;
        var p1 = p0 ? 0 : 1;
        joy0Prefs = prefs.joystickGamepads[p0];
        joy0Prefs.player = p1ControlsMode ^ swappedMode? 1 : 0;
        joy1Prefs = prefs.joystickGamepads[p1];
        joy1Prefs.player = p1ControlsMode ^ swappedMode ? 0 : 1;
        joy0Keys = prefs.joystickKeys[p0];
        joy1Keys = prefs.joystickKeys[p1];
    };


    var supported = false;
    var gamepadsDetectionDelay = -1;

    var controls = jt.ConsoleControls;
    var consoleControlsSocket;
    var screen;

    var mode = -1;
    var paddleMode = false;
    var swappedMode = false;
    var p1ControlsMode = false;

    var joystick0;
    var joystick1;
    var joy0State;
    var joy1State;
    var joy0Prefs;
    var joy1Prefs;
    var joy0Keys;
    var joy1Keys;

    var joyButtonDetection = null;

    var prefs = Javatari.userPreferences.current;


    function Joystick(index, prefs) {

        this.index = index;

        this.update = function(gamepads) {
            gamepad = gamepads[index];
            return !!gamepad;
        };

        this.hasMoved = function() {
            var newTime = gamepad.timestamp;
            if (newTime) {
                if (newTime > lastTimestamp) {
                    lastTimestamp = newTime;
                    return true;
                } else
                    return false;
            } else
                return true;        // Always true if the timestamp property is not supported
        };

        this.getButtonDigital = function(butIndex) {
            var b = gamepad.buttons[butIndex];
            if (typeof(b) === "object") return b.pressed || b.value > 0.5;
            else return b > 0.5;
        };

        this.getDPadDirection = function() {
            if (this.getButtonDigital(12)) {
                if (this.getButtonDigital(15)) return 1;                // NORTHEAST
                else if (this.getButtonDigital(14)) return 7;           // NORTHWEST
                else return 0;                                          // NORTH
            } else if (this.getButtonDigital(13)) {
                if (this.getButtonDigital(15)) return 3;                // SOUTHEAST
                else if (this.getButtonDigital(14)) return 5;           // SOUTHWEST
                else return 4;                                          // SOUTH
            } else if (this.getButtonDigital(14)) return 6;             // WEST
            else if (this.getButtonDigital(15)) return 2;               // EAST
            else return -1;                                             // CENTER
        };

        this.getStickDirection = function() {
            var x = gamepad.axes[xAxis];
            var y = gamepad.axes[yAxis];
            if ((x < 0 ? -x : x) < deadzone) x = 0; else x *= xAxisSig;
            if ((y < 0 ? -y : y) < deadzone) y = 0; else y *= yAxisSig;
            if (x === 0 && y === 0) return -1;
            var dir = (1 - Math.atan2(x, y) / Math.PI) / 2;
            dir += 1/16; if (dir >= 1) dir -= 1;
            return (dir * 8) | 0;
        };

        this.getPaddlePosition = function() {
            var pos = (gamepad.axes[paddleAxis] * paddleAxisSig * paddleSens + paddleCenter) | 0;
            if (pos < 0) pos = 0;
            else if (pos > 380) pos = 380;
            return pos;
        };

        var gamepad;

        var xAxis = prefs.xAxis;
        var yAxis = prefs.yAxis;
        var xAxisSig = prefs.xAxisSig;
        var yAxisSig = prefs.yAxisSig;
        var paddleAxis = prefs.paddleAxis;
        var paddleAxisSig = prefs.paddleAxisSig;
        var paddleSens = prefs.paddleSens * -190;
        var paddleCenter = prefs.paddleCenter * -190 + 190 - 5;
        var deadzone = prefs.deadzone;

        var lastTimestamp = Number.MIN_VALUE;

    }

};



// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.DOMTouchControls = function(consoleControls) {
"use strict";

    var self = this;

    this.connect = function(pConsoleControlsSocket) {
        consoleControlsSocket = pConsoleControlsSocket;
    };

    this.connectScreen = function(pScreen) {
        screen = pScreen;
    };

    this.powerOn = function() {
        this.applyPreferences();
        resetStates();
        updateVisuals();
    };

    this.powerOff = function() {
    };

    this.releaseControllers = function() {
        resetStates();
    };

    this.updateConsolePanelSize = function(screenWidth, width, height, isFullscreen, isLandscape) {
        if (!speedControls || !isFullscreen) return;

        var center = !isLandscape && ((screenWidth - width - 10) / 2) < SPEED_CONTROLS_WIDTH;

        speedControls.classList.toggle("jt-center", center);
        if (center) speedControls.style.bottom = "" + (jt.ScreenGUI.BAR_HEIGHT + height + 3) + "px";
        else speedControls.style.removeProperty("bottom");
    };

    this.toggleMode = function() {
        if (!isTouchDevice) {
            screen.showOSD("Touch Controls unavailable. Not a touch device!", true, true);
            return;
        }

        mode++; if (mode > 2) mode = 0;     // AUTO mode not selectable
        resetStates();
        this.applyPreferences();
        updateVisuals();
        screen.showOSD("Touch Controls " + this.getModeDesc(), true);
    };

    this.setP1ControlsMode = function(state) {
        p1ControlsMode = state;
        this.applyPreferences();
    };

    this.getModeDesc = function() {
        switch (mode) {
            case -1: return "AUTO";
            case 0:  return "DISABLED";
            case 1:  return "ENABLED";
            case 2:  return "ENABLED (swapped)";
        }
    };

    this.toggleTouchDirBig = function() {
        dirBig = !dirBig;
        prefs.touch.directionalBig = dirBig;
        Javatari.userPreferences.setDirty();
        updateVisuals();
    };

    this.isDirBig = function() {
        return dirBig;
    };

    this.setupTouchControlsIfNeeded = function(mainElement) {
        if (dirElement || mode <= 0) return;

        speedControls = document.createElement('div');
        speedControls.id = "jt-touch-speed";
        var pause = document.createElement('div');
        pause.id = "jt-touch-pause";
        pause.addEventListener("touchstart", pauseTouchStart);
        speedControls.appendChild(pause);
        var ff = document.createElement('div');
        ff.id = "jt-touch-fast";
        ff.addEventListener("touchstart", fastTouchStart);
        ff.addEventListener("touchend", fastTouchEnd);
        speedControls.appendChild(ff);
        mainElement.appendChild(speedControls);

        var group = document.createElement('div');
        group.id = "jt-touch-left";
        dirElement = createDirectional();
        dirElement.addEventListener("touchstart", dirTouchStart);
        dirElement.addEventListener("touchmove", dirTouchMove);
        dirElement.addEventListener("touchend", dirTouchEnd);
        dirElement.addEventListener("touchcancel", dirTouchEnd);
        group.appendChild(dirElement);
        mainElement.appendChild(group);

        group = document.createElement('div');
        group.id = "jt-touch-right";
        createButton(group, "buttonT");         // Landscape top-down order
        createButton(group, "button");
        mainElement.appendChild(group);

        updateSpeedControls();

        function createDirectional() {
            var elem = document.createElement('div');
            elem.classList.add("jt-touch-dir");
            elem.classList.add("jt-touch-dir-joy");
            createArrowKey("left");
            createArrowKey("right");
            createArrowKey("up");
            createArrowKey("down");
            return elem;

            function createArrowKey(dir) {
                var key = document.createElement('div');
                key.classList.add("jt-touch-dir-" + dir);
                elem.appendChild(key);
                var arr = document.createElement('div');
                arr.classList.add("jt-arrow-" + dir);
                elem.appendChild(arr);
            }
        }

        function createButton(group, name) {
            var but = document.createElement('div');
            but.id = "jt-touch-" + name;
            but.classList.add("jt-touch-button");
            but.classList.add("jt-touch-button-joy");
            but.classList.add("jt-touch-button-joy-" + name);
            but.jtControl = name;
            but.addEventListener("touchstart", buttonTouchStart);
            but.addEventListener("touchmove", jt.Util.blockEvent);
            but.addEventListener("touchend", buttonTouchEnd);
            but.addEventListener("touchcancel", buttonTouchEnd);
            but.addEventListener("mousedown", buttonTouchStart);
            but.addEventListener("mouseup", buttonTouchEnd);
            buttonElements[name] = but;
            group.appendChild(but);
        }
    };

    this.consolePowerAndUserPauseStateUpdate = function(power, paused) {
        consolePower = power;
        consolePaused = paused;
        if (speedControls) updateSpeedControls();
    };

    function updateSpeedControls() {
        speedControls.classList.toggle("jt-poweroff", !consolePower);
        speedControls.classList.toggle("jt-paused", consolePaused);
    }

    function updateVisuals() {
        var active = mode > 0;
        document.documentElement.classList.toggle("jt-touch-active", active);
        document.documentElement.classList.toggle("jt-dir-big", dirBig);
        screen.touchControlsActiveUpdate(active, dirBig);
    }

    function dirTouchStart(e) {
        jt.Util.blockEvent(e);
        if (dirTouchID !== null) return;
        if (dirTouchCenterX === undefined) setDirTouchCenter();

        var touch = e.changedTouches[0];
        dirTouchID = touch.identifier;
        updateDirMovement(touch.pageX, touch.pageY);
    }

    function dirTouchEnd(e) {
        jt.Util.blockEvent(e);
        if (dirTouchID !== null) {
            dirTouchID = null;
            setCurrentDirection(-1);
        }
    }

    function dirTouchMove(e) {
        jt.Util.blockEvent(e);
        if (dirTouchID === null) return;

        var changed = e.changedTouches;
        for (var i = 0; i < changed.length; ++i) {
            if (changed[i].identifier === dirTouchID) {
                updateDirMovement(changed[i].pageX, changed[i].pageY);
                return;
            }
        }
    }

    function updateDirMovement(newX, newY) {
        var dir = -1;
        var x = newX - dirTouchCenterX, y = newY - dirTouchCenterY;
        var dist = Math.sqrt(x*x + y*y);
        if (dist > dirDeadZone) {
            dir = (1 - Math.atan2(x, y) / Math.PI) / 2;
            dir += 1 / 16;
            if (dir >= 1) dir -= 1;
            dir = (dir * 8) | 0;
        }
        setCurrentDirection(dir);
    }

    function setCurrentDirection(newDir) {
        if (dirCurrentDir === newDir) return;

        if (newDir >= 0) consoleControls.hapticFeedback();

        var newUp = false, newRight = false, newDown = false, newLeft = false;
        switch (newDir) {
            case 0: newUp = true; break;
            case 1: newUp = newRight = true; break;
            case 2: newRight = true; break;
            case 3: newDown = newRight = true; break;
            case 4: newDown = true; break;
            case 5: newDown = newLeft = true; break;
            case 6: newLeft = true; break;
            case 7: newUp = newLeft = true; break;
        }
        consoleControls.processKey(joyKeys.up.c, newUp);
        consoleControls.processKey(joyKeys.right.c, newRight);
        consoleControls.processKey(joyKeys.down.c, newDown);
        consoleControls.processKey(joyKeys.left.c, newLeft);

        dirCurrentDir = newDir;
    }

    function setDirTouchCenter() {
        var rec = dirElement.getBoundingClientRect();
        dirDeadZone = ((rec.right - rec.left) * 0.14) | 0;      // 14% deadzone each direction
        dirTouchCenterX = (((rec.left + rec.right) / 2) | 0) + window.pageXOffset;
        dirTouchCenterY = (((rec.top + rec.bottom) / 2) | 0) + window.pageYOffset;
    }

    function buttonTouchStart(e) {
        jt.Util.blockEvent(e);
        processButtonTouch(e.target.jtControl, true);
    }

    function buttonTouchEnd(e) {
        jt.Util.blockEvent(e);
        processButtonTouch(e.target.jtControl, false);
    }

    function processButtonTouch(control, press) {
        if (!control) return;

        if (press) consoleControls.hapticFeedback();
        consoleControls.processKey(joyKeys[control].c, press);
    }

    function pauseTouchStart(e) {
        jt.Util.blockEvent(e);
        consoleControls.hapticFeedback();
        consoleControlsSocket.controlStateChanged(!consolePower ? jt.ConsoleControls.POWER : jt.ConsoleControls.PAUSE, true);
    }

    function fastTouchStart(e) {
        jt.Util.blockEvent(e);
        consoleControls.hapticFeedback();
        consoleControlsSocket.controlStateChanged(consolePaused ? jt.ConsoleControls.FRAME : jt.ConsoleControls.FAST_SPEED, true);
    }

    function fastTouchEnd(e) {
        jt.Util.blockEvent(e);
        if (consolePaused) return;
        consoleControls.hapticFeedback();
        consoleControlsSocket.controlStateChanged(consolePaused ? jt.ConsoleControls.FRAME : jt.ConsoleControls.FAST_SPEED, false);
    }

    function resetStates() {
        joyState.reset();
        dirTouchCenterX = dirTouchCenterY = undefined;
        dirTouchID = null;
        setCurrentDirection(-1);
    }

    this.applyPreferences = function() {
        dirBig = !!prefs.touch.directionalBig;
        var p = mode === 2 ? 1 : 0;
        joyKeys = prefs.joystickKeys[p];
    };


    var consoleControlsSocket;
    var screen;

    var isTouchDevice = jt.Util.isTouchDevice();
    var isMobileDevice = jt.Util.isMobileDevice();
    var mode = Javatari.TOUCH_MODE >= 0 ? Javatari.TOUCH_MODE : isTouchDevice && isMobileDevice ? 1 : 0;            // -1: auto, 0: disabled, 1: enabled, 2: enabled (swapped)
    var p1ControlsMode = false;
    var dirBig = false;

    var dirElement = null, dirTouchID = null, dirTouchCenterX, dirTouchCenterY, dirCurrentDir = -1, dirDeadZone = 0;
    var buttonElements = { };
    var speedControls;

    var joyKeys;
    var joyState = new JoystickState();
    var consolePower = false, consolePaused = false;

    var prefs = Javatari.userPreferences.current;

    var SPEED_CONTROLS_WIDTH = 84;


    function JoystickState() {
        this.reset = function() {
            this.portValue = 0x3f;          // All switches off
        };
        this.reset();
    }


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
        };
    };

    this.loadState = function(s) {
        resetStates();
    };

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.DOMConsoleControls = function(keyForwardControls) {
"use strict";

    var self = this;

    function init() {
        gamepadControls = new jt.GamepadConsoleControls(self);
        touchControls = new jt.DOMTouchControls(self);
        self.applyPreferences();
    }

    this.connect = function(pControlsSocket) {
        consoleControlsSocket = pControlsSocket;
        consoleControlsSocket.connectControls(this);
        gamepadControls.connect(pControlsSocket);
        touchControls.connect(pControlsSocket);
    };

    this.connectPeripherals = function(pScreen) {
        screen = pScreen;
        gamepadControls.connectScreen(pScreen);
        touchControls.connectScreen(pScreen);
    };

    this.addKeyInputElement = function(element) {
        element.addEventListener("keydown", this.keyDown);
        element.addEventListener("keyup", this.keyUp);
    };

    this.setupTouchControlsIfNeeded = function(mainElement) {
        touchControls.setupTouchControlsIfNeeded(mainElement)
    };

    this.powerOn = function() {
        preventIEHelp();
        gamepadControls.powerOn();
        touchControls.powerOn();
        if (PADDLES_MODE === 0) setPaddleMode(false, false);
        else if (PADDLES_MODE === 1) setPaddleMode(true, false);
    };

    this.powerOff = function() {
        setPaddleMode(false, false);
        gamepadControls.powerOff();
        touchControls.powerOff();
    };

    this.releaseControllers = function() {
        for (var c in controlStateMap) if (controlStateMap[c]) {
            consoleControlsSocket.controlStateChanged(c | 0, false);
            controlStateMap[c] = false;
        }
        paddle0MovingLeft = paddle0MovingRight = paddle1MovingLeft = paddle1MovingRight = false;
        turboControlState[controls.JOY0_BUTTON] = turboControlState[controls.JOY1_BUTTON] = false;
        touchControls.releaseControllers();
    };

    this.getTouchControls = function() {
        return touchControls;
    };

    this.toggleP1ControlsMode = function() {
        this.setP1ControlsMode(!p1ControlsMode);
        showModeOSD();
        fireModeStateUpdate();
    };

    this.setP1ControlsMode = function(state) {
        p1ControlsMode = state;
        gamepadControls.setP1ControlsMode(state);
        touchControls.setP1ControlsMode(state);
        this.releaseControllers();
        initKeys();
    };

    this.isP1ControlsMode = function() {
        return p1ControlsMode;
    };

    this.togglePaddleMode = function() {
        setPaddleMode(!paddleMode, true);
        fireModeStateUpdate();
    };

    this.isPaddleMode = function() {
        return paddleMode;
    };

    this.toggleGamepadMode = function() {
        gamepadControls.toggleMode();
        fireModeStateUpdate();
    };

    this.getGamepadModeDesc = function() {
        return gamepadControls.getModeDesc();
    };

    this.toggleTouchControlsMode = function() {
        touchControls.toggleMode();
        fireModeStateUpdate();
    };

    this.toggleTouchDirBig = function() {
        touchControls.toggleTouchDirBig();
    };

    this.toggleTurboFireSpeed = function() {
        setTurboFireSpeed((turboFireSpeed + 1) % 11);
        screen.showOSD("Turbo Fire" + (turboFireSpeed ? " speed: " + this.getTurboFireSpeedDesc() : ": OFF"), true);

        // Persist
        prefs.turboFireSpeed = turboFireSpeed;
        Javatari.userPreferences.setDirty();
        Javatari.userPreferences.save();
    };

    function setTurboFireSpeed(speed) {
        turboFireSpeed = speed;
        turboFireClocks = turboFireSpeed ? (60 / turboFirePerSecond[turboFireSpeed]) | 0 : 0;
        turboFireFlipClock = (turboFireClocks / 2) | 0;
        turboFireClockCount = 0;
    }

    this.getTurboFireSpeedDesc = function() {
        return turboFireSpeed ? turboFireSpeed + "x" : "OFF";
    };

    this.getControlReport = function(control) {
        switch (control) {
            case jt.PeripheralControls.PADDLES_TOGGLE_MODE:
                return { label: paddleMode ? "ON" : "OFF", active: paddleMode };
            case jt.PeripheralControls.TOUCH_TOGGLE_DIR_BIG:
                return { label: touchControls.isDirBig() ? "ON" : "OFF", active: touchControls.isDirBig() };
            case jt.PeripheralControls.HAPTIC_FEEDBACK_TOGGLE_MODE:
                return { label: hapticFeedbackEnabled ? "ON" : "OFF", active: !!hapticFeedbackEnabled };
            case jt.PeripheralControls.TURBO_FIRE_TOGGLE:
                return { label: this.getTurboFireSpeedDesc(), active: !!turboFireSpeed };
        }
        return { label: "Unknown", active: false };
    };

    this.consolePowerAndUserPauseStateUpdate = function(power, paused) {
        touchControls.consolePowerAndUserPauseStateUpdate(power, paused);
    };

    this.keyDown = function(e) {
        return processKeyEvent(e, true);
    };

    this.keyUp = function(e) {
        return processKeyEvent(e, false);
    };

    this.controlsClockPulse = function() {
        // Turbo fire
        if (turboFireClocks) {
            --turboFireClockCount;
            // State flipped?
            if (turboFireClockCount === turboFireFlipClock || turboFireClockCount === 0) {
                var state = turboFireClockCount > 0;
                if (turboControlState[controls.JOY0_BUTTON]) processControl(controls.JOY0_BUTTON, state);
                if (turboControlState[controls.JOY1_BUTTON]) processControl(controls.JOY1_BUTTON, state);
            }
            if (turboFireClockCount <= 0) turboFireClockCount = turboFireClocks;        // restart cycle
        }

        gamepadControls.controlsClockPulse();

        // Update paddles position as time passes
        if (paddleMode) {
            if (paddle0MovingRight) {
                if (!paddle0MovingLeft) {
                    paddle0Position -= paddle0Speed;
                    if (paddle0Position < 0) paddle0Position = 0;
                    consoleControlsSocket.controlValueChanged(controls.PADDLE0_POSITION, paddle0Position);
                }
            } else if (paddle0MovingLeft) {
                paddle0Position += paddle0Speed;
                if (paddle0Position > 380) paddle0Position = 380;
                consoleControlsSocket.controlValueChanged(controls.PADDLE0_POSITION, paddle0Position);
            }
            if (paddle1MovingRight) {
                if (!paddle1MovingLeft) {
                    paddle1Position -= paddle1Speed;
                    if (paddle1Position < 0) paddle1Position = 0;
                    consoleControlsSocket.controlValueChanged(controls.PADDLE1_POSITION, paddle1Position);
                }
            } else if (paddle1MovingLeft) {
                paddle1Position += paddle1Speed;
                if (paddle1Position > 380) paddle1Position = 380;
                consoleControlsSocket.controlValueChanged(controls.PADDLE1_POSITION, paddle1Position);
            }
        }
    };

    this.toggleHapticFeedback = function() {
        if (hapticFeedbackCapable) {
            hapticFeedbackEnabled = !hapticFeedbackEnabled;
            prefs.hapticFeedback = hapticFeedbackEnabled;
            Javatari.userPreferences.setDirty();
        } else
            screen.showOSD("Haptic Feedback not available", true, true);
    };

    this.hapticFeedback = function() {
        if (hapticFeedbackEnabled) navigator.vibrate(8);
    };

    this.hapticFeedbackOnTouch = function(e) {
        if (hapticFeedbackEnabled && (e.type === "touchstart" || e.type === "touchend" || e.type === "touchmove")) navigator.vibrate(8);
    };

    this.cartridgeInserted = function(cartridge) {
        if (!cartridge || PADDLES_MODE >= 0) return;	// Does not interfere if Paddle Mode is forced
        var usePaddles = cartridge.rom.info.p === 1;
        if (paddleMode !== usePaddles) setPaddleMode(usePaddles, false);
    };

    function processKeyEvent(e, press) {
        e.returnValue = false;  // IE
        e.preventDefault();
        e.stopPropagation();

        var code = jt.DOMKeys.codeForKeyboardEvent(e);
        self.processKey(code, press);

        return false;
    }

    this.processKey = function(code, press) {
        // Check Turbo Fire buttons
        var control = turboKeyCodeMap[code];
        if (control) {
            if (press === turboControlState[control]) return;
            if (press) turboFireClockCount = turboFireFlipClock;                    // Ensure correct timing for press/release cycle (TODO affects both controllers!)
            turboControlState[control] = press;
        } else {
            // Normal controls
            control = keyCodeMap[code];
            if (!control) return keyForwardControls.processKey(code, press);        // Next in chain
        }
        processControl(control, press);
    };

    this.applyPreferences = function() {
        initKeys();
        setTurboFireSpeed(prefs.turboFireSpeed);
        touchControls.applyPreferences();
        gamepadControls.applyPreferences();
    };

    function processControl(control, press) {
        // Paddles first
        if (paddleMode) {
            control = translatePaddleModeButtons(control);
            if (tryPaddleControl(control, press)) return;
        }

        // Then other controls
        if (press === controlStateMap[control]) return;

        consoleControlsSocket.controlStateChanged(control, press);
        controlStateMap[control] = press;
    }

    var preventIEHelp = function() {
        window.onhelp = function () {
            return false;
        };
    };

    var translatePaddleModeButtons = function(control) {
        switch (control) {
            case controls.JOY0_BUTTON: return controls.PADDLE0_BUTTON;
            case controls.JOY1_BUTTON: return controls.PADDLE1_BUTTON;
            default: return control;
        }
    };

    var tryPaddleControl = function(control, press) {
        if (press) {
            switch(control) {
                case controls.JOY0_LEFT:
                    paddle0MovingLeft = true; return true;
                case controls.JOY0_RIGHT:
                    paddle0MovingRight = true; return true;
                case controls.JOY0_UP:
                    if (paddle0Speed < 10) paddle0Speed++;
                    screen.showOSD("P1 Paddle speed: " + paddle0Speed, true);
                    return true;
                case controls.JOY0_DOWN:
                    if (paddle0Speed > 1) paddle0Speed--;
                    screen.showOSD("P1 Paddle speed: " + paddle0Speed, true);
                    return true;
                case controls.JOY1_LEFT:
                    paddle1MovingLeft = true; return true;
                case controls.JOY1_RIGHT:
                    paddle1MovingRight = true; return true;
                case controls.JOY1_UP:
                    if (paddle1Speed < 10) paddle1Speed++;
                    screen.showOSD("P2 Paddle speed: " + paddle1Speed, true);
                    return true;
                case controls.JOY1_DOWN:
                    if (paddle1Speed > 1) paddle1Speed--;
                    screen.showOSD("P2 Paddle speed: " + paddle1Speed, true);
                    return true;
            }
        } else {
            switch(control) {
                case controls.JOY0_LEFT:
                    paddle0MovingLeft = false; return true;
                case controls.JOY0_RIGHT:
                    paddle0MovingRight = false; return true;
                case controls.JOY1_LEFT:
                    paddle1MovingLeft = false; return true;
                case controls.JOY1_RIGHT:
                    paddle1MovingRight = false; return true;
            }
        }
        return false;
    };

    var setPaddleMode = function(mode, showOSD) {
        if (paddleMode !== mode) self.releaseControllers();
        paddleMode = mode;
        paddle0Speed = paddle1Speed = 2;
        paddle0Position = paddle1Position = (paddleMode ? 190 : -1);	// -1 = disconnected, won't charge POTs
        consoleControlsSocket.controlValueChanged(controls.PADDLE0_POSITION, paddle0Position);
        consoleControlsSocket.controlValueChanged(controls.PADDLE1_POSITION, paddle1Position);
        gamepadControls.setPaddleMode(paddleMode);
        if (showOSD) showModeOSD();
    };

    var showModeOSD = function() {
        screen.showOSD("Controllers: " + (paddleMode ? "Paddles" : "Joysticks") + (p1ControlsMode ? ", Swapped" : ""), true);
    };

    function fireModeStateUpdate() {
        screen.controlsModeStateUpdate();
    }

    var initKeys = function() {
        var k = jt.DOMKeys;

        keyCodeMap = {};
        turboKeyCodeMap = {};

        // Fixed keys

        keyCodeMap[KEY_POWER]                   = controls.POWER;
        keyCodeMap[KEY_POWER | k.ALT]           = controls.POWER;

        keyCodeMap[KEY_POWER | k.SHIFT]         = controls.POWER_FRY;
        keyCodeMap[KEY_POWER | k.SHIFT | k.ALT] = controls.POWER_FRY;

        keyCodeMap[KEY_BW]                      = controls.BLACK_WHITE;
        keyCodeMap[KEY_BW | k.ALT]              = controls.BLACK_WHITE;

        keyCodeMap[KEY_SELECT]                  = controls.SELECT;
        keyCodeMap[KEY_SELECT | k.ALT]          = controls.SELECT;

        keyCodeMap[KEY_RESET]                   = controls.RESET;
        keyCodeMap[KEY_RESET | k.ALT]           = controls.RESET;

        keyCodeMap[KEY_DIFF_0]                  = controls.DIFFICULTY0;
        keyCodeMap[KEY_DIFF_0 | k.ALT]          = controls.DIFFICULTY0;

        keyCodeMap[KEY_DIFF_1]                  = controls.DIFFICULTY1;
        keyCodeMap[KEY_DIFF_1 | k.ALT]          = controls.DIFFICULTY1;

        keyCodeMap[KEY_SPEED]                   = controls.FAST_SPEED;
        keyCodeMap[KEY_SPEED | k.ALT]           = controls.FAST_SPEED;
        keyCodeMap[KEY_SPEED | k.SHIFT]         = controls.SLOW_SPEED;
        keyCodeMap[KEY_SPEED | k.SHIFT | k.ALT] = controls.SLOW_SPEED;

        keyCodeMap[KEY_INC_SPEED | k.SHIFT | k.ALT]    = controls.INC_SPEED;
        keyCodeMap[KEY_DEC_SPEED | k.SHIFT | k.ALT]    = controls.DEC_SPEED;
        keyCodeMap[KEY_NORMAL_SPEED | k.SHIFT | k.ALT] = controls.NORMAL_SPEED;
        keyCodeMap[KEY_MIN_SPEED | k.SHIFT | k.ALT]    = controls.MIN_SPEED;

        keyCodeMap[KEY_PAUSE | k.ALT]           = controls.PAUSE;
        keyCodeMap[KEY_PAUSE | k.SHIFT | k.ALT] = controls.PAUSE_AUDIO_ON;
        keyCodeMap[KEY_FRAME | k.ALT]           = controls.FRAME;
        keyCodeMap[KEY_FRAMEa | k.ALT]          = controls.FRAME;
        keyCodeMap[KEY_TRACE | k.ALT]           = controls.TRACE;
        keyCodeMap[KEY_INFO | k.ALT]            = controls.SHOW_INFO;
        keyCodeMap[KEY_DEBUG | k.ALT]           = controls.DEBUG;
        keyCodeMap[KEY_NO_COLLISIONS | k.ALT]   = controls.NO_COLLISIONS;
        keyCodeMap[KEY_VIDEO_STANDARD | k.ALT]  = controls.VIDEO_STANDARD;
        keyCodeMap[KEY_VIDEO_STANDARD2 | k.ALT] = controls.VIDEO_STANDARD;
        keyCodeMap[KEY_VSYNCH | k.ALT]          = controls.VSYNCH;

        keyCodeMap[KEY_STATE_0 | k.CONTROL]           = controls.SAVE_STATE_0;
        keyCodeMap[KEY_STATE_0a | k.CONTROL]          = controls.SAVE_STATE_0;
        keyCodeMap[KEY_STATE_0 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_0;
        keyCodeMap[KEY_STATE_0a | k.CONTROL | k.ALT]  = controls.SAVE_STATE_0;
        keyCodeMap[KEY_STATE_1 | k.CONTROL]           = controls.SAVE_STATE_1;
        keyCodeMap[KEY_STATE_1 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_1;
        keyCodeMap[KEY_STATE_2 | k.CONTROL]           = controls.SAVE_STATE_2;
        keyCodeMap[KEY_STATE_2 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_2;
        keyCodeMap[KEY_STATE_3 | k.CONTROL]           = controls.SAVE_STATE_3;
        keyCodeMap[KEY_STATE_3 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_3;
        keyCodeMap[KEY_STATE_4 | k.CONTROL]           = controls.SAVE_STATE_4;
        keyCodeMap[KEY_STATE_4 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_4;
        keyCodeMap[KEY_STATE_5 | k.CONTROL]           = controls.SAVE_STATE_5;
        keyCodeMap[KEY_STATE_5 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_5;
        keyCodeMap[KEY_STATE_6 | k.CONTROL]           = controls.SAVE_STATE_6;
        keyCodeMap[KEY_STATE_6 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_6;
        keyCodeMap[KEY_STATE_7 | k.CONTROL]           = controls.SAVE_STATE_7;
        keyCodeMap[KEY_STATE_7 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_7;
        keyCodeMap[KEY_STATE_8 | k.CONTROL]           = controls.SAVE_STATE_8;
        keyCodeMap[KEY_STATE_8 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_8;
        keyCodeMap[KEY_STATE_9 | k.CONTROL]           = controls.SAVE_STATE_9;
        keyCodeMap[KEY_STATE_9 | k.CONTROL | k.ALT]   = controls.SAVE_STATE_9;
        keyCodeMap[KEY_STATE_10 | k.CONTROL]          = controls.SAVE_STATE_10;
        keyCodeMap[KEY_STATE_10 | k.CONTROL | k.ALT]  = controls.SAVE_STATE_10;
        keyCodeMap[KEY_STATE_11 | k.CONTROL]          = controls.SAVE_STATE_11;
        keyCodeMap[KEY_STATE_11a | k.CONTROL]         = controls.SAVE_STATE_11;
        keyCodeMap[KEY_STATE_11 | k.CONTROL | k.ALT]  = controls.SAVE_STATE_11;
        keyCodeMap[KEY_STATE_11a | k.CONTROL | k.ALT] = controls.SAVE_STATE_11;
        keyCodeMap[KEY_STATE_12 | k.CONTROL]          = controls.SAVE_STATE_12;
        keyCodeMap[KEY_STATE_12a | k.CONTROL]         = controls.SAVE_STATE_12;
        keyCodeMap[KEY_STATE_12 | k.CONTROL | k.ALT]  = controls.SAVE_STATE_12;
        keyCodeMap[KEY_STATE_12a | k.CONTROL | k.ALT] = controls.SAVE_STATE_12;

        keyCodeMap[KEY_STATE_0 | k.ALT]   = controls.LOAD_STATE_0;
        keyCodeMap[KEY_STATE_0a | k.ALT]  = controls.LOAD_STATE_0;
        keyCodeMap[KEY_STATE_1 | k.ALT]   = controls.LOAD_STATE_1;
        keyCodeMap[KEY_STATE_2 | k.ALT]   = controls.LOAD_STATE_2;
        keyCodeMap[KEY_STATE_3 | k.ALT]   = controls.LOAD_STATE_3;
        keyCodeMap[KEY_STATE_4 | k.ALT]   = controls.LOAD_STATE_4;
        keyCodeMap[KEY_STATE_5 | k.ALT]   = controls.LOAD_STATE_5;
        keyCodeMap[KEY_STATE_6 | k.ALT]   = controls.LOAD_STATE_6;
        keyCodeMap[KEY_STATE_7 | k.ALT]   = controls.LOAD_STATE_7;
        keyCodeMap[KEY_STATE_8 | k.ALT]   = controls.LOAD_STATE_8;
        keyCodeMap[KEY_STATE_9 | k.ALT]   = controls.LOAD_STATE_9;
        keyCodeMap[KEY_STATE_10 | k.ALT]  = controls.LOAD_STATE_10;
        keyCodeMap[KEY_STATE_11 | k.ALT]  = controls.LOAD_STATE_11;
        keyCodeMap[KEY_STATE_11a | k.ALT] = controls.LOAD_STATE_11;
        keyCodeMap[KEY_STATE_12 | k.ALT]  = controls.LOAD_STATE_12;
        keyCodeMap[KEY_STATE_12a | k.ALT] = controls.LOAD_STATE_12;

        // Configurable in preferences

        var a = p1ControlsMode ? 1 : 0;
        var b = p1ControlsMode ? 0 : 1;

        keyCodeMap[prefs.joystickKeys[a].left.c] = controls.JOY0_LEFT;
        keyCodeMap[prefs.joystickKeys[a].up.c] = controls.JOY0_UP;
        keyCodeMap[prefs.joystickKeys[a].right.c] = controls.JOY0_RIGHT;
        keyCodeMap[prefs.joystickKeys[a].down.c] = controls.JOY0_DOWN;
        keyCodeMap[prefs.joystickKeys[a].button.c] = controls.JOY0_BUTTON;
        keyCodeMap[prefs.joystickKeys[b].left.c] = controls.JOY1_LEFT;
        keyCodeMap[prefs.joystickKeys[b].up.c] = controls.JOY1_UP;
        keyCodeMap[prefs.joystickKeys[b].right.c] = controls.JOY1_RIGHT;
        keyCodeMap[prefs.joystickKeys[b].down.c] = controls.JOY1_DOWN;
        keyCodeMap[prefs.joystickKeys[b].button.c] = controls.JOY1_BUTTON;

        turboKeyCodeMap[prefs.joystickKeys[a].buttonT.c] = controls.JOY0_BUTTON;
        turboKeyCodeMap[prefs.joystickKeys[b].buttonT.c] = controls.JOY1_BUTTON;
    };


    var controls = jt.ConsoleControls;

    var consoleControlsSocket;
    var screen;

    var keyCodeMap;
    var turboKeyCodeMap;

    var controlStateMap =  {};
    var turboControlState = {};

    var prefs = Javatari.userPreferences.current;

    var p1ControlsMode = false;
    var paddleMode = false;

    var hapticFeedbackCapable = !!navigator.vibrate;
    var hapticFeedbackEnabled = hapticFeedbackCapable && !!prefs.hapticFeedback;

    var turboFireSpeed = 0, turboFireClocks = 0, turboFireClockCount = 0, turboFireFlipClock = 0;
    var turboFirePerSecond = [ 0, 1, 2, 2.4, 3, 4, 5, 6, 7.5, 10, 12 ];

    var paddle0Position = 0;			// 380 = LEFT, 190 = MIDDLE, 0 = RIGHT
    var paddle0Speed = 3;				// 1 to 10
    var paddle0MovingLeft = false;
    var paddle0MovingRight = false;
    var paddle1Position = 0;
    var paddle1Speed = 3;
    var paddle1MovingLeft = false;
    var paddle1MovingRight = false;

    var gamepadControls;
    var touchControls;

    var PADDLES_MODE = Javatari.PADDLES_MODE;


    // Default Key Values

    var KEY_POWER            = jt.DOMKeys.VK_F1.c;
    var KEY_BW               = jt.DOMKeys.VK_F2.c;
    var KEY_SELECT           = jt.DOMKeys.VK_F11.c;
    var KEY_RESET            = jt.DOMKeys.VK_F12.c;

    var KEY_DIFF_0           = jt.DOMKeys.VK_F4.c;
    var KEY_DIFF_1           = jt.DOMKeys.VK_F9.c;

    var KEY_SPEED            = jt.DOMKeys.VK_TAB.c;

    var KEY_INC_SPEED        = jt.DOMKeys.VK_UP.c;
    var KEY_DEC_SPEED        = jt.DOMKeys.VK_DOWN.c;
    var KEY_NORMAL_SPEED     = jt.DOMKeys.VK_RIGHT.c;
    var KEY_MIN_SPEED        = jt.DOMKeys.VK_LEFT.c;

    var KEY_PAUSE            = jt.DOMKeys.VK_P.c;
    var KEY_FRAME            = jt.DOMKeys.VK_O.c;
    var KEY_FRAMEa           = jt.DOMKeys.VK_F.c;

    var KEY_DEBUG            = jt.DOMKeys.VK_D.c;
    var KEY_TRACE            = jt.DOMKeys.VK_VOID;
    var KEY_INFO             = jt.DOMKeys.VK_I.c;
    var KEY_NO_COLLISIONS    = jt.DOMKeys.VK_C.c;
    var KEY_VIDEO_STANDARD   = jt.DOMKeys.VK_V.c;
    var KEY_VIDEO_STANDARD2  = jt.DOMKeys.VK_Q.c;
    var KEY_VSYNCH           = jt.DOMKeys.VK_W.c;

    var KEY_STATE_0          = jt.DOMKeys.VK_QUOTE.c;
    var KEY_STATE_0a         = jt.DOMKeys.VK_BACKQUOTE.c;
    var KEY_STATE_1          = jt.DOMKeys.VK_1.c;
    var KEY_STATE_2          = jt.DOMKeys.VK_2.c;
    var KEY_STATE_3          = jt.DOMKeys.VK_3.c;
    var KEY_STATE_4          = jt.DOMKeys.VK_4.c;
    var KEY_STATE_5          = jt.DOMKeys.VK_5.c;
    var KEY_STATE_6          = jt.DOMKeys.VK_6.c;
    var KEY_STATE_7          = jt.DOMKeys.VK_7.c;
    var KEY_STATE_8          = jt.DOMKeys.VK_8.c;
    var KEY_STATE_9          = jt.DOMKeys.VK_9.c;
    var KEY_STATE_10         = jt.DOMKeys.VK_0.c;
    var KEY_STATE_11         = jt.DOMKeys.VK_MINUS.c;
    var KEY_STATE_11a        = jt.DOMKeys.VK_FF_MINUS.c;
    var KEY_STATE_12         = jt.DOMKeys.VK_EQUALS.c;
    var KEY_STATE_12a        = jt.DOMKeys.VK_FF_EQUALS.c;


    init();

    jt.DOMConsoleControls.hapticFeedback = this.hapticFeedback;
    jt.DOMConsoleControls.hapticFeedbackOnTouch = this.hapticFeedbackOnTouch;

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.ScreenGUI = jt.Util.isMobileDevice()
    ? {
        BAR_HEIGHT: 29,
        BAR_MENU_WIDTH: 150,
        BAR_MENU_ITEM_HEIGHT: 33,
        BAR_MENU_ITEM_FONT_SIZE: 14,
        LOGO_SCREEN_WIDTH: 618,
        LOGO_SCREEN_HEIGHT: 455,
        TOUCH_CONTROLS_LEFT_WIDTH: 119,
        TOUCH_CONTROLS_LEFT_WIDTH_BIG: 143,
        TOUCH_CONTROLS_RIGHT_WIDTH: 80
    }
    : {
        BAR_HEIGHT: 29,
        BAR_MENU_WIDTH: 140,
        BAR_MENU_ITEM_HEIGHT: 29,
        BAR_MENU_ITEM_FONT_SIZE: 13,
        LOGO_SCREEN_WIDTH: 618,
        LOGO_SCREEN_HEIGHT: 455,
        TOUCH_CONTROLS_LEFT_WIDTH: 119,
        TOUCH_CONTROLS_LEFT_WIDTH_BIG: 143,
        TOUCH_CONTROLS_RIGHT_WIDTH: 80
    };

jt.ScreenGUI.html = function() {
    return '<div id="jt-screen-fs" tabindex="0"> <div id="jt-screen-fs-center" tabindex="-1"> <div id="jt-screen-canvas-outer"> <canvas id="jt-screen-canvas" tabindex="-1"></canvas> <img id="jt-canvas-loading-icon" draggable="false" src="' + jt.Images.urls.loading + '"> <div id="jt-logo"> <div id="jt-logo-center"> <img id="jt-logo-loading-icon" draggable="false" src="' + jt.Images.urls.loading + '"> <img id="jt-logo-image" draggable="false" src="' + jt.Images.urls.logo + '"> <div id="jt-logo-message"> <div id="jt-logo-message-text"></div> <div id="jt-logo-message-ok"> <div id="jt-logo-message-ok-text"></div> </div> </div> </div> </div> <div id="jt-osd"></div> </div> <div id="jt-bar"> <div id="jt-bar-inner"></div> </div> <div id="jt-console-panel" class="jt-console-panel" tabindex="-1"> </div> </div> <div id="jt-screen-scroll-message"> Swipe up/down on the Screen <br>to hide the browser bars! </div> </div>';
};

jt.ScreenGUI.htmlConsolePanel = '<div id="jt-console-panel-p0-diff-label" class="jt-console-panel-p0-diff-label jt-console-panel-icon"></div> <div id="jt-console-panel-p1-diff-label" class="jt-console-panel-p1-diff-label jt-console-panel-icon"></div> <div id="jt-console-panel-power-labels" class="jt-console-panel-power-labels jt-console-panel-icon"></div> <div id="jt-console-panel-reset-labels" class="jt-console-panel-reset-labels jt-console-panel-icon"></div> <div id="jt-console-panel-power" class="jt-console-panel-power jt-console-panel-lever"></div> <div id="jt-console-panel-color" class="jt-console-panel-color jt-console-panel-lever"></div> <div id="jt-console-panel-select" class="jt-console-panel-select jt-console-panel-lever"></div> <div id="jt-console-panel-reset" class="jt-console-panel-reset jt-console-panel-lever"></div> <div id="jt-console-panel-p0-diff" class="jt-console-panel-p0-diff jt-console-panel-switch"></div> <div id="jt-console-panel-p1-diff" class="jt-console-panel-p1-diff jt-console-panel-switch"></div> <div id="jt-console-panel-cart-image" class="jt-console-panel-cart-image"></div> <div id="jt-console-panel-cart-load" class="jt-console-panel-cart-load"></div> <div id="jt-console-panel-cart-file" class="jt-console-panel-cart-file jt-console-panel-icon"></div> <div id="jt-console-panel-cart-url" class="jt-console-panel-cart-url jt-console-panel-icon"></div> <div id="jt-console-panel-cart-label" class="jt-console-panel-cart-label"></div>' ;

jt.ScreenGUI.css = function() {
    return 'html.jt-full-screen-scroll-hack body { position: absolute; width: 100%; height: ' + Math.max(1280, (Math.max(screen.width, screen.height) * 1.4) | 0) + 'px; top: 0; left: 0; margin: 0; padding: 0; border: none; overflow-x: hidden; overflow-y: auto; } #jt-screen-fs, #jt-screen-fs div, #jt-screen-fs canvas { outline: none; } #' + Javatari.SCREEN_ELEMENT_ID + ' { display: inline-block; visibility: hidden; font-family: sans-serif; font-weight: normal; margin: 0; padding: 0; border: 1px solid black; background: black; overflow: visible; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-touch-callout: none; touch-callout: none; -webkit-tap-highlight-color: transparent; tap-highlight-color: transparent; -webkit-text-size-adjust: none; -moz-text-size-adjust: none; text-size-adjust: none; } html.jt-full-screen #' + Javatari.SCREEN_ELEMENT_ID + ' { display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; box-shadow: none; z-index: 2147483646;    /* one behind fsElement */ } html.jt-started #' + Javatari.SCREEN_ELEMENT_ID + ' { visibility: visible; } #jt-screen-scroll-message { position: absolute; bottom: 150%; left: 50%; height: 0; width: 0; margin: 0; padding: 0; font-size: 16px; line-height: 28px; white-space: nowrap; color: hsl(0, 0%, 4%); background: hsl(0, 0%, 92%); border-radius: 15px; transform: translate(-50%, 0); box-shadow: 2px 2px 9px rgba(0, 0, 0, 0.7); transition: all 1.7s step-end, opacity 1.6s linear; overflow: hidden; opacity: 0; z-index: -1; } html.jt-full-screen-scroll-hack #jt-screen-fs.jt-scroll-message #jt-screen-scroll-message { opacity: 1; bottom: 23%; width: 215px; height: 56px; padding: 13px 20px; z-index: 60; transition: none; } #jt-screen-fs { position: relative; background: black; text-align: center; -webkit-tap-highlight-color: rgba(0,0,0,0); tap-highlight-color: rgba(0,0,0,0) } html.jt-full-screen #jt-screen-fs { position: absolute; width: 100%; height: 100%; left: 0; bottom: 0; right: 0; z-index: 2147483647; } html.jt-full-screen-scroll-hack #jt-screen-fs { position: fixed; bottom: 0; height: 100vh; } html.jt-full-screen #jt-screen-fs-center {      /* Used to center and move things horizontally in Landscape Full Screen */ position: absolute; top: 0; bottom: 0; left: 0; right: 0; } #jt-screen-canvas-outer { display: inline-block; position: relative; overflow: hidden; vertical-align: top; line-height: 1px; z-index: 3; } #jt-screen-canvas { display: block; } #jt-bar { position: relative; left: 0; right: 0; height: ' + this.BAR_HEIGHT + 'px; margin: 0 auto; border-top: 1px solid black; background: hsl(0, 0%, 16%); overflow: visible;                    /* for the Menu to show through */ box-sizing: content-box; z-index: 40; } #jt-bar-inner { position: absolute; overflow: hidden; top: 0; bottom: 0; left: 0; right: 0; text-align: left; } html.jt-bar-auto-hide #jt-bar, html.jt-full-screen #jt-bar { position: absolute; bottom: 0; transition: height 0.08s ease-in-out; } html.jt-bar-auto-hide #jt-bar.jt-hidden { transition: height 0.5s ease-in-out; height: 0; bottom: -1px; } @media only screen and (orientation: landscape) { html.jt-full-screen #jt-bar.jt-hidden { transition: height 0.5s ease-in-out; height: 0; bottom: -1px; } } #jt-bar.jt-narrow .jt-narrow-hidden { display: none; } .jt-bar-button { display: inline-block; width: 24px; height: 28px; margin: 0 1px; background-image: url("' + jt.Images.urls.iconSprites + '"); background-repeat: no-repeat; background-size: 264px 82px; cursor: pointer; } /* .jt-bar-button { border: 1px solid yellow; background-origin: border-box; box-sizing: border-box; } */ #jt-bar-power { margin: 0 8px 0 6px; } #jt-bar-select { margin: 0 2px; width: 50px; } #jt-bar-reset { margin: 0 2px; width: 50px; } html.jt-console-panel-active #jt-bar-select, html.jt-console-panel-active #jt-bar-reset { display: none; } #jt-bar-settings, #jt-bar-full-screen, #jt-bar-scale-plus, #jt-bar-scale-minus { float: right; margin: 0; } #jt-bar-settings { margin-right: 5px; } #jt-bar-full-screen.jt-mobile { margin: 0 6px; } #jt-bar-scale-plus { width: 21px; } #jt-bar-scale-minus { width: 18px; } #jt-bar-text { float: right; width: 32px; } #jt-bar-text.jt-mobile { margin: 0 0 0 6px; } #jt-bar-console-panel { position: absolute; left: 2px; right: 0; width: 39px; margin: 0 auto; } #jt-bar.jt-narrow #jt-bar-console-panel { position: static; float: right; margin-right: 3px; } #jt-bar-logo { position: absolute; left: 0; right: 0; width: 34px; margin: 0 auto; } html:not(.jt-console-panel-active) #jt-bar.jt-narrow #jt-bar-logo { display: none; } #jt-bar-menu { position: absolute; display: none; bottom: ' + this.BAR_HEIGHT + 'px; font-size: ' + this.BAR_MENU_ITEM_FONT_SIZE + 'px; line-height: 1px; overflow: hidden; transform-origin: bottom center; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } #jt-bar-menu-inner { display: inline-block; padding-bottom: 2px; border: 1px solid black; background: hsl(0, 0%, 16%); } .jt-bar-menu-item, #jt-bar-menu-title { position: relative; display: none; width: ' + this.BAR_MENU_WIDTH + 'px; height: ' + this.BAR_MENU_ITEM_HEIGHT + 'px; color: rgb(205, 205, 205); border: none; padding: 0; line-height: ' + this.BAR_MENU_ITEM_HEIGHT + 'px; text-shadow: 1px 1px 1px black; background: transparent; outline: none; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; cursor: pointer; box-sizing: border-box; } #jt-bar-menu-title { display: block; color: white; font-weight: bold; border-bottom: 1px solid black; margin-bottom: 1px; text-align: center; background: rgb(70, 70, 70); cursor: auto; } .jt-bar-menu-item.jt-hover:not(.jt-bar-menu-item-disabled):not(.jt-bar-menu-item-divider) { color: white; background: hsl(358, 67%, 46%); } .jt-bar-menu-item-disabled { color: rgb(110, 110, 110); } .jt-bar-menu-item-divider { height: 1px; margin: 1px 0; background: black; } .jt-bar-menu-item-toggle { text-align: left; padding-left: 30px; } .jt-bar-menu-item-toggle::after { content: ""; position: absolute; width: 6px; height: 19px; top: ' + (((this.BAR_MENU_ITEM_HEIGHT - 21) / 2) | 0) + 'px; left: 10px; background: rgb(70, 70, 70); box-shadow: black 1px 1px 1px; } .jt-bar-menu-item-toggle.jt-bar-menu-item-toggle-checked { color: white; } .jt-bar-menu-item-toggle.jt-bar-menu-item-toggle-checked::after { background: rgb(248, 33, 28); } #jt-console-panel { display: none; position: absolute; bottom: -' + (jt.ConsolePanel.DEFAULT_HEIGHT + 2) + 'px; left: 50%; transform: translate(-50%, 0); transform-origin: center top; margin: 0 auto; border: 1px solid black; z-index: 30; } html.jt-console-panel-active #jt-console-panel { display: block; } html.jt-full-screen #jt-console-panel { bottom: ' + (jt.ScreenGUI.BAR_HEIGHT + 2) + 'px; border: none; transform-origin: center bottom; } #jt-screen-fs .jt-select-dialog { position: absolute; overflow: hidden; display: none; top: 0; bottom: 0; left: 0; right: 0; width: 540px; max-width: 92%; height: 297px; margin: auto; color: white; font-size: 18px; line-height: 21px; background: hsl(0, 0%, 16%); padding: 11px 0 0; text-align: center; border: 1px solid black; box-sizing: initial; text-shadow: 1px 1px 1px black; box-shadow: 3px 3px 15px 2px rgba(0, 0, 0, .4); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; cursor: auto; z-index: 50; } #jt-screen-fs .jt-select-dialog.jt-show { display: block; } #jt-screen-fs .jt-select-dialog .jt-footer { position: absolute; width: 100%; bottom: 7px; font-size: 13px; text-align: center; color: rgb(170, 170, 170); } #jt-screen-fs .jt-select-dialog ul { position: relative; width: 88%; top: 5px; margin: auto; padding: 0; list-style: none; font-size: 14px; color: hsl(0, 0%, 88%); } #jt-screen-fs .jt-select-dialog li { display: none; position: relative; overflow: hidden; height: 26px; background: rgb(70, 70, 70); margin: 7px 0; padding: 11px 10px 0 18px;       /* Space on the left for the toggle mark for all lines */ line-height: 0; text-align: left; text-overflow: ellipsis; border: 2px dashed transparent; box-shadow: 1px 1px 1px rgba(0, 0, 0, .5); white-space: nowrap; box-sizing: border-box; cursor: pointer; } #jt-screen-fs .jt-select-dialog li.jt-visible { display: block; } #jt-screen-fs .jt-select-dialog li.jt-selected { color: white; background: hsl(358, 67%, 46%); } #jt-screen-fs .jt-select-dialog li.jt-droptarget { color: white; border-color: lightgray; } #jt-screen-fs .jt-select-dialog li.jt-toggle::after { content: ""; position: absolute; width: 6px; height: 17px; top: 2px; left: 6px; background: rgb(60, 60, 60); box-shadow: black 1px 1px 1px; } #jt-screen-fs .jt-select-dialog li.jt-toggle-checked::after { background: rgb(248, 33, 28); } #jt-logo { position: absolute; display: none; top: 0; bottom: 0; left: 0; right: 0; background: black; } #jt-logo.jt-show { display: block; } #jt-logo-center { position: absolute; top: 50%; left: 50%; width: 598px; height: 456px; transform: translate(-50%, -50%); } #jt-logo-image { position: absolute; top: 50%; left: 50%; width: 335px; max-width: 57%; transform: translate(-50%, -50%); -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } #jt-screen-fs.jt-logo-message-active #jt-logo-image { top: 128px; width: 37%; max-width: initial; } #jt-logo-loading-icon, #jt-canvas-loading-icon { display: none; position: absolute; top: 79%; left: 0; right: 0; width: 14%; height: 3%; margin: 0 auto; background-color: rgba(0, 0, 0, .8); border: solid transparent; border-width: 8px 30px; border-radius: 3px; box-sizing: content-box; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } #jt-screen-fs.jt-logo-message-active #jt-logo-loading-icon { top: 204px; } #jt-logo-message { display: none; position: absolute; top: 226px; width: 100%; color: hsl(0, 0%, 97%); font-size: 29px; line-height: 34px; } #jt-screen-fs.jt-logo-message-active #jt-logo-message { display: block; } #jt-logo-message-ok { display: block; position: absolute; top: 91px; left: 193px; width: 214px; height: 130px; } #jt-logo-message-ok.jt-higher { top: 74px; } #jt-logo-message-ok-text { position: absolute; top: 49%; left: 50%; width: 120px; height: 47px; font-size: 23px; line-height: 47px; background: hsl(358, 67%, 46%); border-radius: 6px; color: white; transform: translate(-50%, -50%); } #jt-osd { position: absolute; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; top: -29px; right: 16px; height: 29px; padding: 0 12px; margin: 0; font-weight: bold; font-size: 15px; line-height: 29px; color: rgb(0, 255, 0); background: rgba(0, 0, 0, 0.7); transform-origin: top right; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; opacity: 0; } .jt-arrow-up, .jt-arrow-down, .jt-arrow-left, .jt-arrow-right { border: 0px solid transparent; box-sizing: border-box; } .jt-arrow-up    { border-bottom-color: inherit; } .jt-arrow-down  { border-top-color: inherit; } .jt-arrow-left  { border-right-color: inherit; } .jt-arrow-right { border-left-color: inherit; } .jt-quick-options-list { margin-top: 12px; padding: 0; list-style: none; color: hsl(0, 0%, 88%); } .jt-quick-options-list li { margin-top: 8px; line-height: 1px; text-align: left; } .jt-quick-options-list li div { display: inline-block; overflow: hidden; height: 26px; font-size: 14px; line-height: 26px; text-overflow: ellipsis; white-space: nowrap; box-sizing: border-box; } .jt-quick-options-list .jt-control { float: right; width: 86px; font-size: 15px; line-height: 25px; color: hsl(0, 0%, 70%); background: black; text-align: center; cursor: pointer; } .jt-quick-options-list .jt-control.jt-selected { color: white; background: hsl(358, 67%, 46%); box-shadow: 1px 1px 1px rgba(0, 0, 0, .5); } .jt-quick-options-list .jt-control.jt-selected.jt-inactive { line-height: 21px; border: 2px dashed hsl(358, 67%, 46%); background: black; } #jt-quick-options { display: none; position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 233px; height: 310px; margin: auto; padding: 11px 14px 0; color: white; font-size: 18px; line-height: 22px; background: hsl(0, 0%, 16%); text-align: center; border: 1px solid black; box-sizing: initial; text-shadow: 1px 1px 1px black; box-shadow: 3px 3px 15px 2px rgba(0, 0, 0, .4); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; cursor: auto; z-index: 50; } #jt-quick-options.jt-show { display: block; } #jt-quick-options::before { content: "Quick Options"; display: block; } #jt-touch-left, #jt-touch-right, #jt-touch-speed { display: none; position: absolute; z-index: 1; } html.jt-full-screen.jt-touch-active #jt-touch-left, html.jt-full-screen.jt-touch-active #jt-touch-right, html.jt-full-screen.jt-touch-active #jt-touch-speed { display: block; } .jt-touch-dir { width: 130px; height: 130px; color: hsl(0, 0%, 75%); border-radius: 100%; } .jt-touch-dir::before { content: ""; position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px; border: 1px solid hsl(0, 0%, 26%); border-radius: 100%; } .jt-touch-dir-joy .jt-touch-dir-up, .jt-touch-dir-joy .jt-touch-dir-left { position: absolute; background: hsl(0, 0%, 31%); border-radius: 2px 2px 0 0; box-shadow: inset 1px 2px 0px hsl(0, 0%, 43%), inset -1px -1px hsl(0, 0%, 19%), 0 3px 0 1px hsl(0, 0%, 21%); } .jt-touch-dir-joy .jt-touch-dir-up { width: 26px; height: 78px; top: 24px; left: 52px; } .jt-touch-dir-joy .jt-touch-dir-left { width: 78px; height: 25px; top: 51px; left: 26px; } .jt-touch-dir-joy .jt-touch-dir-left::before { content: ""; position: absolute; top: 2px; left: 23px; width: 33px; height: 22px; background: inherit; z-index: 1; } .jt-touch-dir-joy .jt-touch-dir-left::after { content: ""; position: absolute; top: 4px; left: 30px; height: 17px; width: 17px; border-radius: 100%; box-shadow:  inset 0 0 2px hsl(0, 0%, 22%), inset 1px 2px 3px 1px hsl(0, 0%, 26%), inset -1px -2px 1px hsl(0, 0%, 64%); z-index: 2; } .jt-touch-dir .jt-arrow-up, .jt-touch-dir .jt-arrow-down, .jt-touch-dir .jt-arrow-left, .jt-touch-dir .jt-arrow-right { position: absolute; border-width: 5px; z-index: 2; } .jt-touch-dir .jt-arrow-up { top: 26px; left: 60px; border-bottom-width: 11px; } .jt-touch-dir .jt-arrow-down { bottom: 29px; left: 60px; border-top-width: 11px; } .jt-touch-dir .jt-arrow-left { top: 58px; left: 26px; border-right-width: 11px; } .jt-touch-dir .jt-arrow-right { top: 58px; right: 26px; border-left-width: 11px; } .jt-touch-button { position: relative; display: block; width: 72px; height: 72px; font-size: 20px; line-height: 67px; color: hsl(0, 0%, 79%); border-radius: 100%; cursor: default; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; z-index: 0; } .jt-touch-button::before { content: ""; position: absolute; box-sizing: border-box; z-index: -1; } .jt-touch-button-joy::before, .jt-touch-button-none::before { width: 50px; height: 48px; top: 9px; left: 11px; border-radius: 100%; } #jt-screen-fs.jt-touch-config-active .jt-touch-button-none::before { border: 2px solid hsl(0, 0%, 30%); } .jt-touch-button-joy.jt-touch-button-joy-button::before { border: none; background: hsl(1, 70%, 37%); box-shadow: inset -2px -7px 3px 1px hsl(1, 68%, 43%), inset 0px 0px 1px 9px hsl(1, 72%, 33%), 0px -1px 0px 1px hsl(1, 70%, 47%), 0px 1px 0px 2px hsl(1, 70%, 29%); } .jt-touch-button-joy.jt-touch-button-joy-buttonT::before { border: none; background: hsl(220, 72%, 39%); box-shadow: inset -2px -7px 3px 1px hsl(220, 70%, 43%), inset 0px 0px 1px 9px hsl(220, 75%, 34%), 0px -1px 0px 1px hsl(220, 72%, 50%), 0px 1px 0px 2px hsl(220, 72%, 28%); } #jt-touch-button  { z-index: 7 } #jt-touch-buttonT { z-index: 6 } #jt-touch-speed.jt-center { width: 84px; left: 0; right: 0; margin: 0 auto; } #jt-touch-speed.jt-center.jt-poweroff #jt-touch-pause { margin-left: 21px } #jt-touch-pause, #jt-touch-fast { float: left; width: 42px; height: 42px; border-color: hsl(0, 0%, 70%); } #jt-touch-pause::after, #jt-touch-fast::before, #jt-touch-fast::after { content: ""; display: inline-block; border: 0 solid transparent; box-sizing: border-box; } #jt-touch-pause::after { margin-top: 14px; width: 13px; height: 14px; border-width: 0; border-left-width: 4px; border-left-color: inherit; border-right-width: 4px; border-right-color: inherit; } #jt-touch-fast::before, #jt-touch-fast::after { margin-top: 14px; width: 11px; height: 14px; border-width: 7px; border-left-width: 11px; border-left-color: inherit; border-right-width: 0; } #jt-touch-speed.jt-paused #jt-touch-pause::after, #jt-touch-speed.jt-poweroff #jt-touch-pause::after { margin: 12px 0 0 3px; width: 15px; height: 18x; border-width: 9px; border-left-width: 15px; border-right-width: 0; } #jt-touch-speed.jt-paused  #jt-touch-fast::after { width: 7px; border-width: 0; border-left-width: 3px; } #jt-touch-speed.jt-poweroff #jt-touch-fast { display: none; } .jt-console-panel { width:' + jt.ConsolePanel.DEFAULT_WIDTH + 'px; height:' + jt.ConsolePanel.DEFAULT_HEIGHT + 'px; background: black url("' + jt.Images.urls.panel + '") no-repeat; background-size: 460px 134px; box-shadow: ' + jt.ConsolePanel.sameBoxShadowAsScreen() + '; outline: none; } html.jt-full-screen .jt-console-panel { box-shadow: none; } .jt-console-panel-icon { position: absolute; background: url("' + jt.Images.urls.iconSprites + '") center no-repeat; background-size: 264px 82px; } .jt-console-panel-switch { position: absolute; bottom: 107px; width: 50px; height: 26px; opacity: 0; cursor: pointer; } .jt-console-panel-switch:after { content: ""; position: absolute; left: 11px; bottom: 5px; width: 27px; height: 16px; background: url("' + jt.Images.urls.panelSprites + '") center no-repeat; background-size: 256px 93px; } .jt-console-panel-lever { position: absolute; bottom: 30px; width: 44px; height: 72px; cursor: pointer; } .jt-console-panel-lever:after { content: ""; position: absolute; left: 12px; bottom: 8px; width: 20px; height: 46px; background: url("' + jt.Images.urls.panelSprites + '") center no-repeat; background-size: 256px 93px; } .jt-console-panel-power { left: 19px; } .jt-console-panel-power:after { background-position: 0px 0px; } .jt-console-panel-color { left: 84px; } .jt-console-panel-color:after { background-position: -21px 0px; } .jt-console-panel-select { left: 340px; } .jt-console-panel-select:after { background-position: 0px -47px; } .jt-console-panel-reset { left: 403px; } .jt-console-panel-reset:after { background-position: -21px -47px; } .jt-console-panel-p0-diff { left: 152px; } .jt-console-panel-p0-diff:after { background-position: -229px -17px; } .jt-console-panel-p1-diff { left: 265px; } .jt-console-panel-p1-diff:after { background-position: -229px 0px; } .jt-console-panel-cart-image { position: absolute; left: 140px; bottom: 9px; width: 186px; height: 82px; background: url("' + jt.Images.urls.panelSprites + '") center no-repeat; background-size: 256px 93px; background-position: -42px 0px; } .jt-console-panel-cart-load { position: absolute; left: 141px; bottom: 36px; width: 184px; height: 55px; cursor: pointer; } .jt-console-panel-cart-file { left: 170px; bottom: 3px; width: 31px; height: 30px; background-position: -132px -6px; cursor: pointer; } .jt-console-panel-cart-url { left: 266px; bottom: 3px; width: 31px; height: 30px; background-position: -161px -6px; cursor: pointer; } .jt-console-panel-cart-label { position: absolute; top: 51px; left: 156px; width: 148px; height: 25px; padding: 0px 2px; margin: 0px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-style: normal; font-variant: normal; font-weight: bold; font-stretch: normal; font-size: 14px; line-height: 25px; font-family: sans-serif; text-align: center; color: black; background: black; border: 1px solid transparent; opacity: 1; cursor: pointer; } .jt-console-panel-power-labels { left: 31px; bottom: 9px; width: 88px; height: 15px; background-position: -135px -37px; } .jt-console-panel-reset-labels { right: 16px; bottom: 9px; width: 96px; height: 15px; background-position: -135px -55px; } .jt-console-panel-p0-diff-label { left: 128px; top: 8px; width: 29px; height: 15px; background-position: -233px -37px; } .jt-console-panel-p1-diff-label { left: 313px; top: 8px; width: 28px; height: 15px; background-position: -233px -55px; } .jt-hide-labels .jt-console-panel-p0-diff-label, .jt-hide-labels .jt-console-panel-p1-diff-label, .jt-hide-labels .jt-console-panel-power-labels, .jt-hide-labels .jt-console-panel-reset-labels, .jt-hide-labels .jt-console-panel-cart-file, .jt-hide-labels .jt-console-panel-cart-url { visibility: hidden; } @media only screen and (orientation: landscape) {    /* Landscape */ #jt-touch-left { left: calc(-6px - ' + this.TOUCH_CONTROLS_LEFT_WIDTH + 'px); bottom: 50%; transform: translateY(50%); } html.jt-full-screen.jt-touch-active.jt-dir-big  #jt-touch-left { left: calc(-6px - ' + this.TOUCH_CONTROLS_LEFT_WIDTH_BIG + 'px); transform: translateY(50%) scale(1.2); transform-origin: left center; } #jt-touch-right { right: calc(5px - ' + this.TOUCH_CONTROLS_RIGHT_WIDTH + 'px); bottom: 50%; transform: translateY(50%); } #jt-touch-speed { position: absolute; left: -103px; top: 10px; } html.jt-full-screen.jt-touch-active.jt-dir-big  #jt-touch-speed { left: -118px; } /* Adjust centered elements leaving space to the touch controls on both sides */ html.jt-full-screen.jt-touch-active #jt-screen-fs-center { left: ' + this.TOUCH_CONTROLS_LEFT_WIDTH + 'px; right: ' + this.TOUCH_CONTROLS_RIGHT_WIDTH + 'px; } html.jt-full-screen.jt-touch-active.jt-dir-big #jt-screen-fs-center { left: ' + this.TOUCH_CONTROLS_LEFT_WIDTH_BIG + 'px; } } @media only screen and (orientation: portrait) {    /* Portrait */ #jt-touch-left { left: 2px; bottom: 200px; } html.jt-full-screen.jt-touch-active.jt-dir-big  #jt-touch-left { transform: scale(1.2); transform-origin: left center; } #jt-touch-right { right: 5px; bottom: 144px; width: 112px; height: 112px; } #jt-touch-speed { position: absolute; left: 19px; bottom: ' + (this.BAR_HEIGHT + 12) + 'px; } .jt-touch-button { position: absolute; } #jt-touch-button { bottom: 50%; right: 50%; } #jt-touch-buttonT { bottom: 100%; right: 0%; } } @media only screen and (orientation: portrait) and (max-device-height: 638px) {    /* Medium Portrait. Like iPhone 5 */ #jt-touch-left { bottom: 156px; } #jt-touch-right { bottom: 100px; } } @media only screen and (orientation: portrait) and (max-device-height: 518px) {    /* Short Portrait. Like iPhone 4 */ #jt-touch-left { bottom: 98px; } #jt-touch-right { bottom: 42px; } html.jt-console-panel-active #jt-touch-left { bottom: 106px; } html.jt-console-panel-active #jt-touch-right { bottom: 52px; } html.jt-full-screen.jt-console-panel-active #jt-touch-speed { display: none; } } ';
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Monitor = function(display) {
"use strict";

    var self = this;

    function init() {
        prepareResources();
        setDisplayDefaultSize();
        self.setVideoStandard(videoStandard);
    }

    this.connect = function(pVideoSignal) {
        videoSignal = pVideoSignal;
        videoSignal.connectMonitor(this);
    };

    this.nextLine = function(pixels, vSynchSignal) {
        // Process new line received
        var vSynched = false;
        if (line < signalHeight) {
            // Copy to the back buffer only contents that will be displayed
            if (line >= viewportOriginY && line < viewportOriginY + viewportHeight)
                backBuffer.set(pixels, (line - viewportOriginY) * signalWidth);
        } else
            vSynched = maxLineExceeded();
        line++;
        if (!videoStandardDetected) videoStandardDetectionFrameLineCount++;
        if (vSynchSignal) {
            if (!videoStandardDetected) videoStandardDetectionNewFrame();
            vSynched |= newFrame();
        }
        return vSynched;
    };

    //this.nextLineNew = function(pixels, vSynchSignal) {
    //    // Process new line received
    //    var frameEnd = false;
    //    if (line < signalHeight) {
    //        // Copy to the back buffer only contents that will be displayed
    //        if (line >= viewportOriginY && line < viewportOriginY + viewportHeight)
    //            backBuffer.set(pixels, (line - viewportOriginY) * signalWidth);
    //    } else
    //        frameEnd = maxLineExceeded();
    //    line++;
    //    if (!videoStandardDetected) ++videoStandardDetectionFrameLineCount;
    //    if (vSynchActive ^ vSynchSignal) {
    //        vSynchActive = vSynchSignal;
    //        if (!vSynchSignal) {
    //            if (!videoStandardDetected) videoStandardDetectionNewFrame();
    //            return newFrame();
    //        }
    //    }
    //    return frameEnd;
    //};

    var newFrame = function() {
        if (line < minLinesToSync) return false;

        if (showInfo) display.showOSD(videoStandard.name + "  " + line + " lines" /* ,  CRT mode: " + crtModeNames[crtMode] */, true);

        // Start a new frame
        line = 0;
        frame++;
        return true;
    };

    var maxLineExceeded = function() {
        if (line > maxLinesToSync) {
            //if (debug > 0) Util.log("Display maximum scanlines exceeded: " + line);
            return newFrame();
        } else
            return false;
    };

    this.setVideoStandard = function(standard) {
        videoStandard = standard;
        signalWidth = standard.totalWidth;
        signalHeight = standard.totalHeight;
        minLinesToSync = signalHeight - VSYNC_TOLERANCE;
        maxLinesToSync = signalHeight + VSYNC_TOLERANCE + EXTRA_UPPER_VSYNC_TOLERANCE;
        if (isDefaultViewport) {
            viewportHeightPct = videoStandard.defaultHeightPct;
            viewportOriginYPct = videoStandard.defaultOriginYPct;
        }
        setViewportSize(viewportWidth, viewportHeightPct);
        setViewportOrigin(viewportOriginX, viewportOriginYPct);
    };

    var videoStandardDetectionNewFrame = function() {
        var linesCount = videoStandardDetectionFrameLineCount;
        videoStandardDetectionFrameLineCount = 0;
        // Only consider frames with linesCount in range with tolerances (NTSC 262, PAL 312)
        if ((linesCount >= 250 && linesCount <= 281)
            || (linesCount >= 300 && linesCount <= 325))
            if (++videoStandardDetectionFrameCount >= 5)
                videoStandardDetectionFinish(linesCount);
    };

    var videoStandardDetectionFinish = function(linesCount) {
        videoStandardDetected = linesCount < 290 ? jt.VideoStandard.NTSC : jt.VideoStandard.PAL;

        // Compute an additional number of lines to make the display bigger, if needed
        // Only used when the detected number of lines per frame is bigger than standard by a reasonable amount
        var prevAdd = videoStandardDetectionAdtLinesPerFrame;
        var newAdd = linesCount - videoStandardDetected.totalHeight;
        if (newAdd > 2) newAdd = (newAdd > 6 ? 6 : newAdd) - 2;
        else newAdd = 0;

        // Only sets size now if additional lines changed
        if (newAdd != prevAdd) {
            videoStandardDetectionAdtLinesPerFrame = newAdd;
            self.setVideoStandard(videoStandardDetected);
        }
    };

    this.videoSignalOff = function() {
        line = 0;
        display.videoSignalOff();
    };

    var setViewportOrigin = function(x, yPct) {
        viewportOriginX = x;
        if (viewportOriginX < 0) viewportOriginX = 0;
        else if (viewportOriginX > signalWidth - viewportWidth) viewportOriginX = signalWidth - viewportWidth;

        viewportOriginYPct = yPct;
        if (viewportOriginYPct < 0) viewportOriginYPct = 0;
        else if ((viewportOriginYPct / 100 * signalHeight) > signalHeight - viewportHeight)
            viewportOriginYPct = (signalHeight - viewportHeight) / signalHeight * 100;

        // Compute final display originY, adding a little for additional lines as discovered in last video standard detection
        var adtOriginY = videoStandardDetectionAdtLinesPerFrame / 2;
        viewportOriginY = ((viewportOriginYPct / 100 * signalHeight) + adtOriginY) | 0;
        if ((viewportOriginY + viewportHeight) > signalHeight) viewportOriginY = signalHeight - viewportHeight;
    };

    var setViewportSize = function(width, heightPct) {
        viewportWidth = width;
        if (viewportWidth < 10) viewportWidth = 10;
        else if (viewportWidth > signalWidth) viewportWidth = signalWidth;

        viewportHeightPct = heightPct;
        if (viewportHeightPct < 10) viewportHeightPct = 10;
        else if (viewportHeightPct > 100) viewportHeightPct = 100;

        // Compute final display height, considering additional lines as discovered in last video standard detection
        viewportHeight = (viewportHeightPct / 100 * (signalHeight + videoStandardDetectionAdtLinesPerFrame)) | 0;
        if (viewportHeight > signalHeight) viewportHeight = signalHeight;

        offCanvas.width = viewportWidth;
        offCanvas.height = viewportHeight;

        setViewportOrigin(viewportOriginX, viewportOriginYPct);
        displayUpdateSize();
    };

    var displayUpdateSize = function() {
        if (!display) return;
        display.displayMetrics(viewportWidth, viewportHeight);
    };

    var setDisplayDefaultSize = function() {
        isDefaultViewport = true;
        viewportOriginX = DEFAULT_ORIGIN_X;
        viewportOriginYPct = videoStandard.defaultOriginYPct;
        setViewportSize(DEFAULT_WIDTH, videoStandard.defaultHeightPct);
    };

    var prepareResources = function() {
        offCanvas = document.createElement('canvas');
        offCanvas.width = DEFAULT_WIDTH;
        offCanvas.height = DEFAULT_HEIGHT;
        offContext = offCanvas.getContext("2d", { alpha: false, antialias: false });
        offContext.globalCompositeOperation = "copy";
        offContext.globalAlpha = 1;
        offImageData = offContext.createImageData(jt.VideoStandard.PAL.totalWidth, jt.VideoStandard.PAL.totalHeight);
        backBuffer = new Uint32Array(offImageData.data.buffer);
    };

    this.currentLine = function() {
        return line;
    };

    this.refresh = function() {
        // First paint the offscreen canvas with new frame data
        offContext.putImageData(offImageData, -viewportOriginX, 0, viewportOriginX, 0, viewportWidth, viewportHeight);

        // Then refresh display with the new image (canvas) and correct dimensions
        display.refresh(offCanvas, viewportWidth, viewportHeight);

        //if (debug > 0) cleanBackBuffer();
    };

    this.videoStandardDetectionStart = function() {
        videoStandardDetected = null;
        videoStandardDetectionFrameCount = 0;
        videoStandardDetectionFrameLineCount = 0;
    };

    this.getVideoStandardDetected = function() {
        return videoStandardDetected;
    };

    this.toggleShowInfo = function() {
        showInfo = !showInfo;
        if (!showInfo) display.showOSD(null, true);
    };

    this.signalOff = function() {
        display.videoSignalOff();
    };

    this.showOSD = function(message, overlap, error) {
        display.showOSD(message, overlap, error);
    };

    this.setDefaults = function() {
        setDisplayDefaultSize();
        display.crtModeSetDefault();
        display.crtFilterSetDefault();
        display.requestReadjust(true);
    };

    this.setDebugMode = function(boo) {
        display.setDebugMode(boo);
    };

    this.crtModeToggle = function() {
        display.crtModeToggle();
    };

    this.crtFilterToggle = function() {
        display.crtFilterToggle();
    };

    this.fullscreenToggle = function() {
        display.displayToggleFullscreen();
    };

    this.displayAspectDecrease = function() {
        this.displayScale(normalizeAspectX(displayAspectX - SCALE_STEP), displayScaleY);
        this.showOSD("Display Aspect: " + displayAspectX.toFixed(2) + "x", true);
    };

    this.displayAspectIncrease = function() {
        this.displayScale(normalizeAspectX(displayAspectX + SCALE_STEP), displayScaleY);
        this.showOSD("Display Aspect: " + displayAspectX.toFixed(2) + "x", true);
    };

    this.displayScaleDecrease = function() {
        this.displayScale(displayAspectX, normalizeScaleY(displayScaleY - SCALE_STEP));
        this.showOSD("Display Size: " + displayScaleY.toFixed(2) + "x", true);
    };

    this.displayScaleIncrease = function() {
        this.displayScale(displayAspectX, normalizeScaleY(displayScaleY + SCALE_STEP));
        this.showOSD("Display Size: " + displayScaleY.toFixed(2) + "x", true);
    };

    this.viewportOriginDecrease = function() {
        isDefaultViewport = false;
        setViewportOrigin(viewportOriginX, viewportOriginYPct + ORIGIN_Y_STEP);
        this.showOSD("Viewport Origin: " + viewportOriginY, true);
    };

    this.viewportOriginIncrease = function() {
        isDefaultViewport = false;
        setViewportOrigin(viewportOriginX, viewportOriginYPct - ORIGIN_Y_STEP);
        this.showOSD("Viewport Origin: " + viewportOriginY, true);
    };

    this.viewportSizeDecrease = function() {
        setDisplayDefaultSize();
        this.showOSD("Viewport Size: Standard", true);
    };

    this.viewportSizeIncrease = function() {
        isDefaultViewport = false;
        setViewportSize(signalWidth, 100);
        this.showOSD("Viewport Size: Full Signal", true);
    };

    this.displayScale = function(aspectX, scaleY) {
        displayAspectX = aspectX;
        displayScaleY = scaleY;
        display.displayScale(displayAspectX, displayScaleY);
    };

    function normalizeAspectX(aspectX) {
        var ret = aspectX < 0.5 ? 0.5 : aspectX > 2.5 ? 2.5 : aspectX;
        return Math.round(ret * 10) / 10;
    }

    function normalizeScaleY(scaleY) {
        var ret = scaleY < 0.5 ? 0.5 : scaleY;
        return Math.round(ret * 10) / 10;
    }

    this.controlStateChanged = function(control, state) {
        display.controlStateChanged(control, state);
    };

    this.controlsStatesRedefined = function() {
        display.controlsStatesRedefined();
    };

    this.consolePowerAndUserPauseStateUpdate = function(power, paused) {
        display.consolePowerAndUserPauseStateUpdate(power, paused);
    };

    this.cartridgeInserted = function(cart) {
        display.cartridgeInserted(cart);
    };


    var offCanvas;
    var offContext;
    var offImageData;
    var backBuffer;

    var videoSignal;
    var signalWidth;
    var signalHeight;
    var videoStandard = jt.VideoStandard.NTSC;

    var minLinesToSync;
    var maxLinesToSync;

    var line = 0;
    var frame = 0;

    var viewportWidth;
    var viewportHeight;
    var viewportHeightPct;
    var viewportOriginX;
    var viewportOriginY;
    var viewportOriginYPct;
    var isDefaultViewport = true;

    var displayAspectX;
    var displayScaleY;

    var videoStandardDetected;
    var videoStandardDetectionFrameCount;
    var videoStandardDetectionFrameLineCount = 0;
    var videoStandardDetectionAdtLinesPerFrame = 0;

    var showInfo = false;

    var DEFAULT_WIDTH = 160;
    var DEFAULT_HEIGHT = 213;
    var DEFAULT_ORIGIN_X = 68;
    var VSYNC_TOLERANCE = 16;
    var EXTRA_UPPER_VSYNC_TOLERANCE = 5;

    var SCALE_STEP = 0.1;
    var ORIGIN_Y_STEP = 0.4;


    init();

};



// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.ConsolePanel = function(screen, panelElement) {
"use strict";

    this.connectPeripherals = function(pFileLoader, pConsoleControls, pPeripheralControls) {
        consoleControls = pConsoleControls;
        peripheralControls = pPeripheralControls;
        pFileLoader.registerForDnD(panelElement);
    };

    this.connect = function(pControlsSocket) {
        controlsSocket = pControlsSocket;
    };

    this.setActive = function(pActive) {
        active = pActive;
        if (active) {
            if (!powerButton) create();
            refreshCartridge();
            updateVisibleControlsState();
        }
        document.documentElement.classList.toggle("jt-console-panel-active", active);
    };

    this.setLogoMessageActive = function(active) {
        logoMessageActive = active;
    };

    this.updateScale = function(screenWidth, isFullscreen, isLandscape) {
        var height = 0, width = 0;
        if (active) {
            screenWidth = isFullscreen
                ? isLandscape ? screenWidth * 0.85 : screenWidth - 36
                : screenWidth * 0.85;
            var scale = Math.min(1, screenWidth / jt.ConsolePanel.DEFAULT_WIDTH);
            panelElement.style.transform = scale < 1
                ? "translateX(-50%) scale(" + scale.toFixed(8) + ")"
                : "translateX(-50%)";
            height = Math.ceil(scale * jt.ConsolePanel.DEFAULT_HEIGHT);
            width  = Math.ceil(scale * jt.ConsolePanel.DEFAULT_WIDTH);
        }

        if (consoleControls) consoleControls.getTouchControls().updateConsolePanelSize(screenWidth, width, height, isFullscreen, isLandscape);

        //console.error("PANEL SCALE: " + scale);

        return height;
    };

    function create() {
        setupMain();
        setupButtons();
        setupCartridgeLabel();
    }

    var refreshControls = function() {
        // Controls State
        setVisibility(powerButton, !controlsStateReport[controls.POWER]);
        setVisibility(colorButton, controlsStateReport[controls.BLACK_WHITE]);
        setVisibility(selectButton, controlsStateReport[controls.SELECT]);
        setVisibility(resetButton, controlsStateReport[controls.RESET]);
        setVisibility(p0DiffButton, controlsStateReport[controls.DIFFICULTY0]);
        setVisibility(p1DiffButton, controlsStateReport[controls.DIFFICULTY1]);
        refreshCartridge();
    };

    var refreshCartridge = function () {
        // Cartridge Image
        setVisibility(cartInsertedImage, cartridgeInserted);
        setVisibility(cartLabel, cartridgeInserted);

        // Cartridge Label
        cartLabel.innerHTML = (cartridgeInserted && cartridgeInserted.rom.info.l) || DEFAULT_CARTRIDGE_LABEL;
        if (cartridgeInserted && cartridgeInserted.rom.info.lc) {
            var colors = cartridgeInserted.rom.info.lc.trim().split(/\s+/);
            cartLabel.style.color = colors[0] || DEFAULT_CARTRIDGE_LABEL_COLOR;
            cartLabel.style.background = colors[1] || DEFAULT_CARTRIDGE_BACK_COLOR;
            cartLabel.style.borderColor = colors[2] || DEFAULT_CARTRIDGE_BORDER_COLOR;
        } else {
            cartLabel.style.color = DEFAULT_CARTRIDGE_LABEL_COLOR;
            cartLabel.style.background = DEFAULT_CARTRIDGE_BACK_COLOR;
            cartLabel.style.borderColor = DEFAULT_CARTRIDGE_BORDER_COLOR;
        }
    };

    var updateVisibleControlsState = function() {
        controlsSocket.controlsStateReport(controlsStateReport);
        refreshControls();
    };

    var setupMain = function () {
        panelElement.innerHTML = jt.ScreenGUI.htmlConsolePanel;
        delete jt.ScreenGUI.htmlConsolePanel;

        if (jt.Util.isMobileDevice()) panelElement.classList.add("jt-hide-labels");
    };

    var setupButtons = function() {
        powerButton  = document.getElementById("jt-console-panel-power");
        consoleControlButton(powerButton, controls.POWER, false);
        colorButton  = document.getElementById("jt-console-panel-color");
        consoleControlButton(colorButton, controls.BLACK_WHITE, false);
        selectButton = document.getElementById("jt-console-panel-select");
        consoleControlButton(selectButton, controls.SELECT, true);
        resetButton  = document.getElementById("jt-console-panel-reset");
        consoleControlButton(resetButton, controls.RESET, true);
        p0DiffButton = document.getElementById("jt-console-panel-p0-diff");
        consoleControlButton(p0DiffButton, controls.DIFFICULTY0, false);
        p1DiffButton = document.getElementById("jt-console-panel-p1-diff");
        consoleControlButton(p1DiffButton, controls.DIFFICULTY1, false);

        cartInsertedImage = document.getElementById("jt-console-panel-cart-image");
        cartChangeButton  = document.getElementById("jt-console-panel-cart-load");
        addCartridgeControlButton(cartChangeButton, jt.PeripheralControls.CARTRIDGE_LOAD_RECENT);

        if (!Javatari.CARTRIDGE_CHANGE_DISABLED) {
            cartChangeFileButton = document.getElementById("jt-console-panel-cart-file");
            addCartridgeControlButton(cartChangeFileButton, jt.PeripheralControls.CARTRIDGE_LOAD_RECENT);
            setVisibility(cartChangeFileButton, true);
            cartChangeURLButton = document.getElementById("jt-console-panel-cart-url");
            addCartridgeControlButton(cartChangeURLButton, jt.PeripheralControls.AUTO_LOAD_URL);
            setVisibility(cartChangeURLButton, true);
        }
    };

    var consoleControlButton = function (but, control, isHold) {
        but.jtControl = control;
        if (isHold) {
            but.jtPressed = false;
            jt.Util.addEventsListener(but, "mousedown touchstart", switchPressed);
            jt.Util.addEventsListener(but, "mouseup touchend touchcancel", switchReleased);
            jt.Util.addEventsListener(but, "mouseleave", switchLeft);
        } else
            jt.Util.onTapOrMouseDown(but, switchPressed);
    };

    function switchPressed(e) {
        jt.Util.blockEvent(e);
        if (logoMessageActive) return;
        consoleControls.hapticFeedbackOnTouch(e);
        screen.closeAllOverlays();
        e.target.jtPressed = true;
        controlsSocket.controlStateChanged(e.target.jtControl, true);
    }

    function switchReleased(e) {
        jt.Util.blockEvent(e);
        e.target.jtPressed = false;
        if (logoMessageActive) return;
        consoleControls.hapticFeedbackOnTouch(e);
        controlsSocket.controlStateChanged(e.target.jtControl, false);
    }

    function switchLeft(e) {
        if (!e.target.jtPressed) return;
        switchReleased(e);
    }

    var addCartridgeControlButton = function (but, control) {
        but.jtControl = control;
        but.jtNeedsUIG = true;
        jt.Util.onTapOrMouseDownWithBlockUIG(but, cartridgeButtonPressed);
    };

    function cartridgeButtonPressed(e) {
        consoleControls.hapticFeedbackOnTouch(e);
        screen.closeAllOverlays();
        peripheralControls.controlActivated(e.target.jtControl);
    }

    var setVisibility = function(element, boo) {
        element.style.opacity = boo ? 1 : 0;
    };

    var setupCartridgeLabel = function() {
        // Adjust default colors for the label as per parameters
        var colors = (Javatari.CARTRIDGE_LABEL_COLORS || "").trim().split(/\s+/);
        if (colors[0]) DEFAULT_CARTRIDGE_LABEL_COLOR = colors[0];
        if (colors[1]) DEFAULT_CARTRIDGE_BACK_COLOR = colors[1];
        if (colors[2]) DEFAULT_CARTRIDGE_BORDER_COLOR = colors[2];

        cartLabel = document.getElementById("jt-console-panel-cart-label");
        addCartridgeControlButton(cartLabel, jt.PeripheralControls.CARTRIDGE_LOAD_RECENT);
    };



    // Controls interface  -----------------------------------

    var controls = jt.ConsoleControls;

    this.controlStateChanged = function(control, state) {
        if (active && visibleControls[control]) updateVisibleControlsState();
    };

    this.controlsStatesRedefined = function () {
        if (active) updateVisibleControlsState();
    };


    // Cartridge interface  ------------------------------------

    this.cartridgeInserted = function(cartridge) {
        cartridgeInserted = cartridge;
        if (active) refreshCartridge();
    };


    var active = false;

    var consoleControls;
    var peripheralControls;
    var controlsSocket, controlsStateReport = {};
    var cartridgeInserted;
    var logoMessageActive = false;

    var powerButton;
    var colorButton;
    var selectButton;
    var resetButton;
    var p0DiffButton;
    var p1DiffButton;
    var cartInsertedImage;
    var cartChangeButton;
    var cartChangeFileButton;
    var cartChangeURLButton;

    var cartLabel;

    var visibleControls = {};
    visibleControls[controls.POWER] = 1;
    visibleControls[controls.BLACK_WHITE] = 1;
    visibleControls[controls.SELECT] = 1;
    visibleControls[controls.RESET] = 1;
    visibleControls[controls.DIFFICULTY0] = 1;
    visibleControls[controls.DIFFICULTY1] = 1;


    var DEFAULT_CARTRIDGE_LABEL =        "JAVATARI";
    var DEFAULT_CARTRIDGE_LABEL_COLOR =  "#fa2525";
    var	DEFAULT_CARTRIDGE_BACK_COLOR =   "#101010";
    var	DEFAULT_CARTRIDGE_BORDER_COLOR = "transparent";

};

jt.ConsolePanel.DEFAULT_WIDTH = 460;
jt.ConsolePanel.DEFAULT_HEIGHT = 134;

jt.ConsolePanel.shouldStartActive = function() {
    // Try some backward compatible means to find if Panel should not be active by default
    return !Javatari.SCREEN_CONSOLE_PANEL_DISABLED && (Javatari.CONSOLE_PANEL_ELEMENT_ID === -1 || document.getElementById(Javatari.CONSOLE_PANEL_ELEMENT_ID));
};

jt.ConsolePanel.sameBoxShadowAsScreen = function() {
    var screenElement = document.getElementById(Javatari.SCREEN_ELEMENT_ID);
    return screenElement ? window.getComputedStyle(screenElement, null).getPropertyValue("box-shadow") : "none";
};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// TODO Remove "Center" rounding problems as possible. Main screen element centering still remaining
// TODO Possible to use hotkeys and bypass logo messages

jt.CanvasDisplay = function(mainElement) {
"use strict";

    var self = this;

    function init() {
        jt.Util.insertCSS(jt.ScreenGUI.css());
        delete jt.ScreenGUI.css;
        setupMain();
        setupBar();
        setupFullscreen();
        consolePanel = new jt.ConsolePanel(self, consolePanelElement);
        monitor = new jt.Monitor(self);
    }

    this.connect = function(pConsole) {
        atariConsole = pConsole;
        monitor.connect(atariConsole.getVideoOutput());
        consoleControlsSocket = atariConsole.getConsoleControlsSocket();
        cartridgeSocket = atariConsole.getCartridgeSocket();
        consolePanel.connect(consoleControlsSocket);
    };

    this.connectPeripherals = function(pRecentROMs, pFileLoader, pFileDownloader, pConsoleControls, pPeripheralControls, pStateMedia) {
        recentROMs = pRecentROMs;
        fileLoader = pFileLoader;
        pFileLoader.registerForDnD(fsElement);
        pFileLoader.registerForFileInputElement(fsElement);
        fileDownloader = pFileDownloader;
        fileDownloader.registerForDownloadElement(fsElement);
        peripheralControls = pPeripheralControls;
        consoleControls = pConsoleControls;
        consoleControls.addKeyInputElement(fsElement);
        stateMedia = pStateMedia;
        consolePanel.connectPeripherals(pFileLoader, consoleControls, peripheralControls);
    };

    this.powerOn = function() {
        monitor.setDefaults();
        updateLogo();
        document.documentElement.classList.add("jt-started");
        setPageVisibilityHandling();
        this.focus();
        if (JavatariFullScreenSetup.shouldStartInFullScreen()) {
            setFullscreenState(true);
            setEnterFullscreenByAPIOnFirstTouch();
        }
    };

    this.powerOff = function() {
        document.documentElement.remove("jt-started");
    };

    this.start = function(startAction) {
        // Show mobile messages or start automatically
        if (isMobileDevice && !isBrowserStandalone && !isFullscreen) {
            // Install as App message
            if (jt.Util.isOfficialHomepage())
                showLogoMessage('For ' + (fullscreenAPIEnterMethod ? 'the best' : 'a full-screen') + ' experience, use<br>the "Add to Home Screen" function<br>then launch from the Installed App', "NICE!", false, startActionInFullScreen);
            // Go fullscreen message
            else
                showLogoMessage('For the best experience,<br>Javatari will go full-screen', "GO!", true, startActionInFullScreen);
        } else
            startAction();

        function startActionInFullScreen() {
            self.setFullscreen(true);
            startAction();
        }
    };

    this.refresh = function(image, sourceWidth, sourceHeight) {
        // Hide mouse cursor if not moving for some time
        if (cursorHideFrameCountdown > 0)
            if (--cursorHideFrameCountdown <= 0) hideCursorAndBar();

        // If needed, turn signal on and hide logo
        if (!signalIsOn) {
            signalIsOn = true;
            updateLogo();
        }

        // Update frame
        if (!canvasContext) createCanvasContext();
        canvasContext.drawImage(
            image,
            0, 0,
            canvas.width, canvas.height
        );

        //console.log("" + sourceWidth + "x" + sourceHeight + " > " + targetWidth + "x" + targetHeight);
    };

    this.videoSignalOff = function() {
        signalIsOn = false;
        showCursorAndBar();
        updateLogo();
    };

    this.mousePointerLocked = function(state) {
        mousePointerLocked = state;
        if (mousePointerLocked) hideCursorAndBar();
        else showCursorAndBar();
    };

    this.openHelp = function() {
        self.openSettings("GENERAL");
        return false;
    };

    this.openAbout = function() {
        self.openSettings("ABOUT");
        return false;
    };

    this.openSettings = function(page) {
        closeAllOverlays();
        if (!settingsDialog) settingsDialog = new jt.SettingsDialog(fsElementCenter, consoleControls);
        settingsDialog.show(page);
    };

    this.openSaveStateDialog = function (save) {
        closeAllOverlays();
        if (!saveStateDialog) saveStateDialog = new jt.SaveStateDialog(fsElementCenter, consoleControlsSocket, peripheralControls, stateMedia);
        saveStateDialog.show(save);
    };

    this.openQuickOptionsDialog = function() {
        closeAllOverlays();
        if (!quickOtionsDialog) quickOtionsDialog = new jt.QuickOptionsDialog(fsElementCenter, consoleControlsSocket, peripheralControls);
        quickOtionsDialog.show();
    };

    this.openLoadFileDialog = function(altPower, secPort) {
        fileLoader.openFileChooserDialog(jt.FileLoader.OPEN_TYPE.AUTO, altPower, secPort, false);
    };

    this.openRecentROMsDialog = function () {
        closeAllOverlays();
        if (!recentROMsDialog) recentROMsDialog = new jt.RecentROMsDialog(fsElementCenter, this, recentROMs, fileLoader);
        recentROMsDialog.show();
    };

    this.openCartridgeChooserDialog = function (force, altPower, secPort) {
        if (logoMessageActive) self.closeLogoMessage();      // May be invoked directly from outside!
        if (!force && recentROMs.getCatalog().length === 0) this.openLoadFileDialog(altPower, secPort);
        else this.openRecentROMsDialog();
    };

    this.toggleConsolePanel = function() {
        if (isFullscreen && isLandscape) consolePanelActiveLandscape = !consolePanelActiveLandscape;
        else consolePanelActivePortrait = !consolePanelActivePortrait;
        consolePanelUpdateForOrientation();
    };

    this.getControlReport = function(control) {
        // Only CRT Filter for now
        return { label: crtFilter === -2 ? "Browser" : crtFilter === -1 ? "Auto" : crtFilter === 0 ? "OFF" : "Level " + crtFilter, active: crtFilter >= 0 };
    };

    function consolePanelUpdateForOrientation() {
        setConsolePanelActive(isFullscreen && isLandscape ? consolePanelActiveLandscape : consolePanelActivePortrait);
    }

    function setConsolePanelActive(active) {
        if (consolePanelActive === active) return;
        consolePanelActive = active;
        consolePanel.setActive(consolePanelActive);
        updateScale();
        if (consolePanelActive) showBar();
        else cursorHideFrameCountdown = CURSOR_HIDE_FRAMES;
    }

    this.toggleMenuByKey = function() {
        if (barMenuActive) hideBarMenu();
        else {
            closeAllOverlays();
            showBarMenu(barMenuSystem, true);
        }
    };

    this.getScreenCapture = function() {
        if (!signalIsOn) return;
        return canvas.toDataURL('image/png');
    };

    this.saveScreenCapture = function() {
        var cap = this.getScreenCapture();
        if (cap) fileDownloader.startDownloadURL("Javatari Screen", cap, "Screen Capture");
    };

    this.displayMetrics = function (pTargetWidth, pTargetHeight) {
        // No need to resize display if target size is unchanged
        if (targetWidth === pTargetWidth && targetHeight === pTargetHeight) return;

        targetWidth = pTargetWidth;
        targetHeight = pTargetHeight;
        updateCanvasContentSize();
        if (isFullscreen) this.requestReadjust(true);
        else updateScale();
    };

    this.displayScale = function(pAspectX, pScaleY) {
        aspectX = pAspectX;
        scaleY = pScaleY;
        updateScale();
    };

    this.getMonitor = function() {
        return monitor;
    };

    this.showOSD = function(message, overlap, error) {
        if (osdTimeout) clearTimeout(osdTimeout);
        if (!message) {
            osd.style.transition = "all 0.15s linear";
            osd.style.top = "-29px";
            osd.style.opacity = 0;
            osdShowing = false;
            return;
        }
        if (overlap || !osdShowing) {
            osd.innerHTML = message;
            osd.style.color = error ? "rgb(255, 60, 40)" : "rgb(0, 255, 0)";
        }
        osd.style.transition = "none";
        osd.style.top = "15px";
        osd.style.opacity = 1;
        osdShowing = true;

        var availWidth = canvasOuter.clientWidth - 30;      //  message width - borders
        var width = osd.clientWidth;
        var scale = width < availWidth ? 1 : availWidth / width;
        osd.style.transform = "scale(" + scale.toFixed(4) + ")";

        osdTimeout = setTimeout(hideOSD, OSD_TIME);
    };

    this.displayDefaultScale = function() {
        if (Javatari.SCREEN_DEFAULT_SCALE > 0) return Javatari.SCREEN_DEFAULT_SCALE;

        var maxWidth = Number.parseFloat(window.getComputedStyle(mainElement.parentElement).width);

        //atariConsole.error(">>> Parent width: " + maxWidth);

        return maxWidth >= 640 ? 2.0 : maxWidth >= 540 ? 1.65 : maxWidth >= 420 ? 1.25 : maxWidth >= 355 ? 1.05 : maxWidth >= 340 ? 1 : maxWidth >= 300 ? 0.9 : 0.8;
    };

    function hideOSD() {
        osd.style.transition = "all 0.15s linear";
        osd.style.top = "-29px";
        osd.style.opacity = 0;
        osdShowing = false;
    }

    this.setDebugMode = function(boo) {
        debugMode = !!boo;
        canvasContext = null;
    };

    this.crtFilterToggle = function() {
        var newLevel = crtFilter + 1; if (newLevel > 3) newLevel = -2;
        setCRTFilter(newLevel);
        var levelDesc = crtFilterEffective === null ? "browser default" : crtFilterEffective < 1 ? "OFF" : "level " + crtFilterEffective;
        this.showOSD("CRT filter: " + (crtFilter === -1 ? "AUTO (" + levelDesc + ")" : levelDesc), true);

        // Persist
        if (Javatari.userPreferences.current.crtFilter !== crtFilter) {
            Javatari.userPreferences.current.crtFilter = crtFilter;
            Javatari.userPreferences.setDirty();
            Javatari.userPreferences.save();
        }
    };

    this.crtFilterSetDefault = function() {
        var value = Javatari.userPreferences.current.crtFilter;
        setCRTFilter(value === null ? Javatari.SCREEN_FILTER_MODE : value);
    };

    this.crtModeToggle = function() {
        var newMode = crtMode + 1; if (newMode > 1) newMode = -1;
        setCRTMode(newMode);
        var effectDesc = crtModeEffective === 1 ? "Phosphor" : "OFF";
        this.showOSD("CRT mode: " + (crtMode === -1 ? "AUTO (" + effectDesc + ")" : effectDesc), true);
    };

    this.crtModeSetDefault = function() {
        setCRTMode(Javatari.SCREEN_CRT_MODE);
    };

    this.displayToggleFullscreen = function() {                 // Only and Always user initiated
        if (FULLSCREEN_MODE === -2) return;

        // If FullScreenAPI supported but not active, enter full screen by API regardless of previous state
        if (fullscreenAPIEnterMethod && !isFullScreenByAPI()) {
            enterFullScreenByAPI();
            return;
        }

        // If not, toggle complete full screen state
        this.setFullscreen(!isFullscreen);
    };

    this.setFullscreen = function(mode) {
        if (fullscreenAPIEnterMethod) {
            if (mode) enterFullScreenByAPI();
            else exitFullScreenByAPI();
        } else
            setFullscreenState(mode)
    };

    this.focus = function() {
        canvas.focus();
    };

    this.consolePowerAndUserPauseStateUpdate = function(power, paused) {
        if (isLoading) power = false;
        powerButton.style.backgroundPosition = "" + powerButton.jtBX + "px " + (mediaButtonBackYOffsets[power ? 2 : 1]) + "px";
        powerButton.jtMenu[0].label = "Power " + (power ? "OFF" : "ON");
        powerButton.jtMenu[1].disabled = powerButton.jtMenu[9].disabled = !power;
    };

    this.cartridgeInserted = function(cart) {
        consolePanel.cartridgeInserted(cart);
    };

    this.controlsModeStateUpdate = function () {
        if(settingsDialog) settingsDialog.controlsModeStateUpdate();
    };

    this.touchControlsActiveUpdate = function(active, dirBig) {
        if (touchControlsActive === active && touchControlsDirBig === dirBig) return;
        touchControlsActive = active;
        touchControlsDirBig = dirBig;
        if (isFullscreen) {
            if (touchControlsActive) consoleControls.setupTouchControlsIfNeeded(fsElementCenter);
            this.requestReadjust(true);
        }
    };

    this.controlStateChanged = function(control, state) {
        consolePanel.controlStateChanged(control, state);
    };

    this.controlsStatesRedefined = function() {
        consolePanel.controlsStatesRedefined();
    };

    this.setLoading = function(state) {
        isLoading = state;
        updateLoading();
    };

    this.requestReadjust = function(now) {
        if (settingsDialog && settingsDialog.isVisible()) settingsDialog.position();
        if (now)
            readjustAll(true);
        else {
            readjustRequestTime = jt.Util.performanceNow();
            if (!readjustInterval) readjustInterval = setInterval(readjustAll, 50);
        }
    };

    function releaseControllersOnLostFocus() {
        consoleControlsSocket.releaseControllers();
    }

    function hideCursorAndBar() {
        hideCursor();
        hideBar();
        cursorHideFrameCountdown = -1;
    }

    function showCursorAndBar(forceBar) {
        showCursor();
        if (forceBar || !mousePointerLocked) showBar();
        cursorHideFrameCountdown = CURSOR_HIDE_FRAMES;
    }

    function showCursor() {
        if (!cursorShowing) {
            fsElement.style.cursor = cursorType;
            cursorShowing = true;
        }
    }

    function hideCursor() {
        if (cursorShowing) {
            fsElement.style.cursor = "none";
            cursorShowing = false;
        }
    }

    function fullscreenByAPIChanged() {
        var prevFSState = isFullscreen;
        var newAPIState = isFullScreenByAPI();

        // Return to window interface mode if user asked or not in standalone mode
        if (newAPIState || fullScreenAPIExitUserRequested || !isBrowserStandalone) setFullscreenState(newAPIState);
        else self.requestReadjust();

        // If console not paused and on mobile, set message to resume, or set event to return to full screen
        if (prevFSState && !newAPIState && !fullScreenAPIExitUserRequested && isMobileDevice) {
            if (isBrowserStandalone) {
                setEnterFullscreenByAPIOnFirstTouch();
            } else {
                atariConsole.systemPause(true);
                showLogoMessage("<br>Emulation suspended", "RESUME", true, function () {
                    self.setFullscreen(true);
                    atariConsole.systemPause(false);
                });
            }
        }

        fullScreenAPIExitUserRequested = false;
    }

    function isFullScreenByAPI() {
        return !!document[fullScreenAPIQueryProp];
    }

    function enterFullScreenByAPI() {
        if (fullscreenAPIEnterMethod) try {
            fullscreenAPIEnterMethod.call(fsElement);
        } catch (e) {
            /* give up */
        }
    }

    function exitFullScreenByAPI() {
        if (fullScreenAPIExitMethod) try {
            fullScreenAPIExitUserRequested = true;
            fullScreenAPIExitMethod.call(document);
        } catch (e) {
            /* give up */
        }
    }

    function updateScale() {
        var canvasWidth = Math.round(targetWidth * scaleY * aspectX * 2);    // Fixed internal aspectX of 2
        var canvasHeight = Math.round(targetHeight * scaleY);
        canvas.style.width = "" + canvasWidth + "px";
        canvas.style.height = "" + canvasHeight + "px";
        updateBarWidth(canvasWidth);
        if (!signalIsOn) updateLogoScale();
        if (settingsDialog && settingsDialog.isVisible()) settingsDialog.position();
        updateConsolePanelScale(canvasWidth);
    }

    function updateBarWidth(canvasWidth) {
        var fixedWidth = buttonsBarDesiredWidth > 0 ? buttonsBarDesiredWidth : canvasWidth;
        buttonsBar.style.width = buttonsBarDesiredWidth === -1 ? "100%" : "" + fixedWidth + "px";
        buttonsBar.classList.toggle("jt-narrow", fixedWidth < NARROW_WIDTH);
    }

    function updateConsolePanelScale(maxWidth) {
        var panelHeight = consolePanel.updateScale(maxWidth, isFullscreen, isLandscape);
        mainElement.style.marginBottom = !isFullscreen && panelHeight > 0
            ? "" + Math.ceil(panelHeight + 3) + "px"
            : "initial";
    }

    function updateCanvasContentSize() {
        var factor = crtFilterEffective > 0 ? CANVAS_SIZE_FACTOR : 1;
        canvas.width = targetWidth * factor;
        canvas.height = targetHeight * factor;
        canvasContext = null;
    }

    function setCRTFilter(level) {
        crtFilter = level;
        crtFilterEffective = crtFilter === -2 ? null : crtFilter === -1 ? crtFilterAutoValue() : level;
        updateCanvasContentSize();
    }

    function crtFilterAutoValue() {
        // Use mode 1 by default (context imageSmoothing OFF and CSS image-rendering set to smooth)
        // iOS browser bug: freezes after some time if imageSmoothing = true. OK if we use the setting above
        // Firefox on Android bug: image looks terrible if imageSmoothing = false. Lets use mode 2 or 3, or let browser default
        return isMobileDevice && !isIOSDevice && browserName === "FIREFOX" ? 0 : 1;
    }

    function setCRTMode(mode) {
        crtMode = mode;
        crtModeEffective = crtMode === -1 ? crtModeAutoValue() : crtMode;
        canvasContext = null;
    }

    function crtModeAutoValue() {
        return isMobileDevice ? 0 : 0;      // 0 : 1;
    }

    function updateLogo() {
        if (!signalIsOn) {
            updateLogoScale();
            showCursorAndBar(true);
            if (canvasContext) canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        }
        logo.classList.toggle("jt-show", !signalIsOn);
    }

    function updateLoading() {
        var disp = isLoading ? "block" : "none";
        logoLoadingIcon.style.display = disp;
        canvasLoadingIcon.style.display = disp;
    }

    function createCanvasContext() {
        // Prepare Context used to draw frame
        canvasContext = canvas.getContext("2d", { alpha: false, antialias: false });
        setImageComposition();
        setImageSmoothing();
    }

    function setImageComposition() {
        if (crtModeEffective > 0 && !debugMode) {
            canvasContext.globalCompositeOperation = "source-over";
            canvasContext.globalAlpha = 0.8;
        } else {
            canvasContext.globalCompositeOperation = "copy";
            canvasContext.globalAlpha = 1;
        }
    }

    function setImageSmoothing() {
        canvas.style.imageRendering = (crtFilterEffective === 0 || crtFilterEffective === 2) ? canvasImageRenderingValue : "initial";

        if (crtFilterEffective === null) return;    // let default values for imageSmoothingEnabled

        var smoothing = crtFilterEffective >= 2;
        if (canvasContext.imageSmoothingEnabled !== undefined)
            canvasContext.imageSmoothingEnabled = smoothing;
        else {
            canvasContext.webkitImageSmoothingEnabled = smoothing;
            canvasContext.mozImageSmoothingEnabled = smoothing;
            canvasContext.msImageSmoothingEnabled = smoothing;
        }
    }

    function suppressContextMenu(element) {
        element.addEventListener("contextmenu", jt.Util.blockEvent);
    }

    function preventDrag(element) {
        element.ondragstart = jt.Util.blockEvent;
    }

    function setupMain() {
        mainElement.innerHTML = jt.ScreenGUI.html();
        mainElement.tabIndex = -1;
        delete jt.ScreenGUI.html;

        fsElement = document.getElementById("jt-screen-fs");
        fsElementCenter = document.getElementById("jt-screen-fs-center");
        canvasOuter = document.getElementById("jt-screen-canvas-outer");
        canvas = document.getElementById("jt-screen-canvas");
        canvasLoadingIcon = document.getElementById("jt-canvas-loading-icon");
        osd = document.getElementById("jt-osd");
        logo = document.getElementById("jt-logo");
        logoCenter = document.getElementById("jt-logo-center");
        logoImage = document.getElementById("jt-logo-image");
        logoLoadingIcon = document.getElementById("jt-logo-loading-icon");
        logoMessage = document.getElementById("jt-logo-message");
        logoMessageText = document.getElementById("jt-logo-message-text");
        logoMessageOK = document.getElementById("jt-logo-message-ok");
        logoMessageOKText = document.getElementById("jt-logo-message-ok-text");
        scrollMessage = document.getElementById("jt-screen-scroll-message");
        consolePanelElement = document.getElementById("jt-console-panel");

        suppressContextMenu(mainElement);
        preventDrag(logoImage);
        preventDrag(logoLoadingIcon);
        preventDrag(canvasLoadingIcon);

        updateCanvasContentSize();

        // Try to determine correct value for image-rendering for the canvas filter modes
        switch (browserName) {
            case "CHROME":
            case "EDGE":
            case "OPERA":   canvasImageRenderingValue = "pixelated"; break;
            case "FIREFOX": canvasImageRenderingValue = "-moz-crisp-edges"; break;
            case "SAFARI":  canvasImageRenderingValue = "-webkit-optimize-contrast"; break;
            default:        canvasImageRenderingValue = "pixelated";
        }
        setupMainEvents();
    }

    function setupMainEvents() {
        (isMobileDevice ? canvasOuter : fsElement).addEventListener("mousemove", function showCursorOnMouseMove() {
            showCursorAndBar();
        });

        if ("onblur" in document) fsElement.addEventListener("blur", releaseControllersOnLostFocus, true);
        else fsElement.addEventListener("focusout", releaseControllersOnLostFocus, true);

        window.addEventListener("orientationchange", function orientationChanged() {
            closeAllOverlays();
            if (signalIsOn) hideCursorAndBar();
            else showCursorAndBar();
            self.requestReadjust();
        });

        mainElement.addEventListener("drop", closeAllOverlays, true);

        logoMessageOK.jtNeedsUIG = logoMessageOKText.jtNeedsUIG = true;     // User Initiated Gesture required
        jt.Util.onTapOrMouseDownWithBlockUIG(logoMessageOK, function(e) {
            consoleControls.hapticFeedbackOnTouch(e);
            self.closeLogoMessage();
        });

        // Used to show bar and close overlays and modals if not processed by any other function
        jt.Util.addEventsListener(fsElementCenter, "touchstart touchend mousedown", function backScreenTouched(e) {
            if (e.type !== "touchend") {                            // Execute actions only tor touchstart or mousedown
                closeAllOverlays();
                showCursorAndBar();
            } else
                if (e.cancelable) e.preventDefault();               // preventDefault only on touchend to avoid redundant mousedown ater a touchstart
        });
    }

    function setupBar() {
        buttonsBar = document.getElementById("jt-bar");
        buttonsBarInner = document.getElementById("jt-bar-inner");

        if (BAR_AUTO_HIDE) {
            document.documentElement.classList.add("jt-bar-auto-hide");
            fsElement.addEventListener("mouseleave", hideBar);
            hideBar();
        }

        var menu = [
            { label: "Power",              clickModif: 0, control: jt.PeripheralControls.MACHINE_POWER_TOGGLE },
            { label: "Fry Console",                       control: jt.PeripheralControls.MACHINE_POWER_FRY },
            { label: "",                   divider: true },
            { label: "Select Cartridge",                  control: jt.PeripheralControls.CARTRIDGE_LOAD_RECENT },
            { label: "",                   divider: true },
            { label: "Open File",          clickModif: KEY_CTRL_MASK, control: jt.PeripheralControls.AUTO_LOAD_FILE, needsUIG: true },
            { label: "Open URL",           clickModif: KEY_CTRL_MASK | KEY_ALT_MASK, control: jt.PeripheralControls.AUTO_LOAD_URL, needsUIG: true },
            { label: "",                   divider: true },
            { label: "Load State",                        control: jt.PeripheralControls.MACHINE_LOAD_STATE_MENU },
            { label: "Save State",                        control: jt.PeripheralControls.MACHINE_SAVE_STATE_MENU }
        ];
        powerButton = addBarButton("jt-bar-power", -5, -26, "System Power", null, false, menu, "System");
        barMenuSystem = menu;
        self.consolePowerAndUserPauseStateUpdate(false, false);     // init states

        if (!isMobileDevice) {
            menu = [
                { label: "Help & Settings", clickModif: 0, control: jt.PeripheralControls.SCREEN_OPEN_SETTINGS },
                { label: "Quick Options",                  control: jt.PeripheralControls.SCREEN_OPEN_QUICK_OPTIONS },
                { label: "Defaults",                       control: jt.PeripheralControls.SCREEN_DEFAULTS/*,          fullScreenHidden: true*/ }
            ];
            settingsButton = addBarButton("jt-bar-settings", -33, -26, "Settings", null, false, menu, "Settings");
        } else {
            settingsButton = addBarButton("jt-bar-settings", -33, -26, "Quick Options", jt.PeripheralControls.SCREEN_OPEN_QUICK_OPTIONS, false);
        }

        gameSelectButton = addBarButton("jt-bar-select", -78, -51, "Game Select", jt.ConsoleControls.SELECT, true);
        gameResetButton = addBarButton("jt-bar-reset", -33, -51, "Game Reset", jt.ConsoleControls.RESET, true);

        if (FULLSCREEN_MODE !== -2) {
            fullscreenButton = addBarButton("jt-bar-full-screen", -103, -1, "Full Screen", jt.PeripheralControls.SCREEN_FULLSCREEN, false);
            fullscreenButton.jtNeedsUIG = true;
            if (isMobileDevice) fullscreenButton.classList.add("jt-mobile");
        }

        if (!Javatari.SCREEN_RESIZE_DISABLED && !isMobileDevice) {
            scaleUpButton = addBarButton("jt-bar-scale-plus", -80, -1, "Increase Screen", jt.PeripheralControls.SCREEN_SCALE_PLUS, false);
            scaleUpButton.classList.add("jt-full-screen-hidden");
            scaleDownButton = addBarButton("jt-bar-scale-minus", -58, -1, "Decrease Screen", jt.PeripheralControls.SCREEN_SCALE_MINUS, false);
            scaleDownButton.classList.add("jt-full-screen-hidden");
        }

        var consolePanelButton = addBarButton("jt-bar-console-panel", -61, -25, "Toggle Console Panel", jt.PeripheralControls.SCREEN_CONSOLE_PANEL_TOGGLE, false);
        consolePanelButton.classList.add("jt-full-screen-only");

        logoButton = addBarButton("jt-bar-logo", -99, -26, "About Javatari", jt.PeripheralControls.SCREEN_OPEN_ABOUT, false);
        logoButton.classList.add("jt-full-screen-hidden");

        // Events for BarButtons and also MenuItems
        jt.Util.onTapOrMouseDownWithBlockUIG(buttonsBar, barElementTapOrMouseDown);
        jt.Util.addEventsListener(buttonsBar, "touchmove", barElementTouchMove);
        jt.Util.addEventsListener(buttonsBar, "mouseup touchend", barElementTouchEndOrMouseUp);
    }

    function addBarButton(id, bx, by, tooltip, control, isConsoleControl, menu, menuTitle) {
        var but = document.createElement('div');
        but.id = id;
        but.classList.add("jt-bar-button");
        but.jtBarElementType = 1;     // Bar button
        but.jtControl = control;
        but.jtIsConsoleControl = isConsoleControl;
        but.style.backgroundPosition = "" + bx + "px " + by + "px";
        but.jtBX = bx;
        if (menu) {
            but.jtMenu = menu;
            menu.jtTitle = menuTitle;
            menu.jtRefElement = but;
            menu.jtMenuIndex = barMenus.length;
            barMenus.push(menu);
        }
        if (tooltip) but.title = tooltip;

        // Mouse hover button
        but.addEventListener("mouseenter", function(e) { barButtonHoverOver(e.target, e); });
        // Mouse left button (only for ConsoleControls)
        if (isConsoleControl) but.addEventListener("mouseleave", barButtonMouseLeft);

        buttonsBarInner.appendChild(but);
        return but;
    }

    function barButtonTapOrMousedown(elem, e) {
        if (logoMessageActive) return;

        consoleControls.hapticFeedbackOnTouch(e);

        var prevActiveMenu = barMenuActive;
        closeAllOverlays();

        // Single option, only left click
        if (elem.jtControl) {
            if (!e.button) {
                if (elem.jtIsConsoleControl) {
                    barConsoleControlPressed = elem.jtControl;
                    consoleControlsSocket.controlStateChanged(barConsoleControlPressed, true);
                } else
                    peripheralControls.controlActivated(elem.jtControl);
            }
            return;
        }

        var menu = elem.jtMenu;
        if (!menu) return;

        var modifs = 0 | (e.altKey && KEY_ALT_MASK) | (e.ctrlKey && KEY_CTRL_MASK) | (e.shiftKey && KEY_SHIFT_MASK);

        // Open/close menu with left-click if no modifiers
        if (modifs === 0 && !e.button) {
            if (prevActiveMenu !== menu) {
                showBarMenu(menu);
                // Only start LongTouch for touches!
                if (e.type === "touchstart") barButtonLongTouchStart(e);
            }
            return;
        }

        // Modifier options for left, middle or right click
        for (var i = 0; i < menu.length; ++i)
            if (menu[i].clickModif === modifs) {
                peripheralControls.controlActivated(menu[i].control, e.button === 1, menu[i].secSlot);         // altPower for middleClick (button === 1)
                return;
            }
        // If no direct shortcut found with modifiers used, use SHIFT as secSlot modifier and try again
        if (modifs & KEY_SHIFT_MASK) {
            modifs &= ~KEY_SHIFT_MASK;
            for (i = 0; i < menu.length; ++i)
                if (menu[i].clickModif === modifs) {
                    peripheralControls.controlActivated(menu[i].control, e.button === 1, true);               // altPower for middleClick (button === 1)
                    return;
                }
        }
    }

    function barButtonLongTouchStart(e) {
        barButtonLongTouchTarget = e.target;
        barButtonLongTouchSelectTimeout = window.setTimeout(function buttonsBarLongTouchSelectDefault() {
            if (!barMenuActive) return;
            var items = barMenu.jtItems;
            for (var i = 0; i < items.length; ++i) {
                var option = items[i].jtMenuOption;
                if (option && option.clickModif === 0) {
                    barMenuItemSetActive(items[i], true);
                    return;
                }}
        }, 450);
    }

    function barButtonLongTouchCancel() {
        if (barButtonLongTouchSelectTimeout) {
            clearTimeout(barButtonLongTouchSelectTimeout);
            barButtonLongTouchSelectTimeout = null;
        }
    }

    function barButtonHoverOver(elem, e) {
        if (barMenuActive && elem.jtMenu && barMenuActive !== elem.jtMenu ) {
            consoleControls.hapticFeedbackOnTouch(e);
            showBarMenu(elem.jtMenu);
        }
    }

    function barButtonMouseLeft() {
        if (barConsoleControlPressed) {
            cursorHideFrameCountdown = CURSOR_HIDE_FRAMES;
            consoleControlsSocket.controlStateChanged(barConsoleControlPressed, false);
            barConsoleControlPressed = null;
        }
    }

    function barButtonTouchEndOrMouseUp(e) {
        if (logoMessageActive) return;
        // Special case for ConsoleControl
        if (barConsoleControlPressed) {
            consoleControls.hapticFeedbackOnTouch(e);
            consoleControlsSocket.controlStateChanged(barConsoleControlPressed, false);
            barConsoleControlPressed = null;
            return;
        }
        // Only touch, left or middle button
        if (barMenuItemActive && !(e.button > 1)) barMenuItemFireActive(e.shiftKey, e.button === 1 || e.ctrlKey);
    }

    function barMenuItemTapOrMouseDown(elem, e) {
        barMenuItemSetActive(elem, e.type === "touchstart");
    }

    function barMenuItemHoverOver(elem, e) {
        barMenuItemSetActive(elem, e.type === "touchmove");
    }

    function barMenuItemHoverOut() {
        barMenuItemSetActive(null);
    }

    function barMenuItemTouchEndOrMouseUp(e) {
        if (logoMessageActive) return;
        // Only touch, left or middle button
        if (barMenuItemActive && !(e.button > 1)) barMenuItemFireActive(e.shiftKey, e.button === 1 || e.ctrlKey);
    }

    function barMenuItemFireActive(secSlot, altPower) {
        var option = barMenuItemActive.jtMenuOption;
        barMenuItemSetActive(null);
        if (option && !option.disabled) {
            if (option.extension) {
                extensionsSocket.toggleExtension(option.extension, altPower, secSlot);
            } else if (option.control) {
                secSlot |= option.secSlot;
                closeAllOverlays();
                peripheralControls.controlActivated(option.control, altPower, secSlot);
            }
        }
    }

    function barMenuItemSetActive(element, haptic) {
        if (element === barMenuItemActive) return;
        if (barMenuItemActive) barMenuItemActive.classList.remove("jt-hover");
        if (element && element.jtMenuOption) {
            barMenuItemActive = element;
            if (haptic) consoleControls.hapticFeedback();
            barMenuItemActive.classList.add("jt-hover");
        } else
            barMenuItemActive = null;
    }

    function barElementTapOrMouseDown(e) {
        cursorHideFrameCountdown = CURSOR_HIDE_FRAMES;
        var elem = e.target;
        if (elem.jtBarElementType === 1) barButtonTapOrMousedown(elem, e);
        else if (elem.jtBarElementType === 2) barMenuItemTapOrMouseDown(elem, e);
        else hideBarMenu();
    }

    function barElementTouchMove(e) {
        jt.Util.blockEvent(e);
        var t = e.changedTouches[0];
        var elem = t && document.elementFromPoint(t.clientX, t.clientY);
        if (barButtonLongTouchTarget && elem !== barButtonLongTouchTarget) barButtonLongTouchCancel();
        if (elem.jtBarElementType !== 2 && elem !== barButtonLongTouchTarget) barMenuItemSetActive(null);
        if (elem.jtBarElementType === 1) barButtonHoverOver(elem, e);
        else if (elem.jtBarElementType === 2) barMenuItemHoverOver(elem, e);

    }

    function barElementTouchEndOrMouseUp(e) {
        cursorHideFrameCountdown = CURSOR_HIDE_FRAMES;
        jt.Util.blockEvent(e);
        barButtonLongTouchCancel();
        var elem = e.target;
        if (elem.jtBarElementType === 1) barButtonTouchEndOrMouseUp(e);
        else if (elem.jtBarElementType === 2) barMenuItemTouchEndOrMouseUp(e);
    }

    function setupFullscreen() {
        fullscreenAPIEnterMethod = fsElement.requestFullscreen || fsElement.webkitRequestFullscreen || fsElement.webkitRequestFullScreen || fsElement.mozRequestFullScreen;
        fullScreenAPIExitMethod =  document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
        if ("fullscreenElement" in document) fullScreenAPIQueryProp = "fullscreenElement";
        else if ("webkitFullscreenElement" in document) fullScreenAPIQueryProp = "webkitFullscreenElement";
        else if ("mozFullScreenElement" in document) fullScreenAPIQueryProp = "mozFullScreenElement";

        if (!fullscreenAPIEnterMethod && isMobileDevice && !isBrowserStandalone) fullScreenScrollHack = true;

        if ("onfullscreenchange" in document)            document.addEventListener("fullscreenchange", fullscreenByAPIChanged);
        else if ("onwebkitfullscreenchange" in document) document.addEventListener("webkitfullscreenchange", fullscreenByAPIChanged);
        else if ("onmozfullscreenchange" in document)    document.addEventListener("mozfullscreenchange", fullscreenByAPIChanged);

        // Prevent scroll & zoom in fullscreen if not touching on the screen (canvas) or scroll message in hack mode
        if (!fullscreenAPIEnterMethod) {
            scrollMessage.jtScroll = canvas.jtScroll = logo.jtScroll = logoCenter.jtScroll = logoImage.jtScroll =
                logoMessage.jtScroll = logoMessageText.jtScroll = logoMessageOK.jtScroll = logoMessageOKText.jtScroll = true;

            fsElement.addEventListener("touchmove", function preventTouchMoveInFullscreenByHack(e) {
                if (isFullscreen) {
                    if (!fullScreenScrollHack || !e.target.jtScroll)
                        return jt.Util.blockEvent(e);
                    else
                        if (scrollMessageActive) setScrollMessage(false);
                }
            });
        }
    }

    function setEnterFullscreenByAPIOnFirstTouch() {
        // Add event to enter in real fullScreenByAPI on first touch/click if possible
        if (fullscreenAPIEnterMethod) {
            var done = false;
            var enterFullScreenByAPIonFirstTouch = function() {
                if (done) return;
                done = true;
                jt.Util.removeEventsListener(fsElement, "touchend mousedown", enterFullScreenByAPIonFirstTouch, true);
                enterFullScreenByAPI();
            };
            jt.Util.addEventsListener(fsElement, "touchend mousedown", enterFullScreenByAPIonFirstTouch, true);    // Capture!
        }
    }

    function setFullscreenState(mode) {
        isFullscreen = mode;

        if (mode) {
            setViewport();
            document.documentElement.classList.add("jt-full-screen");
            if (fullScreenScrollHack) document.documentElement.classList.add("jt-full-screen-scroll-hack");
            consoleControls.setupTouchControlsIfNeeded(fsElementCenter);
            if (fullScreenScrollHack) setScrollMessage(true);
            if (!fullscreenAPIEnterMethod) tryToFixSafariBugOnFullScreenChange();
        } else {
            restoreViewport();
            document.documentElement.classList.remove("jt-full-screen");
            if (fullScreenScrollHack) document.documentElement.classList.remove("jt-full-screen-scroll-hack");
            if (!fullscreenAPIEnterMethod) tryToFixSafariBugOnFullScreenChange();
        }

        self.requestReadjust();
    }

    function tryToFixSafariBugOnFullScreenChange() {
        // Toggle a dummy element existence inside mainElement to try to force a reflow
        var dummy = document.getElementById("jt-dummy-element");
        if (dummy) {
            mainElement.removeChild(dummy);
        } else {
            dummy = document.createElement("div");
            dummy.id = "jt-dummy-element";
            mainElement.appendChild(dummy);
        }
    }

    function showBar() {
        buttonsBar.classList.remove("jt-hidden");
    }

    function hideBar() {
        if ((BAR_AUTO_HIDE || isFullscreen) && !barMenuActive && !consolePanelActive && !barConsoleControlPressed) {
            hideBarMenu();
            buttonsBar.classList.add("jt-hidden");
        }
    }

    function showBarMenu(menu, select) {
        if (!menu || barMenuActive === menu) return;

        if (!barMenu) {
            setupBarMenu();
            setTimeout(function() {
                showBarMenu(menu, select);
            }, 1);
            return;
        }

        // Define items
        refreshBarMenu(menu);
        barMenuItemSetActive(select ? barMenu.jtDefaultItem : null);

        // Position
        var refElement = menu.jtRefElement;
        var p = (refElement && (refElement.offsetLeft - 15)) || 0;
        if (p + jt.ScreenGUI.BAR_MENU_WIDTH > refElement.parentElement.clientWidth) {
            barMenu.style.right = 0;
            barMenu.style.left = "auto";
            barMenu.style.transformOrigin = "bottom right";
        } else {
            if (p < 0) p = 0;
            barMenu.style.left = "" + p + "px";
            barMenu.style.right = "auto";
            barMenu.style.transformOrigin = "bottom left";
        }

        // Show
        showCursorAndBar(true);
        barMenuActive = menu;
        barMenu.style.display = "inline-block";
        barMenu.jtTitle.focus();
    }

    function refreshBarMenu(menu) {
        barMenu.jtTitle.innerHTML = menu.jtTitle;
        barMenu.jtDefaultItem = null;

        var it = 0;
        var item;
        var maxShown = Math.min(menu.length, BAR_MENU_MAX_ITEMS);
        var h = jt.ScreenGUI.BAR_MENU_ITEM_HEIGHT + 3;         // title + borders

        for (var op = 0; op < maxShown; ++op) {
            var option = menu[op];
            if (option.label !== undefined) {
                item = barMenu.jtItems[it];
                item.firstChild.textContent = option.label;
                item.jtMenuOption = null;

                if (option.hidden || (isFullscreen && option.fullScreenHidden) || (!isFullscreen && option.fullScreenOnly)) {
                    item.style.display = "none";
                } else {
                    item.style.display = "block";

                    // Divider?
                    if (option.divider) {
                        item.classList.add("jt-bar-menu-item-divider");
                    } else {
                        item.classList.remove("jt-bar-menu-item-divider");
                        h += jt.ScreenGUI.BAR_MENU_ITEM_HEIGHT;   // each non-divider item

                        // Toggle
                        item.classList.toggle("jt-bar-menu-item-toggle", option.toggle !== undefined);

                        // Disabled?
                        if (option.disabled) {
                            item.classList.add("jt-bar-menu-item-disabled");
                        } else {
                            item.classList.remove("jt-bar-menu-item-disabled");

                            item.jtMenuOption = option;
                            if (option.clickModif === 0) barMenu.jtDefaultItem = item;    // If option is the default, set this item to be selected as default

                            // User Generated Gesture needed?
                            item.jtNeedsUIG = option.needsUIG;

                            // Toggle checked
                             if (option.toggle !== undefined) item.classList.toggle("jt-bar-menu-item-toggle-checked", !!option.checked);
                        }
                    }
                }

                ++it;
            }
        }
        for (var r = it; r < BAR_MENU_MAX_ITEMS; ++r) {
            item = barMenu.jtItems[r];
            item.firstChild.textContent = "";
            item.style.display = "none";
            item.jtMenuOption = null;
        }

        var height = fsElementCenter.clientHeight - jt.ScreenGUI.BAR_HEIGHT - 8;      // bar + borders + tolerance
        var scale = h < height ? 1 : height / h;
        if (barMenu) barMenu.style.transform = "scale(" + scale.toFixed(4) + ")";

        //console.error("MESSAGE SCALE height: " + height + ", h: " + h);
    }

    function hideBarMenu() {
        if (!barMenuActive) return;

        barMenuActive = null;
        barMenu.style.display = "none";
        barMenuItemSetActive(null);
        cursorHideFrameCountdown = CURSOR_HIDE_FRAMES;
        self.focus();
    }

    function setupBarMenu() {
        barMenu = document.createElement('div');
        barMenu.id = "jt-bar-menu";

        var inner = document.createElement('div');
        inner.id = "jt-bar-menu-inner";
        barMenu.appendChild(inner);

        var title = document.createElement('div');
        title.id = "jt-bar-menu-title";
        title.tabIndex = -1;
        title.innerHTML = "Menu Title";
        inner.appendChild(title);
        barMenu.jtTitle = title;

        barMenu.jtItems = new Array(BAR_MENU_MAX_ITEMS);
        for (var i = 0; i < BAR_MENU_MAX_ITEMS; ++i) {
            var item = document.createElement('div');
            item.classList.add("jt-bar-menu-item");
            item.style.display = "none";
            item.innerHTML = "Menu Item " + i;
            item.jtBarElementType = 2;     // Menu Item
            item.jtItemIndex = i;
            item.addEventListener("mouseenter", function (e) { barMenuItemHoverOver(e.target, e); });
            item.addEventListener("mouseleave", barMenuItemHoverOut);
            inner.appendChild(item);
            barMenu.jtItems[i] = item;
        }

        // Block keys and respond to some
        barMenu.addEventListener("keydown", function(e) {
            // Hide
            if (MENU_CLOSE_KEYS[e.keyCode]) hideBarMenu();
            // Execute
            else if (barMenuItemActive && MENU_EXEC_KEYS[e.keyCode & ~KEY_SHIFT_MASK & ~KEY_CTRL_MASK]) barMenuItemFireActive(e.shiftKey, e.ctrlKey);
            // Select Menu
            else if (MENU_SELECT_KEYS[e.keyCode]) {
                if (!barMenuActive) return;
                var newMenu = (barMenus.length + barMenuActive.jtMenuIndex + MENU_SELECT_KEYS[e.keyCode]) % barMenus.length;
                showBarMenu(barMenus[newMenu], true);
            }
            // Select Item
            else if (MENU_ITEM_SELECT_KEYS[e.keyCode]) {
                var items = barMenu.jtItems;
                var newItem = barMenuItemActive ? barMenuItemActive.jtItemIndex : -1;
                var tries = BAR_MENU_MAX_ITEMS + 1;
                do {
                    newItem = (newItem + items.length + MENU_ITEM_SELECT_KEYS[e.keyCode]) % items.length;
                } while (--tries >= 0 && !items[newItem].jtMenuOption);
                if (tries >= 0) barMenuItemSetActive(items[newItem]);
            }
            return jt.Util.blockEvent(e);
        });

        buttonsBar.appendChild(barMenu);
    }

    function closeAllOverlays() {
        hideBarMenu();
        if (saveStateDialog) saveStateDialog.hide();
        if (quickOtionsDialog) quickOtionsDialog.hide();
        if (settingsDialog) settingsDialog.hide();
        if (recentROMsDialog) recentROMsDialog.hide();
    }
    this.closeAllOverlays = closeAllOverlays;

    function showLogoMessage(mes, button, higherButton, afterAction) {
        consolePanel.setLogoMessageActive(true);
        if (logoMessageActive) return;

        closeAllOverlays();
        if (afterAction) afterMessageAction = afterAction;
        logoMessageText.innerHTML = mes;
        logoMessageOK.classList.toggle("jt-higher", !!higherButton);
        logoMessageOKText.innerHTML = button || "OK";
        fsElement.classList.add("jt-logo-message-active");
        logoMessageActive = true;

        signalIsOn = false;
        updateLogo();
    }

    this.closeLogoMessage = function() {
        consolePanel.setLogoMessageActive(false);
        fsElement.classList.remove("jt-logo-message-active");
        logoMessageActive = false;
        if (afterMessageAction) {
            var action = afterMessageAction;
            afterMessageAction = null;
            action();
        }
    };

    function updateLogoScale() {
        var width = canvasOuter.clientWidth;
        var scale = Math.min(width / jt.ScreenGUI.LOGO_SCREEN_WIDTH, 1);
        if (scale < 1)
            logoCenter.style.transform = "translate(-50%, -50%) scale(" + scale.toFixed(4) + ")";
        else
            logoCenter.style.transform = "translate(-50%, -50%)";
    }

    function setScrollMessage(state) {

        console.error("Scroll Message: " + state);

        fsElement.classList.toggle("jt-scroll-message", state);
        scrollMessageActive = state;
        if (state) {
            setTimeout(function() {
                setScrollMessage(false);
            }, 5000);
        }
    }

    function readjustAll(force) {
        if (isReadjustScreeSizeChanged(force)) {
            if (isFullscreen) {
                buttonsBarDesiredWidth = isLandscape ? 0 : -1;
                var winH = readjustScreenSize.h;
                if (!isLandscape) winH -= jt.ScreenGUI.BAR_HEIGHT + 2;
                monitor.displayScale(aspectX, displayOptimalScaleY(readjustScreenSize.w, winH));
            } else {
                buttonsBarDesiredWidth = -1;
                monitor.displayScale(Javatari.SCREEN_DEFAULT_ASPECT, self.displayDefaultScale());
            }

            self.focus();
            consolePanelUpdateForOrientation();
            consoleControlsSocket.releaseControllers();

            //console.log("READJUST");
        }

        if (readjustInterval && (jt.Util.performanceNow() - readjustRequestTime >= 1000)) {
            clearInterval(readjustInterval);
            readjustInterval = null;
            //console.log("READJUST TERMINATED");
        }
    }

    function isReadjustScreeSizeChanged(force) {
        var parW = mainElement.parentElement.clientWidth;
        var winW = fsElementCenter.clientWidth;
        var winH = fsElementCenter.clientHeight;

        if (!force && readjustScreenSize.pw === parW && readjustScreenSize.w === winW && readjustScreenSize.h === winH)
            return false;

        readjustScreenSize.pw = parW;
        readjustScreenSize.w = winW;
        readjustScreenSize.h = winH;
        isLandscape = winW > winH;
        return true;
    }

    function displayOptimalScaleY(maxWidth, maxHeight) {
        var effectiveScaleX = aspectX * 2;      // Fixed internal aspectX of 2
        var scY = maxHeight / targetHeight;
        if (targetWidth * effectiveScaleX * scY > maxWidth)
            scY = maxWidth / (targetWidth * effectiveScaleX);
        return scY;
    }

    function setViewport() {
        if (!isMobileDevice) return;

        if (viewPortOriginalContent === undefined) {    // store only once!
            viewPortOriginalTag = document.querySelector("meta[name=viewport]");
            viewPortOriginalContent = (viewPortOriginalTag && viewPortOriginalTag.content) || null;
        }

        if (!viewportTag) {
            viewportTag = document.createElement('meta');
            viewportTag.name = "viewport";
            // Android Firefox bug (as of 11/2016). Going back and forth from full-screen makes scale all wrong. Set user-scalable = yes to let user correct it in full-screen :-(
            viewportTag.content = "width = device-width, height = device-height, initial-scale = 1.0, minimum-scale = 1.0, maximum-scale = 1.0, user-scalable = yes";
            document.head.appendChild(viewportTag);
        }

        if (viewPortOriginalTag) try { document.head.removeChild(viewPortOriginalTag); } catch (e) { /* ignore */ }
        viewPortOriginalTag = null;
    }

    function restoreViewport() {
        if (!isMobileDevice) return;

        if (!viewPortOriginalTag && viewPortOriginalContent) {
            viewPortOriginalTag = document.createElement('meta');
            viewPortOriginalTag.name = "viewport";
            viewPortOriginalTag.content = viewPortOriginalContent;
            document.head.appendChild(viewPortOriginalTag);
        }

        if (viewportTag) try { document.head.removeChild(viewportTag); } catch (e) { /* ignore */ }
        viewportTag = null;
    }

    function setPageVisibilityHandling() {
        var wasUnpaused;
        function visibilityChange() {
            if (logoMessageActive) return;

            if (document.hidden) {
                wasUnpaused = !atariConsole.systemPause(true);
            } else {
                if (wasUnpaused) atariConsole.systemPause(false);
            }
        }
        document.addEventListener("visibilitychange", visibilityChange);
    }


    var afterMessageAction;

    var atariConsole;
    var consoleControlsSocket;

    var monitor;
    var peripheralControls;
    var fileLoader;
    var fileDownloader;
    var consoleControls;
    var cartridgeSocket;
    var stateMedia;
    var recentROMs;

    var readjustInterval = 0, readjustRequestTime = 0;
    var readjustScreenSize = { w: 0, wk: 0, h: 0, pw: 0, l: false };

    var isFullscreen = false, isLandscape = false;

    var isTouchDevice = jt.Util.isTouchDevice();
    var isMobileDevice = jt.Util.isMobileDevice();
    var isIOSDevice = jt.Util.isIOSDevice();
    var isBrowserStandalone = jt.Util.isBrowserStandaloneMode();
    var browserName = jt.Util.browserInfo().name;

    var fullscreenAPIEnterMethod, fullScreenAPIExitMethod, fullScreenAPIQueryProp, fullScreenAPIExitUserRequested = false, fullScreenScrollHack = false;
    var viewportTag, viewPortOriginalTag, viewPortOriginalContent;

    var consolePanel;
    var consolePanelElement;
    var settingsDialog;
    var saveStateDialog;
    var recentROMsDialog;
    var quickOtionsDialog;

    var fsElement, fsElementCenter;

    var canvas, canvasOuter, canvasLoadingIcon;
    var canvasContext;
    var canvasImageRenderingValue;

    var touchControlsActive = false, touchControlsDirBig = false;
    var consolePanelActive = false;
    var consolePanelActiveLandscape = false;
    var consolePanelActivePortrait = jt.ConsolePanel.shouldStartActive();

    var buttonsBar, buttonsBarInner, buttonsBarDesiredWidth = -1;       // 0 = same as canvas. -1 means full width mode (100%)
    var barButtonLongTouchTarget, barButtonLongTouchSelectTimeout;

    var barMenu;
    var barMenus = [], barMenuActive, barMenuItemActive, barMenuSystem;
    var barConsoleControlPressed;

    var osd;
    var osdTimeout;
    var osdShowing = false;

    var cursorType = "auto";
    var cursorShowing = true;
    var cursorHideFrameCountdown = -1;
    var signalIsOn = false;
    var crtFilter = -2, crtFilterEffective = null;
    var crtMode = -1, crtModeEffective = 0;
    var debugMode = false;
    var isLoading = false;

    var aspectX = Javatari.SCREEN_DEFAULT_ASPECT;
    var scaleY = 1.0;

    var mousePointerLocked = false;

    var targetWidth = 160;
    var targetHeight = 213;

    var logo, logoCenter, logoImage, logoMessage, logoMessageText, logoMessageOK, logoMessageOKText, logoMessageActive = false;
    var logoLoadingIcon;
    var scrollMessage, scrollMessageActive = false;

    var powerButton;
    var logoButton;
    var scaleDownButton;
    var scaleUpButton;
    var fullscreenButton;
    var settingsButton;
    var gameSelectButton;
    var gameResetButton;

    var mediaButtonBackYOffsets = [-51, -26, -1];

    var CANVAS_SIZE_FACTOR = Javatari.SCREEN_CANVAS_SIZE;

    var OSD_TIME = 3000;
    var CURSOR_HIDE_FRAMES = 180;

    var FULLSCREEN_MODE = Javatari.SCREEN_FULLSCREEN_MODE;

    var BAR_AUTO_HIDE = Javatari.SCREEN_CONTROL_BAR === 0;
    var BAR_MENU_MAX_ITEMS = 10;

    var NARROW_WIDTH = 336;

    var k = jt.DOMKeys;
    var KEY_CTRL_MASK  =  k.CONTROL;
    var KEY_ALT_MASK   =  k.ALT;
    var KEY_SHIFT_MASK =  k.SHIFT;

    var MENU_CLOSE_KEYS = {}; MENU_CLOSE_KEYS[k.VK_ESCAPE.c] = 1; MENU_CLOSE_KEYS[k.VK_CONTEXT.c] = 1;
    var MENU_EXEC_KEYS = {}; MENU_EXEC_KEYS[k.VK_ENTER.c] = 1; MENU_EXEC_KEYS[k.VK_SPACE.c] = 1;
    var MENU_SELECT_KEYS = {}; MENU_SELECT_KEYS[k.VK_LEFT.c] = -1; MENU_SELECT_KEYS[k.VK_RIGHT.c] = 1;
    var MENU_ITEM_SELECT_KEYS = {}; MENU_ITEM_SELECT_KEYS[k.VK_UP.c] = -1; MENU_ITEM_SELECT_KEYS[k.VK_DOWN.c] = 1;


    init();

    this.eval = function(str) {
        return eval(str);
    };

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.RecentROMsDialog = function(mainElement, screen, recentROMs, fileLoader) {
"use strict";

    var self = this;

    this.show = function (pSave) {
        if (!dialog) {
            create();
            return setTimeout(function() {
                self.show(pSave);
            }, 0);
        }

        items = recentROMs.getCatalog().slice();        // clone
        items.sort(function (a, b) { return a.n > b.n; });
        var last = recentROMs.lastROMLoadedIndex;
        last = items.indexOf(items.find(function(r) { return r.i === last; }));
        itemSelected = last < 0 || last >= items.length ? items.length : last;

        visible = true;
        refreshList();
        dialog.classList.add("jt-show");
        dialog.focus();

        var availHeight = mainElement.clientHeight - jt.ScreenGUI.BAR_HEIGHT - 20;      //  bar - tolerance
        var height = dialog.clientHeight;
        var scale = height < availHeight ? 1 : availHeight / height;
        dialog.style.transform = "translateY(-" + ((jt.ScreenGUI.BAR_HEIGHT / 2) | 0) + "px) scale(" + scale.toFixed(4) + ")";

        //console.error("OPEN RECENT availHeight: " + availHeight + ", height: " + height + ", final: " + height * scale);
    };

    this.hide = function (confirm) {
        if (!visible) return;
        dialog.classList.remove("jt-show");
        visible = false;
        Javatari.room.screen.focus();
        if (confirm) {
            if (itemSelected === items.length)
                screen.openLoadFileDialog();
            else {
                var rom = recentROMs.getROM(items[itemSelected].i);
                fileLoader.loadROM(rom);
            }
        }
    };

    function refreshList() {
        dialog.style.height = "" + (42 + (items.length + 1) * 33) + "px";

        for (var i = 0; i < 11; ++i) {                               // 10 + 1 for Open File option
            var li = listItems[i];
            var item = items[i];
            li.classList.toggle("jt-visible", i <= items.length);
            li.classList.toggle("jt-toggle", i < items.length);
            li.classList.toggle("jt-toggle-checked", i < items.length);
            li.jtNeedsUIG = i === items.length;                      // Open file
            li.innerHTML = item ? item.n : "&nbsp;&nbsp;Open ROM File...";
        }
        refreshListSelection();
    }

    function refreshListSelection() {
        for (var i = 0; i < listItems.length; ++i)
            listItems[i].classList.toggle("jt-selected", i === itemSelected);
    }

    function create() {
        dialog = document.createElement("div");
        dialog.id = "jt-recent-roms";
        dialog.classList.add("jt-select-dialog");
        dialog.style.width = "350px";
        dialog.tabIndex = -1;

        dialog.appendChild(document.createTextNode("Select Cartridge"));

        // Define list
        list = document.createElement('ul');
        list.style.width = "85%";

        for (var i = 0; i < 11; ++i) {
            var li = document.createElement("li");
            li.style.textAlign = "center";
            li.innerHTML = "";
            li.jtItem = i;
            listItems.push(li);
            list.appendChild(li);
        }
        dialog.appendChild(list);

        setupEvents();

        mainElement.appendChild(dialog);
    }

    function setupEvents() {
        function hideAbort()   { self.hide(false); }
        function hideConfirm() { self.hide(true); }

        // Do not close with taps or clicks inside
        jt.Util.onTapOrMouseDownWithBlock(dialog, function() {
            dialog.focus();
        });

        // Select with tap or mousedown (UIG)
        jt.Util.onTapOrMouseDownWithBlockUIG(dialog, function(e) {
            if (e.target.jtItem >= 0) {
                jt.DOMConsoleControls.hapticFeedbackOnTouch(e);
                itemSelected = e.target.jtItem;
                refreshListSelection();
                setTimeout(hideConfirm, 120);
            }
        });

        // Trap keys, respond to some
        dialog.addEventListener("keydown", function(e) {
            // Abort
            if (e.keyCode === ESC_KEY) hideAbort();
            // Confirm
            else if (CONFIRM_KEYS.indexOf(e.keyCode) >= 0) hideConfirm();
            // Select
            else if (SELECT_KEYS[e.keyCode]) {
                itemSelected += SELECT_KEYS[e.keyCode];
                if (itemSelected < 0) itemSelected = 0; else if (itemSelected > items.length) itemSelected =  items.length;     // + 1 for Open File
                refreshListSelection();
            }
            return jt.Util.blockEvent(e);
        });
    }


    var items = [];
    var itemSelected = 0;

    var dialog, list;
    var listItems = [];
    var visible = false;

    var k = jt.DOMKeys;
    var ESC_KEY = k.VK_ESCAPE.c;
    var CONFIRM_KEYS = [ k.VK_ENTER.c, k.VK_SPACE.c ];
    var SELECT_KEYS = {};
    SELECT_KEYS[k.VK_UP.c] = -1;
    SELECT_KEYS[k.VK_DOWN.c] = 1;

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.SaveStateDialog = function(mainElement, consoleControls, peripheralControls, stateMedia) {
"use strict";

    var self = this;

    this.show = function (pSave) {
        if (!dialog) {
            create();
            return setTimeout(function() {
                self.show(pSave);
            }, 0);
        }

        save = pSave;
        visible = true;
        refreshList();
        dialog.classList.add("jt-show");
        dialog.focus();

        var availHeight = mainElement.clientHeight - jt.ScreenGUI.BAR_HEIGHT - 20;      //  bar - tolerance
        var height = dialog.clientHeight;
        var scale = height < availHeight ? 1 : availHeight / height;
        dialog.style.transform = "translateY(-" + ((jt.ScreenGUI.BAR_HEIGHT / 2) | 0) + "px) scale(" + scale.toFixed(4) + ")";

        //console.error("SAVESTATE availHeight: " + availHeight + ", height: " + height + ", final: " + height * scale);
    };

    this.hide = function (confirm) {
        if (!visible) return;
        dialog.classList.remove("jt-show");
        visible = false;
        Javatari.room.screen.focus();
        if (confirm) {
            var option = slotOptions[slotSelected];
            var control = save ? option.save : option.load;
            if (option.peripheral) peripheralControls.controlActivated(control);
            else consoleControls.controlStateChanged(control, true);
        }
    };

    function refreshList() {
        header.textContent = "Select Slot to " + (save ? "Save" : "Load");
        var prefix = save ? "Save to " : "Load from ";
        for (var i = 0; i < listItems.length; ++i) {
            var li = listItems[i];
            li.innerHTML = prefix + slotOptions[i].d;
            li.classList.toggle("jt-toggle-checked", stateMedia.isSlotUsed(i + 1));
        }
        refreshListSelection();
    }

    function refreshListSelection() {
        for (var i = 0; i < listItems.length; ++i)
            listItems[i].classList.toggle("jt-selected", i === slotSelected);
    }

    function create() {
        dialog = document.createElement("div");
        dialog.id = "jt-savestate";
        dialog.classList.add("jt-select-dialog");
        dialog.style.width = "280px";
        dialog.style.height = "" + (41 + 11 * 33) + "px";
        dialog.tabIndex = -1;

        header = document.createTextNode("Select Slot");
        dialog.appendChild(header);

        // Define list
        list = document.createElement('ul');
        list.style.width = "80%";

        for (var i = 0; i < slotOptions.length; ++i) {
            var li = document.createElement("li");
            li.classList.add("jt-visible");
            if (i < slotOptions.length - 1) li.classList.add("jt-toggle");
            li.style.textAlign = "center";
            li.innerHTML = slotOptions[i].d;
            li.jtSlot = i;
            li.jtNeedsUIG = true;         // Will open dialog or download file!
            listItems.push(li);
            list.appendChild(li);
        }
        dialog.appendChild(list);

        setupEvents();

        mainElement.appendChild(dialog);
    }

    function setupEvents() {
        function hideAbort()   { self.hide(false); }
        function hideConfirm() { self.hide(true); }

        // Do not close with taps or clicks inside
        jt.Util.onTapOrMouseDownWithBlock(dialog, function() {
            dialog.focus();
        });

        // Select with tap or mousedown (UIG)
        jt.Util.onTapOrMouseDownWithBlockUIG(dialog, function(e) {
            if (e.target.jtSlot >= 0) {
                jt.DOMConsoleControls.hapticFeedbackOnTouch(e);
                slotSelected = e.target.jtSlot;
                refreshListSelection();
                setTimeout(hideConfirm, 120);
            }
        });

        // Trap keys, respond to some
        dialog.addEventListener("keydown", function(e) {
            // Abort
            if (e.keyCode === ESC_KEY) hideAbort();
            // Confirm
            else if (CONFIRM_KEYS.indexOf(e.keyCode) >= 0) hideConfirm();
            // Select
            else if (SELECT_KEYS[e.keyCode]) {
                slotSelected += SELECT_KEYS[e.keyCode];
                if (slotSelected < 0) slotSelected = 0; else if (slotSelected > 10) slotSelected = 10;
                refreshListSelection();
            }
            return jt.Util.blockEvent(e);
        });
    }


    var save = false;
    var slotSelected = 0;

    var dialog, list;
    var listItems = [];
    var visible = false;
    var header;

    var c = jt.ConsoleControls;
    var p = jt.PeripheralControls;
    var slotOptions = [
        { d: "Slot 1", load: c.LOAD_STATE_1,             save: c.SAVE_STATE_1 },
        { d: "Slot 2", load: c.LOAD_STATE_2,             save: c.SAVE_STATE_2 },
        { d: "Slot 3", load: c.LOAD_STATE_3,             save: c.SAVE_STATE_3 },
        { d: "Slot 4", load: c.LOAD_STATE_4,             save: c.SAVE_STATE_4 },
        { d: "Slot 5", load: c.LOAD_STATE_5,             save: c.SAVE_STATE_5 },
        { d: "Slot 6", load: c.LOAD_STATE_6,             save: c.SAVE_STATE_6 },
        { d: "Slot 7", load: c.LOAD_STATE_7,             save: c.SAVE_STATE_7 },
        { d: "Slot 8", load: c.LOAD_STATE_8,             save: c.SAVE_STATE_8 },
        { d: "Slot 9", load: c.LOAD_STATE_9,             save: c.SAVE_STATE_9 },
        { d: "Slot 10", load: c.LOAD_STATE_10,           save: c.SAVE_STATE_10 },
        { d: "File...", load: p.MACHINE_LOAD_STATE_FILE, save: p.MACHINE_SAVE_STATE_FILE, peripheral: true }
    ];

    var k = jt.DOMKeys;
    var ESC_KEY = k.VK_ESCAPE.c;
    var CONFIRM_KEYS = [ k.VK_ENTER.c, k.VK_SPACE.c ];
    var SELECT_KEYS = {};
    SELECT_KEYS[k.VK_UP.c] = -1;
    SELECT_KEYS[k.VK_DOWN.c] = 1;

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.QuickOptionsDialog = function(mainElement, consoleControls, peripheralControls) {
    "use strict";

    var self = this;

    this.show = function () {
        if (!dialog) {
            create();
            return setTimeout(self.show, 0);
        }

        refresh();
        visible = true;
        dialog.classList.add("jt-show");
        dialog.focus();

        var availHeight = mainElement.clientHeight - jt.ScreenGUI.BAR_HEIGHT - 20;      //  bar - tolerance
        var height = dialog.clientHeight;
        var scale = height < availHeight ? 1 : availHeight / height;
        dialog.style.transform = "translateY(-" + ((jt.ScreenGUI.BAR_HEIGHT / 2) | 0) + "px) scale(" + scale.toFixed(4) + ")";
    };

    this.hide = function() {
        if (!visible) return;
        Javatari.userPreferences.save();
        dialog.classList.remove("jt-show");
        visible = false;
        Javatari.room.screen.focus();
    };

    function refresh() {
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            var report = item.peripheral ? peripheralControls.getControlReport(item.control) : consoleControls.getControlReport(item.control);
            item.value = report.label;
            item.selected = report.active;
            controlsItems[i].innerHTML = item.value;
            controlsItems[i].classList.toggle("jt-selected", !!item.selected);
        }
    }

    function create() {
        dialog = document.createElement("div");
        dialog.id = "jt-quick-options";
        dialog.tabIndex = -1;

        var cc = jt.ConsoleControls;
        var pc = jt.PeripheralControls;

        items = [
            { label: "Paddles Mode",                     control: pc.PADDLES_TOGGLE_MODE,         peripheral: true },
            { label: "No Collisions",                    control: cc.NO_COLLISIONS },
            { label: "&#128190;&nbsp; V-Synch",          control: cc.VSYNCH },
            { label: "&#128190;&nbsp; CRT Filter",       control: pc.SCREEN_CRT_FILTER,           peripheral: true },
            { label: "&#128190;&nbsp; Audio Buffer",     control: pc.SPEAKER_BUFFER_TOGGLE,       peripheral: true },
            { label: "&#128190;&nbsp; Big Directionals", control: pc.TOUCH_TOGGLE_DIR_BIG,        peripheral: true },
            { label: "&#128190;&nbsp; TurboFire Speed",  control: pc.TURBO_FIRE_TOGGLE,           peripheral: true },
            { label: "&#128190;&nbsp; Haptic Feedback",  control: pc.HAPTIC_FEEDBACK_TOGGLE_MODE, peripheral: true }
        ];

        // Define list
        var list = document.createElement('ul');
        list.classList.add("jt-quick-options-list");

        for (var i = 0; i < items.length; ++i) {
            var li = document.createElement("li");
            var label = document.createElement("div");
            label.innerHTML = items[i].label;
            li.appendChild(label);
            var control = document.createElement("div");
            control.classList.add("jt-control");
            control.jtControlItem = items[i];
            li.appendChild(control);
            list.appendChild(li);
            controlsItems.push(control);
        }

        dialog.appendChild(list);

        setupEvents();

        mainElement.appendChild(dialog);
    }

    function setupEvents() {
        // Do not close with taps or clicks inside, select with tap or mousedown
        jt.Util.onTapOrMouseDownWithBlock(dialog, function(e) {
            if (e.target.jtControlItem) {
                jt.DOMConsoleControls.hapticFeedbackOnTouch(e);
                var item = e.target.jtControlItem;
                if (item.peripheral) peripheralControls.controlActivated(item.control, false, false);
                else consoleControls.controlStateChanged(item.control, true);
                refresh();
            } else
                dialog.focus();
        });

        // Trap keys, respond to some
        dialog.addEventListener("keydown", function(e) {
            // Exit
            if (EXIT_KEYS.indexOf(e.keyCode) >= 0) self.hide();
            return jt.Util.blockEvent(e);
        });
    }


    var visible = false;
    var dialog, list;
    var items, controlsItems = [];

    var k = jt.DOMKeys;
    var EXIT_KEYS = [ k.VK_ESCAPE.c, k.VK_ENTER.c, k.VK_SPACE.c ];

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// HTML and CSS data for Settings

jt.SettingsGUI = { WIDTH: 600, HEIGHT: 450};

jt.SettingsGUI.html = function() {
    return '<div id="jt-modal" tabindex="-1"> <div id="jt-menu"> <div id="jt-back" jt-var="true"> <div class="jt-back-arrow"> </div> </div> <div class="jt-caption"> Help & Settings </div> <div class="jt-items"> <div id="jt-menu-console" class="jt-item" jt-var="true"> CONSOLE </div> <div id="jt-menu-ports" class="jt-item" jt-var="true"> CONTROLLERS </div> <div id="jt-menu-general" class="jt-item jt-selected" jt-var="true"> EMULATION </div> <div id="jt-menu-about" class="jt-item" jt-var="true"> ABOUT </div> <div id="jt-menu-selection" jt-var="true"> </div> </div> </div> <div id="jt-content" jt-var="true"> <div id="jt-console"> <div class="jt-left"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F1 </div> </div> <div class="jt-desc"> POWER </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F2 </div> </div> <div class="jt-desc"> TV TYPE </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F4 </div> </div> <div class="jt-desc"> P1 Difficulty </div> </div> </div> <div class="jt-middle"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F5 </div> </div> <div class="jt-desc"> Load Cartridge File </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F6 </div> </div> <div class="jt-desc"> Load Cartridge URL </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F7 </div> </div> <div class="jt-desc"> Remove Cartridge </div> </div> </div> <div class="jt-right"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F12 </div> </div> <div class="jt-desc"> RESET </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F11 </div> </div> <div class="jt-desc"> SELECT </div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F9 </div> </div> <div class="jt-desc"> P2 Difficulty </div> </div> </div> <div class="jt-full-divider"></div> <div class="jt-console-panel"> <div class="jt-console-panel-cart-file jt-console-panel-icon"></div> <div class="jt-console-panel-cart-url jt-console-panel-icon"></div> <div class="jt-console-panel-p0-diff-label jt-console-panel-icon"></div> <div class="jt-console-panel-p1-diff-label jt-console-panel-icon"></div> <div class="jt-console-panel-power-labels jt-console-panel-icon"></div> <div class="jt-console-panel-reset-labels jt-console-panel-icon"></div> </div> <div class="jt-footer"> Drag & Drop Files or URLs to load Cartridge ROMs and State Files </div> </div> <div id="jt-ports"> <div class="jt-left"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> L </div> </div> <div class="jt-desc">Toggle Paddles</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> K </div> </div> <div class="jt-desc">Toggle Swap Sides</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> J </div> </div> <div class="jt-desc">Toggle Gamepads</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> H </div> </div> <div class="jt-desc">Adjust Turbo Fire speed</div> </div> </div> <div class="jt-right"> <div id="jt-ports-paddles-mode" class="jt-hotkey jt-link jt-joystick-device" jt-var="true">Controllers: JOYSTICKS</div> <div id="jt-ports-p1-mode" class="jt-hotkey jt-link jt-mouse-device" jt-var="true">Swap Mode: NORMAL</div> <div id="jt-ports-gamepads-mode" class="jt-hotkey jt-link jt-joykeys-device" jt-var="true">Gamepads: AUTO (swapped)</div> </div> <div class="jt-full-divider"></div> <div class="jt-player jt-p1"> <div id="jt-control-p1-label" class="jt-title" jt-var="true"> PLAYER 1 </div> <div class="jt-command jt-fire1"> Fire<br> <div id="jt-control-p1-button" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-up"> <div id="jt-control-p1-up-label" jt-var="true"> Up </div> <div id="jt-control-p1-up" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-fire2"> Turbo Fire<br> <div id="jt-control-p1-buttonT" class="jt-key" jt-var="true" > </div> </div> <div class="jt-command jt-left"> Left<br> <div id="jt-control-p1-left" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-controller"> <div id="jt-control-p1-controller" jt-var="true"> </div> </div> <div class="jt-command jt-right"> Right<br> <div id="jt-control-p1-right" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-down"> <div id="jt-control-p1-down-label" jt-var="true"> Down </div> <div id="jt-control-p1-down" class="jt-key" jt-var="true"> </div> </div> </div> <div class="jt-player jt-p2"> <div id="jt-control-p2-label" class="jt-title" jt-var="true"> PLAYER 2 </div> <div class="jt-command jt-fire1"> Fire<br> <div id="jt-control-p2-button" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-up"> <div id="jt-control-p2-up-label" jt-var="true"> Up </div> <div id="jt-control-p2-up" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-fire2"> Turbo Fire<br> <div id="jt-control-p2-buttonT" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-left"> Left<br> <div id="jt-control-p2-left" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-controller"> <div id="jt-control-p2-controller" jt-var="true"> </div> </div> <div class="jt-command jt-right"> Right<br> <div id="jt-control-p2-right" class="jt-key" jt-var="true"> </div> </div> <div class="jt-command jt-down"> <div id="jt-control-p2-down-label" jt-var="true"> Down </div> <div id="jt-control-p2-down" class="jt-key" jt-var="true"> </div> </div> </div> <div id="jt-ports-revert" class="jt-link" jt-var="true"> REVERT </div> <div id="jt-ports-defaults" class="jt-link" jt-var="true"> DEFAULTS </div> </div> <div id="jt-general"> <div class="jt-left"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> C </div> </div> <div class="jt-desc">Collisions</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> Shift </div>&nbsp;+&nbsp;<div class="jt-key"> F1 </div> </div> <div class="jt-desc">Fry Console</div> </div> <div class="jt-full-divider"></div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> Q </div> </div> <div class="jt-desc">NTSC/PAL</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> W </div> </div> <div class="jt-desc">V-Synch Modes</div> </div> <div class="jt-divider"></div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> R </div> </div> <div class="jt-desc">CRT Modes</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> T </div> </div> <div class="jt-desc">CRT Filters</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> D </div> </div> <div class="jt-desc">Debug Modes</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> I </div> </div> <div class="jt-desc">Show Info</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> G </div> </div> <div class="jt-desc">Capture Screen</div> </div> <div class="jt-full-divider"></div> <div class="jt-hotkey"> <div class="jt-desc">Right-Click Bar Icons: Default Action</div> </div> </div> <div class="jt-right"> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> 0 - 9 </div> </div> <div class="jt-desc">Load State</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Ctrl </div>&nbsp;+&nbsp;<div class="jt-key"> 0 - 9 </div> </div> <div class="jt-desc">Save State</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F8 </div> </div> <div class="jt-desc">Save State File</div> </div> <div class="jt-full-divider"></div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> F12 </div>&nbsp;&nbsp;/&nbsp;&nbsp;<div class="jt-key"> Shift </div>&nbsp;+&nbsp;<div class="jt-key"> F12 </div> </div> <div class="jt-desc">Fast / Slow Speed</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> Shift </div>&nbsp;<div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> Arrows </div> </div> <div class="jt-desc">Adjust Speed</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> P </div> </div> <div class="jt-desc">Toggle Pause</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> O </div>&nbsp;/&nbsp;<div class="jt-key"> F </div> </div> <div class="jt-desc">Next Frame</div> </div> <div class="jt-full-divider"></div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> Enter </div> </div> <div class="jt-desc">Full Screen</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key jt-key-fixed"> Ctrl </div>&nbsp;<div class="jt-key jt-key-fixed"> Alt </div>&nbsp;+&nbsp;<div class="jt-key"> Arrows </div> </div> <div class="jt-desc">Screen Size / Width</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> Shift </div>&nbsp;<div class="jt-key jt-key-fixed"> Ctrl </div>&nbsp;+&nbsp;<div class="jt-key"> Arrows </div> </div> <div class="jt-desc">Viewport Size / Origin</div> </div> <div class="jt-hotkey"> <div class="jt-command"> <div class="jt-key"> Backspace </div> </div> <div class="jt-desc">Defaults</div> </div> </div> </div> <div id="jt-about"> <div id="jt-logo-version">version&nbsp' + Javatari.VERSION + '</div> <div class="jt-info">' + atob("Q3JlYXRlZCBieSBQYXVsbyBBdWd1c3RvIFBlY2Npbg==") + '<br>' + atob("PGEgdGFyZ2V0PSJfYmxhbmsiIGhyZWY9Imh0dHA6Ly9qYXZhdGFyaS5vcmciPmh0dHA6Ly9qYXZhdGFyaS5vcmc8L2E+") + ' </div> <div id="jt-browserinfo" jt-var="true"> </div> </div> </div> </div>';
};

jt.SettingsGUI.css = function() {
    return '#jt-modal * { outline: none; box-sizing: border-box; } #jt-modal { position: absolute; overflow: hidden; width: ' + jt.SettingsGUI.WIDTH + 'px; height: 0; opacity: 0; visibility: hidden; top: 50%; left: 50%; color: hsl(0, 0%, 10%); font: normal 13px sans-serif; white-space: nowrap; text-align: initial; box-shadow: 3px 3px 15px 2px rgba(0, 0, 0, .4); transform: scale(0.85); transition: visibility .2s ease-out, opacity .2s ease-out, transform .2s ease-out, height .25s step-end; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; z-index: 50; } #jt-modal.jt-show { transform: scale(1); transition: visibility .2s ease-out, opacity .2s ease-out, transform .2s ease-out; height: ' + jt.SettingsGUI.HEIGHT + 'px; visibility: visible; opacity: 1; } #jt-modal .jt-heading { font-weight: 700; color: hsl(0, 0%, 30%); } #jt-modal .jt-link { font-weight: 700; line-height: 21px; color: hsl(228, 90%, 40%); cursor: pointer; } #jt-modal .jt-link:hover { outline: 1px solid; } .jt-command { position: relative; display: inline-block; font-weight: 600; color: hsl(0, 0%, 48%); } .jt-hotkey { height: 27px; padding: 3px 5px; box-sizing: border-box; } .jt-hotkey .jt-desc { display: inline-block; line-height: 21px; } .jt-key { position: relative; display: inline-block; top: -1px; min-width: 25px; height: 21px; padding: 4px 6px 3px; box-sizing: border-box; font-weight: 600; font-size: 12px; line-height: 12px; color: hsl(0, 0%, 42%); background: white; border-radius: 3px; border: 1px solid rgb(210, 210, 210); box-shadow: 0 1px 0 1px hsl(0, 0%, 47%); text-align: center; } .jt-key-fixed { width: 31px; padding-left: 0; padding-right: 2px; } .jt-footer { margin-top: 16px; text-align: center; } #jt-menu { position: relative; background: white; border-bottom: 1px solid hsl(0, 0%, 72%); } #jt-menu #jt-back { position: absolute; width: 40px; height: 34px; margin: 3px 1px; padding: 16px 12px; cursor: pointer; } #jt-menu #jt-back:hover { background: rgba(0, 0, 0, .12); } .jt-back-arrow { display: block; width: 16px; height: 2px; border-radius: 1000px; background: hsl(0, 0%, 98%); } .jt-back-arrow:before { content: ""; display: block; position: absolute; width: 10px; height: 2px; border-radius: inherit; background: inherit; transform: rotate(-45deg); transform-origin: 1px 1px; } .jt-back-arrow:after { content: ""; display: block; position: absolute; width: 10px; height: 2px; border-radius: inherit; background: inherit; transform: rotate(45deg); transform-origin: 1px 1px; } #jt-menu .jt-caption { height: 29px; margin: 0 -1px; padding: 10px 0 0 48px; font-size: 18px; color: white; background: hsl(358, 66%, 50%); box-shadow: 0 1px 3px rgba(0, 0, 0, .9); vertical-align: middle; box-sizing: content-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } #jt-menu .jt-items { position: relative; width: 84%; height: 39px; margin: 0 auto; font-weight: 600; } #jt-menu .jt-item { float: left; width: 25%; height: 100%; padding-top: 13px; font-size: 14px; color: rgba(0, 0, 0, .43); text-align: center; cursor: pointer; } #jt-menu .jt-selected { color: hsl(358, 67%, 46%); } #jt-menu #jt-menu-selection { position: absolute; left: 0; bottom: 0; width: 25%; height: 3px; background: hsl(358, 67%, 46%); transition: left 0.3s ease-in-out; } #jt-content { position: relative; left: 0; width: 3000px; height: 371px; background: rgb(218, 218, 218); transition: left 0.3s ease-in-out } #jt-console, #jt-ports, #jt-general, #jt-about { position: absolute; width: ' + jt.SettingsGUI.WIDTH + 'px; height: 100%; box-sizing: border-box; } #jt-console { padding-top: 35px; } #jt-console .jt-hotkey { height: 29px; } #jt-console .jt-command { width: 42px; } #jt-console .jt-left, #jt-console .jt-middle, #jt-console .jt-right { float: left; } #jt-console .jt-left { width: 160px; margin-left: 58px; } #jt-console .jt-middle { width: 204px; } #jt-console .jt-right .jt-command { width: 46px; } #jt-console .jt-console-panel { position: relative; margin: 18px auto 0; box-shadow: rgba(0, 0, 0, 0.6) 2px 2px 4px; } #jt-console .jt-console-panel * { cursor: auto; } #jt-console .jt-footer { margin: 20px auto; } #jt-ports { left: ' + jt.SettingsGUI.WIDTH + 'px; padding: 18px 0 0 27px; } #jt-ports > .jt-left { float: left; width: 335px; padding-left: 26px; } #jt-ports > .jt-right { float: left; } #jt-ports .jt-command { width: 91px; } #jt-ports .jt-bottom { width: 546px; text-align: center; } #jt-ports .jt-player { position: absolute; top: 146px; width: 217px; color: rgba(0, 0, 0, .8); } #jt-ports .jt-p1 { left: 47px; } #jt-ports .jt-p2 { right: 47px; } #jt-ports .jt-title { margin-bottom: 09px; font-size: 14px; line-height: 14px; font-weight: bold; color: hsl(0, 0%, 35%); text-align: center; } #jt-ports .jt-player .jt-command { display: block; position: relative; float: left; width: 33%; height: 45px; font-size: 13px; text-align: center; } #jt-ports .jt-command.jt-fire1, #jt-ports .jt-command.jt-fire2 { top: 14px; } #jt-ports .jt-command.jt-left, #jt-ports .jt-command.jt-right { top: 27px; } #jt-ports .jt-command.jt-down { float: none; clear: both; margin: 0 auto; } #jt-ports .jt-command.jt-controller { height: 90px; } #jt-ports #jt-control-p1-controller, #jt-ports #jt-control-p2-controller { width: 70px; height: 89px; margin-left: 1px; background: url("' + jt.Images.urls.controllers + '") no-repeat -1px 0; background-size: 73px 179px; } #jt-ports .jt-player .jt-key { min-width: 33px; height: 23px; padding: 5px 6px 4px; margin-top: 2px; cursor: pointer; } #jt-ports .jt-player .jt-key:hover { box-shadow: 0 1px 0 1px rgba(0, 0, 0, .5), 1px 2px 6px 4px rgb(170, 170, 170); } #jt-ports .jt-player .jt-key.jt-redefining { color: white; background-color: rgb(87, 128, 255); border-color: rgb(71, 117, 255); } #jt-ports .jt-player .jt-key.jt-undefined { background-color: rgb(255, 150, 130); border-color: rgb(255, 130, 90); } #jt-ports-defaults, #jt-ports-revert { position: absolute; left: 260px; width: 82px; text-align: center; padding: 3px 0 1px; font-size: 12px; } #jt-ports-defaults { bottom: 47px; } #jt-ports-revert { bottom: 21px; } #jt-general { left: ' + (jt.SettingsGUI.WIDTH * 2) + 'px; padding-top: 18px; padding-left: 34px; } #jt-general .jt-left { float: left; width: 245px; } #jt-general .jt-left .jt-command { width: 99px; } #jt-general .jt-right { float: left; } #jt-general .jt-right .jt-command { width: 160px; } #jt-about { left: ' + (jt.SettingsGUI.WIDTH * 3) + 'px; font-size: 18px; } #jt-about #jt-logo-version { width: 300px; height: 238px; margin: 26px auto 19px; color: hsl(0, 0%, 98%); padding-top: 200px; box-sizing: border-box; text-align: center; background: black url("' + jt.Images.urls.logo + '") center 18px no-repeat; background-size: 233px 173px; box-shadow: 3px 3px 14px rgb(75, 75, 75); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } #jt-about .jt-info { line-height: 30px; text-align: center; } #jt-about a { color: rgb(0, 40, 200); text-decoration: none; } #jt-about a:hover { text-decoration: underline; } #jt-about #jt-browserinfo { position: absolute; left: 0; right: 0; bottom: 7px; font-size: 10px; text-align: center; color: transparent; } .jt-clear { clear: both; } .jt-divider { clear: both; height: 27px; } .jt-full-divider { clear: both; height: 21px; } #jt-general .jt-full-divider { clear: both; height: 18px; }';
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.SettingsDialog = function(parentElement, consoleControls) {
"use strict";

    var self = this;

    this.show = function (atPage) {
        if (!modal) {
            create();
            setTimeout(function() {
                self.show(atPage);
            }, 0);
            return;
        }

        if (!this.position()) return;

        controlRedefining = null;
        this.setPage(atPage || page);
        modal.classList.add("jt-show");
        modal.classList.add("jt-show");
        visible = true;
        setTimeout(function() {
            modal.focus();
        }, 50);
    };

    this.hide = function () {
        if (!visible) return;
        self.hideLesser();
        Javatari.room.screen.focus();
    };

    this.hideLesser = function () {
        if (Javatari.userPreferences.isDirty) finishPreferences();
        modal.classList.remove("jt-show");
        modal.classList.remove("jt-show");
        visible = false;
    };

    this.setPage = function (pPage) {
        page = pPage;

        var contentPosition = {
            "CONSOLE": "0",
            "PORTS":   "-600px",
            "GENERAL": "-1200px",
            "ABOUT":   "-1800px"
        }[page];
        var selectionPosition = {
            "CONSOLE": "0",
            "PORTS":   "25%",
            "GENERAL": "50%",
            "ABOUT":   "75%"
        }[page];

        if (contentPosition) self["jt-content"].style.left = contentPosition;
        if (selectionPosition) self["jt-menu-selection"].style.left = selectionPosition;

        self["jt-menu-console"].classList.toggle("jt-selected", page === "CONSOLE");
        self["jt-menu-ports"].classList.toggle("jt-selected", page === "PORTS");
        self["jt-menu-general"].classList.toggle("jt-selected", page === "GENERAL");
        self["jt-menu-about"].classList.toggle("jt-selected", page === "ABOUT");

        switch(page) {
            case "ABOUT":
                refreshAboutPage(); break;
            case "PORTS":
                refreshPortsPage();
        }
    };

    this.isVisible = function() {
        return visible;
    };

    this.position = function() {
        var w = parentElement.clientWidth;
        var h = parentElement.clientHeight;
        if (w < 575 || h < 400) {
            this.hide();
            return false;
        }

        modal.style.top =  "" + (((h - jt.SettingsGUI.HEIGHT) / 2) | 0) + "px";
        modal.style.left = "" + (((w - jt.SettingsGUI.WIDTH) / 2) | 0) + "px";

        return true;
    };

    this.controlsModeStateUpdate = function () {
        if (visible && page === "PORTS") refreshPortsPage();
    };

    function create() {
        jt.Util.insertCSS(jt.SettingsGUI.css());
        parentElement.insertAdjacentHTML("beforeend", jt.SettingsGUI.html());

        modal = document.getElementById("jt-modal");

        delete jt.SettingsGUI.html;
        delete jt.SettingsGUI.css;

        setFields();
        setEvents();
    }

    // Automatically set fields for each child element that has the "id" attribute
    function setFields() {
        traverseDOM(modal, function (element) {
            var jtVar = element.id && element.getAttribute && element.getAttribute("jt-var");
            if (jtVar) self[element.id] = element;
        });

        function traverseDOM(element, func) {
            func(element);
            var child = element.childNodes;
            for (var i = 0; i < child.length; i++) traverseDOM(child[i], func);
        }
    }

    function setEvents() {
        // Do not close with taps or clicks inside
        jt.Util.onTapOrMouseDownWithBlock(modal, function() { modal.focus(); });

        // Close with the back button
        jt.Util.onTapOrMouseDownWithBlock(self["jt-back"], self.hide);

        // Several key events
        modal.addEventListener("keydown", function (e) {
            processKeyEvent(e, true);
        });
        modal.addEventListener("keyup", function (e) {
            processKeyEvent(e, false);
        });

        // Tabs
        jt.Util.onTapOrMouseDownWithBlock(self["jt-menu-console"], function () {
            self.setPage("CONSOLE");
        });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-menu-ports"], function () {
            self.setPage("PORTS");
        });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-menu-general"], function () {
            self.setPage("GENERAL");
        });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-menu-about"], function () {
            self.setPage("ABOUT");
        });

        // Key redefinition
        for (var elem in controlKeysElements) {
            (function(localControl) {
                jt.Util.onTapOrMouseDownWithBlock(self[localControl], function () {
                    keyRedefinitionStart(localControl);
                });
            })(elem);
        }

        // Controls Actions
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-paddles-mode"], function() { consoleControls.togglePaddleMode(); });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-p1-mode"], function() { consoleControls.toggleP1ControlsMode(); });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-gamepads-mode"], function() { consoleControls.toggleGamepadMode(); });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-defaults"], controlsDefaults);
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-revert"], controlsRevert);
    }

    function refreshAboutPage() {
        self["jt-browserinfo"].innerHTML = navigator.userAgent;
    }

    function refreshPortsPage() {
        var paddlesMode = consoleControls.isPaddleMode();
        var p1Mode = consoleControls.isP1ControlsMode();

        self["jt-ports-paddles-mode"].innerHTML = "Controllers: " + (paddlesMode ? "PADDLES" : "JOYSTICKS");
        self["jt-ports-p1-mode"].innerHTML = "Swap Mode: " + (p1Mode ? "SWAPPED" : "NORMAL");
        self["jt-ports-gamepads-mode"].innerHTML = "Gamepads: " + (consoleControls.getGamepadModeDesc());

        if (paddlesMode) {
            self["jt-control-p1-controller"].style.backgroundPositionY = "-91px";
            self["jt-control-p2-controller"].style.backgroundPositionY = "-91px";
            self["jt-control-p1-up-label"].innerHTML = self["jt-control-p2-up-label"].innerHTML = "+ Speed";
            self["jt-control-p1-down-label"].innerHTML = self["jt-control-p2-down-label"].innerHTML = "- Speed";
        } else {
            self["jt-control-p1-controller"].style.backgroundPositionY = "0";
            self["jt-control-p2-controller"].style.backgroundPositionY = "0";
            self["jt-control-p1-up-label"].innerHTML = self["jt-control-p2-up-label"].innerHTML = "Up";
            self["jt-control-p1-down-label"].innerHTML = self["jt-control-p2-down-label"].innerHTML = "Down";

        }
        self["jt-control-p1-label"].innerHTML = "PLAYER " + (p1Mode ? "2" : "1");
        self["jt-control-p2-label"].innerHTML = "PLAYER " + (p1Mode ? "1" : "2");

        var keys = prefs.joystickKeys;
        for (var controlElem in controlKeysElements) {
            var elem = self[controlElem];
            if (controlElem === controlRedefining) {
                elem.classList.add("jt-redefining");
                elem.classList.remove("jt-undefined");
                elem.innerHTML = "?";
            } else {
                elem.classList.remove("jt-redefining");
                var controlInfo = controlKeysElements[controlElem];
                var keyInfo = keys[controlInfo.player][controlInfo.control];
                if (keyInfo.c === jt.DOMKeys.VK_VOID.c) {
                    elem.classList.add("jt-undefined");
                    elem.innerHTML = "";
                } else {
                    elem.classList.remove("jt-undefined");
                    elem.innerHTML = keyInfo.n;
                }
            }
        }
    }

    function processKeyEvent(e, press) {
        var code = jt.DOMKeys.codeForKeyboardEvent(e);
        if (press && code === KEY_ESC) {
            hideOrKeyRedefinitionStop();
            return jt.Util.blockEvent(e);
        } else
            if(controlRedefining) keyRedefinitionTry(e);
    }

    var keyRedefinitionStart = function(control) {
        controlRedefining = control;
        refreshPortsPage();
    };

    var keyRedefinitonStop = function() {
        controlRedefining = null;
        refreshPortsPage();
    };

    var keyRedefinitionTry = function (e) {
        if (!controlRedefining) return;
        var c = jt.DOMKeys.codeForKeyboardEvent(e);
        var n = jt.DOMKeys.nameForKeyboardEventSingle(e);
        if (c === jt.DOMKeys.VK_VOID.c || !n) return;
        var newKey = { c: c, n: n };
        var controlInfo = controlKeysElements[controlRedefining];
        var keys = prefs.joystickKeys;
        for (var con in controlKeysElements) {
            var otherControlInfo = controlKeysElements[con];
            if (con !== controlRedefining && keys[otherControlInfo.player][otherControlInfo.control].c === newKey.c)
                keys[otherControlInfo.player][otherControlInfo.control] = jt.DOMKeys.VK_VOID;
        }
        keys[controlInfo.player][controlInfo.control] = newKey;
        Javatari.userPreferences.setDirty();
        keyRedefinitonStop();
    };

    var hideOrKeyRedefinitionStop = function() {
        if (controlRedefining) keyRedefinitonStop();
        else self.hide()
    };

    var controlsDefaults = function () {
        Javatari.userPreferences.setDefaultJoystickKeys();
        keyRedefinitonStop();   // will refresh
    };

    var controlsRevert = function () {
        Javatari.userPreferences.load();
        keyRedefinitonStop();   // will refresh
    };

    var finishPreferences = function () {
        Javatari.userPreferences.save();
        consoleControls.applyPreferences();
    };

    var controlKeysElements = {
        "jt-control-p1-button":  { player: 0, control: "button" },
        "jt-control-p1-buttonT": { player: 0, control: "buttonT" },
        "jt-control-p1-up":      { player: 0, control: "up" },
        "jt-control-p1-left":    { player: 0, control: "left" },
        "jt-control-p1-right":   { player: 0, control: "right" },
        "jt-control-p1-down":    { player: 0, control: "down" },
        "jt-control-p2-button":  { player: 1, control: "button" },
        "jt-control-p2-buttonT": { player: 1, control: "buttonT" },
        "jt-control-p2-up":      { player: 1, control: "up" },
        "jt-control-p2-left":    { player: 1, control: "left" },
        "jt-control-p2-right":   { player: 1, control: "right" },
        "jt-control-p2-down":    { player: 1, control: "down" }
    };


    var controlRedefining = null;

    var modal;
    var page = "CONSOLE";
    var visible = false;

    var prefs = Javatari.userPreferences.current;

    var KEY_ESC = jt.DOMKeys.VK_ESCAPE.c;

};


// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

// Accepts multiple AudioSignals with different sampling rates
// Mixes all signals performing per-signal resampling as needed

jt.WebAudioSpeaker = function(mainElement) {
"use strict";

    this.connect = function(audioSocket) {
        audioSocket.connectMonitor(this);
    };

    this.connectPeripherals = function(pScreen) {
        screen = pScreen;
    };

    this.connectAudioSignal = function(pAudioSignal) {
        if (audioSignal.indexOf(pAudioSignal) >= 0) return;        // Add only once
        jt.Util.arrayAdd(audioSignal, pAudioSignal);
        updateResamplingFactors();
    };

    this.disconnectAudioSignal = function(pAudioSignal) {
        if (audioSignal.indexOf(pAudioSignal) < 0) return;         // Not present
        jt.Util.arrayRemoveAllElement(audioSignal, pAudioSignal);
        updateResamplingFactors();
    };

    this.powerOn = function() {
        createAudioContext();
        if (!processor) return;

        registerUnlockOnTouchIfNeeded();
        this.unpause();
    };

    this.powerOff = function() {
        this.pause();
        if (audioContext) audioContext.close();
        audioContext = processor = undefined;
    };

    this.mute = function () {
        mute = true;
    };

    this.unMute = function () {
        mute = false;
    };

    this.pause = function () {
        if (processor) processor.disconnect();
    };

    this.unpause = function () {
        if (processor) processor.connect(audioContext.destination);
    };

    this.toggleBufferBaseSize = function() {
        if (!audioContext) return screen.showOSD("Audio is DISABLED", true, true);

        bufferBaseSize = ((bufferBaseSize + 2) % 8) - 1;  // -1..6
        this.pause();
        createProcessor();
        this.unpause();
        screen.showOSD("Audio Buffer size: " + (bufferBaseSize === -1 ? "Auto (" + bufferSize + ")" : bufferBaseSize === 0 ? "Browser (" + bufferSize + ")" : bufferSize), true);
        prefs.audioBufferBase = bufferBaseSize;
        Javatari.userPreferences.setDirty();
    };

    this.getControlReport = function(control) {
        // Only BufferBaseSize for now
        return { label: bufferBaseSize === -2 ? "OFF" : bufferBaseSize === -1 ? "Auto" : bufferBaseSize === 0 ? "Browser" : bufferSize, active: bufferBaseSize > 0 };
    };

    function determineAutoBufferBaseSize() {
        // Set bufferBaseSize according to browser and platform
        return jt.Util.isMobileDevice()
            ? jt.Util.browserInfo().name === "CHROME" && !jt.Util.isIOSDevice()
                ? 5      // for now mobile Chrome needs more buffer, except on iOS
                : 3      // other mobile scenarios
            : 2;         // desktop
    }

    function determineBrowserDefaultBufferBaseSize() {
        // Safari/WebKit does not allow 0 (browser default), so use Auto instead
        return jt.Util.browserInfo().name === "SAFARI" || jt.Util.isIOSDevice() ? determineAutoBufferBaseSize() : 0;
    }

    var createAudioContext = function() {
        if (bufferBaseSize === -2 || Javatari.AUDIO_MONITOR_BUFFER_SIZE === 0) {
            jt.Util.warning("Audio disabled in configuration");
            return;
        }
        try {
            var constr = (window.AudioContext || window.webkitAudioContext || window.WebkitAudioContext);
            if (!constr) throw new Error("WebAudio API not supported by the browser");
            audioContext = new constr();
            jt.Util.log("Speaker AudioContext created. Sample rate: " + audioContext.sampleRate + (audioContext.state ? ", " + audioContext.state : ""));
            createProcessor();
        } catch(ex) {
            jt.Util.error("Could not create AudioContext. Audio DISABLED!\n" + ex);
        }
    };

    var createProcessor = function() {
        try {
            // If not specified, calculate buffer size based on baseSize and host audio sampling rate. Ex: for a baseSize = 1 then 22050Hz = 256, 44100 = 512, 48000 = 512, 96000 = 1024, 192000 = 2048, etc
            var baseSize = bufferBaseSize === -1 ? determineAutoBufferBaseSize() : bufferBaseSize === 0 ? determineBrowserDefaultBufferBaseSize() : bufferBaseSize;
            var totalSize = Javatari.AUDIO_MONITOR_BUFFER_SIZE > 0 ? Javatari.AUDIO_MONITOR_BUFFER_SIZE : baseSize > 0 ? jt.Util.exp2(jt.Util.log2((audioContext.sampleRate + 14000) / 22050) | 0) * jt.Util.exp2(baseSize - 1) * 256 : 0;
            processor = audioContext.createScriptProcessor(totalSize, 1, 1);
            processor.onaudioprocess = onAudioProcess;
            bufferSize = processor.bufferSize;
            updateResamplingFactors();
            jt.Util.log("Audio Processor buffer size: " + processor.bufferSize);
        } catch(ex) {
            jt.Util.error("Could not create ScriptProcessorNode. Audio DISABLED!\n" + ex);
        }
    };

    function registerUnlockOnTouchIfNeeded() {
        // iOS needs unlocking of the AudioContext on user interaction!
        if (processor && (!audioContext.state || audioContext.state === "suspended")) {
            mainElement.addEventListener("touchend", function unlockAudioContextOnTouch() {
                mainElement.removeEventListener("touchend", unlockAudioContextOnTouch, true);

                var source = audioContext.createBufferSource();
                source.buffer = audioContext.createBuffer(1, 1, 22050);
                source.connect(audioContext.destination);
                source.start(0);
                jt.Util.log("Audio Context unlocked, " + audioContext.state);
            }, true);
            jt.Util.log("Audio Context unlock on touch registered");
        }
    }

    function updateResamplingFactors() {
        //if (bufferSizeProblem !== undefined) console.error("+++++++ buffer size problem: " + bufferSizeProblem);

        if (!processor) return;
        resamplingFactor.length = audioSignal.length;
        resamplingLeftOver.length = audioSignal.length;
        for (var i = 0; i < audioSignal.length; i++) {
            resamplingFactor[i] = audioSignal[i].getSampleRate() / audioContext.sampleRate;
            resamplingLeftOver[i] = 0;
            audioSignal[i].setAudioMonitorBufferSize((resamplingFactor[i] * bufferSize) | 0);
        }
    }

    function onAudioProcess(event) {
        //if (Javatari.room.console.powerIsOn) {
        //    var now = performance.now();
        //    Javatari.onAudioProcessLog.push(now - lastOnAudioProcessTime);
        //    lastOnAudioProcessTime = now;
        //}

        // Assumes there is only one output channel
        var outputBuffer = event.outputBuffer.getChannelData(0);
        var outputBufferSize = outputBuffer.length;

        //if (outputBufferSize !== bufferSize) bufferSizeProblem = outputBufferSize;

        // Clear output buffer
        for (var j = outputBufferSize - 1; j >= 0; j = j - 1) outputBuffer[j] = 0;

        if (audioSignal.length === 0) return;

        // Mix all signals, performing resampling on-the-fly
        for (var i = audioSignal.length - 1; i >= 0; i = i - 1) {
            var resampFactor = resamplingFactor[i];
            var input = audioSignal[i].retrieveSamples((outputBufferSize * resampFactor + resamplingLeftOver[i]) | 0, mute);
            var inputBuffer = input.buffer;
            var inputBufferSize = input.bufferSize;

            // Copy to output performing basic re-sampling
            // Same as Util.arrayCopyCircularSourceWithStep, but optimized with local code
            var s = input.start + resamplingLeftOver[i];
            var d = 0;
            while (d < outputBufferSize) {
                outputBuffer[d] += inputBuffer[s | 0];   // source position as integer

                //COUNTER--; if (COUNTER < 0) {
                //    COUNTER = 160;
                //    SIGNAL = -SIGNAL;
                //}
                //outputBuffer[d] = SIGNAL * 0.4;

                d = d + 1;
                s = s + resampFactor;
                if (s >= inputBufferSize) s = s - inputBufferSize;
            }
            resamplingLeftOver[i] = s - (s | 0);        // fractional part
        }

        //var str = ""; for (var i = 0; i < audioSignal.length; i++) str = str + audioSignal[i].name + " ";
        //console.log("AudioProcess: " + str);
    }


    var screen;

    var audioSignal = [];
    this.signals = audioSignal;
    var resamplingFactor = [];
    var resamplingLeftOver = [];

    var prefs = Javatari.userPreferences.current;

    var bufferBaseSize = Javatari.AUDIO_MONITOR_BUFFER_BASE === -3 ? prefs.audioBufferBase : Javatari.AUDIO_MONITOR_BUFFER_BASE;

    var audioContext;
    var bufferSize;
    var processor;

    var mute = false;

    //var bufferSizeProblem;
    //Javatari.onAudioProcessLog = [ ];
    //var lastOnAudioProcessTime = 0;
    //var COUNTER = 0;
    //var SIGNAL = 1;

};
// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.LocalStorageSaveStateMedia = function() {
"use strict";

    this.connect = function(socket) {
        socket.connectMedia(this);
    };

    this.connectPeripherals = function(pFileDownloader) {
        fileDownloader = pFileDownloader;
    };

    this.isSlotUsed = function(slot) {
        return localStorage["javatarisave" + slot] !== undefined;
    };

    this.saveState = function(slot, state) {
        var data = buildDataFromState(state);
        return data && saveToLocalStorage("save" + slot, data);
    };

    this.loadState = function(slot) {
        var data = loadFromLocalStorage("save" + slot);
        return buildStateFromData(data);
    };

    this.saveStateFile = function(fileName, state) {
        var data = buildDataFromState(state);
        if (data) fileDownloader.startDownloadBinary((fileName || "Javatari SaveState") + SAVE_STATE_FILE_EXTENSION, data, "System State file");
    };

    this.loadStateFile = function(data) {
        return buildStateFromData(data);
    };

    this.saveResource = function(entry, data) {
        try {
            var res = data && JSON.stringify(data);
            return saveToLocalStorage("res" + entry, res);
        } catch(ex) {
            // give up
        }
    };

    this.loadResource = function(entry) {
        try {
            var res = loadFromLocalStorage("res" + entry);
            return res && JSON.parse(res);
        } catch(ex) {
            // give up
        }
    };

    var saveToLocalStorage = function(entry, data) {
        try {
            localStorage["javatari" + entry] = data;
            return true;
        } catch (ex) {
            jt.Util.error(ex);
            return false;
        }
    };

    var loadFromLocalStorage = function(entry) {
        try {
            return localStorage["javatari" + entry];
        } catch (ex) {
            jt.Util.warning(ex);
            // give up
        }
    };

    var buildDataFromState = function(state) {
        try {
            return SAVE_STATE_IDENTIFIER + JSON.stringify(state);
        } catch(ex) {
            jt.Util.error(ex);
            // give up
        }
    };

    var buildStateFromData = function (data) {
        try {
            var id;
            if (typeof data == "string")
                id = data.substr(0, SAVE_STATE_IDENTIFIER.length);
            else
                id = jt.Util.int8BitArrayToByteString(data, 0, SAVE_STATE_IDENTIFIER.length);

            // Check for the identifier
            if (id !== SAVE_STATE_IDENTIFIER && id !== SAVE_STATE_IDENTIFIER_OLD) return;

            var stateData;
            if (typeof data == "string")
                stateData = data.slice(SAVE_STATE_IDENTIFIER.length);
            else
                stateData = jt.Util.int8BitArrayToByteString(data, SAVE_STATE_IDENTIFIER.length);

            return stateData && JSON.parse(stateData);
        } catch(ex) {
            jt.Util.error(ex);
        }
    };


    var fileDownloader;

    var SAVE_STATE_IDENTIFIER = String.fromCharCode(0, 0) + "javataristate!";     // char 0 so browsers like Safari think the file is binary...  :-(
    var SAVE_STATE_IDENTIFIER_OLD = "javatarijsstate!";
    var SAVE_STATE_FILE_EXTENSION = ".jst";

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.PeripheralControls = {

    SCREEN_ASPECT_PLUS: 1, SCREEN_ASPECT_MINUS: 2,
    SCREEN_SCALE_PLUS: 3, SCREEN_SCALE_MINUS: 4,
    VIEWPORT_ORIGIN_PLUS: 5, VIEWPORT_ORIGIN_MINUS: 6,
    VIEWPORT_SIZE_PLUS: 7, VIEWPORT_SIZE_MINUS: 8,

    SCREEN_FULLSCREEN: 10,
    SCREEN_CRT_FILTER: 11, SCREEN_CRT_MODE: 12,
    SCREEN_TOGGLE_MENU: 13,
    SCREEN_OPEN_HELP: 14,
    SCREEN_OPEN_ABOUT: 15,
    SCREEN_OPEN_SETTINGS: 16,
    SCREEN_OPEN_QUICK_OPTIONS: 17,
    SCREEN_DEFAULTS: 18,

    SCREEN_CONSOLE_PANEL_TOGGLE: 19,

    SPEAKER_BUFFER_TOGGLE: 20,

    MACHINE_POWER_TOGGLE: 102, MACHINE_POWER_FRY: 103,
    MACHINE_LOAD_STATE_FILE: 104, MACHINE_SAVE_STATE_FILE: 105, MACHINE_LOAD_STATE_MENU: 106, MACHINE_SAVE_STATE_MENU: 107,

    P1_CONTROLS_TOGGLE: 201, JOYSTICKS_TOGGLE_MODE: 202, PADDLES_TOGGLE_MODE: 203, TOUCH_TOGGLE_MODE: 204, TOUCH_TOGGLE_DIR_BIG: 205, TURBO_FIRE_TOGGLE: 206,
    HAPTIC_FEEDBACK_TOGGLE_MODE: 207,

    CAPTURE_SCREEN: 304,

    CARTRIDGE_LOAD_RECENT: 40,
    CARTRIDGE_LOAD_FILE: 41, CARTRIDGE_LOAD_URL: 42, CARTRIDGE_REMOVE: 43, CARTRIDGE_LOAD_DATA_FILE: 44, CARTRIDGE_SAVE_DATA_FILE: 45,
    AUTO_LOAD_FILE: 46, AUTO_LOAD_URL: 47

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.DOMPeripheralControls = function() {
"use strict";

    var self = this;

    function init() {
        initKeys();
    }

    this.connect = function(pConsoleControlsSocket, pCartridgeSocket) {
        consoleControlsSocket = pConsoleControlsSocket;
        cartridgeSocket = pCartridgeSocket;
    };

    this.connectPeripherals = function(pScreen, pSpeaker, pConsoleControls, pFileLoader) {
        screen = pScreen;
        speaker = pSpeaker;
        monitor = pScreen.getMonitor();
        consoleControls = pConsoleControls;
        fileLoader = pFileLoader;
    };

    this.getControlReport = function(control) {
        switch (control) {
            case controls.PADDLES_TOGGLE_MODE:
            case controls.TURBO_FIRE_TOGGLE:
            case controls.TOUCH_TOGGLE_DIR_BIG:
            case controls.HAPTIC_FEEDBACK_TOGGLE_MODE:
                return consoleControls.getControlReport(control);
            case controls.SCREEN_CRT_FILTER:
                return screen.getControlReport(control);
            case controls.SPEAKER_BUFFER_TOGGLE:
                return speaker.getControlReport(control);
        }
        return { label: "Unknown", active: false };
    };

    this.processKey = function(code, press) {
        if (!press) return false;
        var control = keyCodeMap[code] || keyCodeMap[code & EXCLUDE_SHIFT_MASK];
        if (!control) return false;

        self.controlActivated(control, !!(code & INCLUDE_SHIFT_MASK), false);     // Never secPort
        return true;
    };

    this.controlActivated = function(control, altPower, secPort) {                // Never secPort
        // All controls are Press-only and repeatable
        switch(control) {
            case controls.MACHINE_POWER_TOGGLE:
                consoleControlsSocket.controlStateChanged(jt.ConsoleControls.POWER, true);
                break;
            case controls.MACHINE_POWER_FRY:
                consoleControlsSocket.controlStateChanged(jt.ConsoleControls.POWER_FRY, true);
                break;
            case controls.MACHINE_LOAD_STATE_FILE:
                if (!mediaChangeDisabledWarning()) fileLoader.openFileChooserDialog(OPEN_TYPE.STATE, false, false, false);
                break;
            case controls.MACHINE_SAVE_STATE_FILE:
                consoleControlsSocket.controlStateChanged(jt.ConsoleControls.SAVE_STATE_FILE, true);
                break;
            case controls.MACHINE_LOAD_STATE_MENU:
                screen.openSaveStateDialog(false);
                break;
            case controls.MACHINE_SAVE_STATE_MENU:
                screen.openSaveStateDialog(true);
                break;
            case controls.CARTRIDGE_LOAD_RECENT:
                if (!mediaChangeDisabledWarning()) screen.openCartridgeChooserDialog(false, altPower, secPort);
                break;
            case controls.CARTRIDGE_LOAD_FILE:
                if (!mediaChangeDisabledWarning()) fileLoader.openFileChooserDialog(OPEN_TYPE.ROM, altPower, secPort, false);
                break;
            case controls.CARTRIDGE_LOAD_URL:
                if (!mediaChangeDisabledWarning()) fileLoader.openURLChooserDialog(OPEN_TYPE.ROM, altPower, secPort);
                break;
            case controls.CARTRIDGE_REMOVE:
                if (!mediaChangeDisabledWarning()) cartridgeSocket.insert(null, false);
                break;
            case controls.CARTRIDGE_LOAD_DATA_FILE:
                //if (cartridgeSocket.dataOperationNotSupportedMessage(secPort ? 1 : 0, false, false)) break;
                //fileLoader.openFileChooserDialog(OPEN_TYPE.CART_DATA, altPower, secPort, false);
                break;
            case controls.CARTRIDGE_SAVE_DATA_FILE:
                //cartridgeSocket.saveCartridgeDataFile(secPort ? 1 : 0);
                break;
            case controls.AUTO_LOAD_FILE:
                if (!mediaChangeDisabledWarning()) fileLoader.openFileChooserDialog(OPEN_TYPE.AUTO, altPower, secPort, false);
                break;
            case controls.AUTO_LOAD_URL:
                if (!mediaChangeDisabledWarning()) fileLoader.openURLChooserDialog(OPEN_TYPE.AUTO, altPower, secPort, false);
                break;
            case controls.SCREEN_CRT_MODE:
                monitor.crtModeToggle(); break;
            case controls.SCREEN_CRT_FILTER:
                monitor.crtFilterToggle(); break;
            case controls.SCREEN_FULLSCREEN:
                monitor.fullscreenToggle(); break;
            case controls.SCREEN_DEFAULTS:
                consoleControlsSocket.setDefaults();
                monitor.setDefaults();
                monitor.showOSD("Default Settings", true);
                break;
            case controls.SCREEN_TOGGLE_MENU:
                screen.toggleMenuByKey();
                break;
            case controls.SCREEN_OPEN_HELP:
                screen.openHelp();
                break;
            case controls.SCREEN_OPEN_ABOUT:
                screen.openAbout();
                break;
            case controls.SCREEN_OPEN_SETTINGS:
                if (altPower) return this.controlActivated(controls.SCREEN_DEFAULTS);
                screen.openSettings();
                break;
            case controls.SCREEN_OPEN_QUICK_OPTIONS:
                screen.openQuickOptionsDialog();
                break;
            case controls.SCREEN_CONSOLE_PANEL_TOGGLE:
                screen.toggleConsolePanel();
                break;
            case controls.P1_CONTROLS_TOGGLE:
                consoleControls.toggleP1ControlsMode(); break;
            case controls.JOYSTICKS_TOGGLE_MODE:
                consoleControls.toggleGamepadMode(); break;
            case controls.PADDLES_TOGGLE_MODE:
                consoleControls.togglePaddleMode(); break;
            case controls.TOUCH_TOGGLE_MODE:
                consoleControls.toggleTouchControlsMode(); break;
            case controls.TOUCH_TOGGLE_DIR_BIG:
                consoleControls.toggleTouchDirBig(); break;
            case controls.TURBO_FIRE_TOGGLE:
                consoleControls.toggleTurboFireSpeed(); break;
            case controls.HAPTIC_FEEDBACK_TOGGLE_MODE:
                consoleControls.toggleHapticFeedback(); break;
            case controls.CAPTURE_SCREEN:
                screen.saveScreenCapture(); break;
            case controls.SPEAKER_BUFFER_TOGGLE:
                speaker.toggleBufferBaseSize(); break;
            case controls.VIEWPORT_ORIGIN_MINUS:
                monitor.viewportOriginDecrease(); break;
            case controls.VIEWPORT_ORIGIN_PLUS:
                monitor.viewportOriginIncrease(); break;
        }
        if (SCREEN_FIXED_SIZE) return;
        switch(control) {
            case controls.SCREEN_ASPECT_MINUS:
                monitor.displayAspectDecrease(); break;
            case controls.SCREEN_ASPECT_PLUS:
                monitor.displayAspectIncrease(); break;
            case controls.SCREEN_SCALE_MINUS:
                monitor.displayScaleDecrease(); break;
            case controls.SCREEN_SCALE_PLUS:
                monitor.displayScaleIncrease(); break;
            case controls.VIEWPORT_SIZE_MINUS:
                monitor.viewportSizeDecrease(); break;
            case controls.VIEWPORT_SIZE_PLUS:
                monitor.viewportSizeIncrease(); break;
        }
    };

    var mediaChangeDisabledWarning = function() {
        if (Javatari.CARTRIDGE_CHANGE_DISABLED) {
            monitor.showOSD("Cartridge change is disabled!", true, true);
            return true;
        }
        return false;
    };

    var initKeys = function() {
        var k = jt.DOMKeys;

        keyCodeMap[KEY_LOAD_RECENT]           = controls.CARTRIDGE_LOAD_RECENT;
        keyCodeMap[KEY_LOAD_RECENT | k.ALT]   = controls.CARTRIDGE_LOAD_RECENT;
        keyCodeMap[KEY_LOAD_URL]            = controls.AUTO_LOAD_URL;
        keyCodeMap[KEY_LOAD_URL | k.ALT]    = controls.AUTO_LOAD_URL;
        keyCodeMap[KEY_CART_REMOVE]         = controls.CARTRIDGE_REMOVE;
        keyCodeMap[KEY_CART_REMOVE | k.ALT] = controls.CARTRIDGE_REMOVE;
        keyCodeMap[KEY_STATE_FILE]          = controls.MACHINE_SAVE_STATE_FILE;
        keyCodeMap[KEY_STATE_FILE | k.ALT]  = controls.MACHINE_SAVE_STATE_FILE;

        keyCodeMap[KEY_P1_CONTROLS_TOGGLE | k.ALT]    = controls.P1_CONTROLS_TOGGLE;
        keyCodeMap[KEY_PADDLES_TOGGLE | k.ALT]        = controls.PADDLES_TOGGLE_MODE;
        keyCodeMap[KEY_JOYSTICKS_TOGGLE | k.ALT]      = controls.JOYSTICKS_TOGGLE_MODE;
        keyCodeMap[KEY_TOUCH_TOGGLE | k.ALT]          = controls.TOUCH_TOGGLE_MODE;
        keyCodeMap[KEY_TURBO_FIRE_TOGGLE | k.ALT]     = controls.TURBO_FIRE_TOGGLE;

        keyCodeMap[KEY_CRT_FILTER | k.ALT]      = controls.SCREEN_CRT_FILTER;
        keyCodeMap[KEY_CRT_MODE | k.ALT] 	    = controls.SCREEN_CRT_MODE;
        keyCodeMap[KEY_SETTINGS | k.ALT]    	= controls.SCREEN_OPEN_SETTINGS;
        keyCodeMap[KEY_QUICK_OPTIONS | k.ALT] 	= controls.SCREEN_OPEN_QUICK_OPTIONS;
        keyCodeMap[KEY_CONSOLE_PANEL | k.ALT] 	= controls.SCREEN_CONSOLE_PANEL_TOGGLE;

        keyCodeMap[KEY_FULLSCREEN | k.ALT]  = controls.SCREEN_FULLSCREEN;

        keyCodeMap[KEY_UP | k.CONTROL | k.ALT]     = controls.SCREEN_SCALE_MINUS;
        keyCodeMap[KEY_DOWN | k.CONTROL | k.ALT]   = controls.SCREEN_SCALE_PLUS;
        keyCodeMap[KEY_LEFT | k.CONTROL | k.ALT]   = controls.SCREEN_ASPECT_MINUS;
        keyCodeMap[KEY_RIGHT | k.CONTROL | k.ALT]  = controls.SCREEN_ASPECT_PLUS;

        keyCodeMap[KEY_UP | k.SHIFT | k.CONTROL]     = controls.VIEWPORT_ORIGIN_MINUS;
        keyCodeMap[KEY_DOWN | k.SHIFT | k.CONTROL]   = controls.VIEWPORT_ORIGIN_PLUS;
        keyCodeMap[KEY_LEFT | k.SHIFT | k.CONTROL]   = controls.VIEWPORT_SIZE_MINUS;
        keyCodeMap[KEY_RIGHT | k.SHIFT | k.CONTROL]  = controls.VIEWPORT_SIZE_PLUS;

        keyCodeMap[KEY_MENU]         	  = controls.SCREEN_TOGGLE_MENU;
        keyCodeMap[KEY_DEFAULTS]          = controls.SCREEN_DEFAULTS;
        keyCodeMap[KEY_DEFAULTS | k.ALT]  = controls.SCREEN_DEFAULTS;

        keyCodeMap[KEY_CAPTURE_SCREEN | k.ALT] = controls.CAPTURE_SCREEN;

        keyCodeMap[KEY_SPEAKER_BUFFER | k.ALT] = controls.SPEAKER_BUFFER_TOGGLE;
    };


    var controls = jt.PeripheralControls;

    var consoleControlsSocket;
    var screen;
    var monitor;
    var speaker;
    var consoleControls;
    var fileLoader;
    var cartridgeSocket;

    var keyCodeMap = {};                // SHIFT is considered differently

    var EXCLUDE_SHIFT_MASK = ~jt.DOMKeys.SHIFT;
    var INCLUDE_SHIFT_MASK = jt.DOMKeys.SHIFT;

    var OPEN_TYPE = jt.FileLoader.OPEN_TYPE;

    var KEY_LEFT    = jt.DOMKeys.VK_LEFT.c;
    var KEY_UP      = jt.DOMKeys.VK_UP.c;
    var KEY_RIGHT   = jt.DOMKeys.VK_RIGHT.c;
    var KEY_DOWN    = jt.DOMKeys.VK_DOWN.c;

    var KEY_MENU      = jt.DOMKeys.VK_CONTEXT.c;
    var KEY_DEFAULTS  = jt.DOMKeys.VK_BACKSPACE.c;

    var KEY_CAPTURE_SCREEN  = jt.DOMKeys.VK_X.c;

    var KEY_SPEAKER_BUFFER  = jt.DOMKeys.VK_A.c;

    var KEY_LOAD_RECENT = jt.DOMKeys.VK_F5.c;
    var KEY_LOAD_URL    = jt.DOMKeys.VK_F6.c;
    var KEY_CART_REMOVE = jt.DOMKeys.VK_F7.c;

    var KEY_P1_CONTROLS_TOGGLE    = jt.DOMKeys.VK_K.c;
    var KEY_JOYSTICKS_TOGGLE      = jt.DOMKeys.VK_J.c;
    var KEY_PADDLES_TOGGLE        = jt.DOMKeys.VK_L.c;
    var KEY_TOUCH_TOGGLE          = jt.DOMKeys.VK_N.c;
    var KEY_TURBO_FIRE_TOGGLE     = jt.DOMKeys.VK_H.c;

    var KEY_CRT_MODE      = jt.DOMKeys.VK_R.c;
    var KEY_CRT_FILTER    = jt.DOMKeys.VK_T.c;
    var KEY_SETTINGS      = jt.DOMKeys.VK_Y.c;
    var KEY_QUICK_OPTIONS = jt.DOMKeys.VK_U.c;
    var KEY_CONSOLE_PANEL = jt.DOMKeys.VK_S.c;

    var KEY_FULLSCREEN  = jt.DOMKeys.VK_ENTER.c;

    var KEY_MACHINE_POWER  = jt.DOMKeys.VK_F1.c;
    var KEY_STATE_FILE     = jt.DOMKeys.VK_F8.c;

    var SCREEN_FIXED_SIZE = Javatari.SCREEN_RESIZE_DISABLED;


    init();

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Room = function(screenElement, consoleStartPowerOn) {
"use strict";

    var self = this;

    function init() {
        buildPeripherals();
        buildAndPlugConsole();
    }

    this.powerOn = function() {
        self.screen.powerOn();
        self.speaker.powerOn();
        self.consoleControls.powerOn();
        self.setLoading(true);
        roomPowerOnTime = Date.now();
    };

    this.powerOff = function() {
        self.console.powerOff();
        self.consoleControls.powerOff();
        self.speaker.powerOff();
        self.screen.powerOff();
    };

    this.setLoading = function(boo) {
        if (this.isLoading === boo) return;
        this.isLoading = boo;
        this.console.setLoading(this.isLoading);
        this.screen.setLoading(this.isLoading);
    };

    this.start = function(startAction) {
        jt.Clock.detectHostNativeFPSAndCallback(function(nativeFPS) {
            self.console.vSynchSetSupported(nativeFPS > 0);
            afterPowerONDelay(function () {
                self.setLoading(false);
                self.screen.start(startAction || consolePowerOnStartAction);
            });
        });
    };

    function afterPowerONDelay(func) {
        var wait = Javatari.AUTO_POWER_ON_DELAY;
        if (wait >= 0 && JavatariFullScreenSetup.shouldStartInFullScreen()) wait += 1400;   // Wait a bit more
        wait -= (Date.now() - roomPowerOnTime);
        if (wait < 1) wait = 1;
        setTimeout(func, wait);
    }

    function consolePowerOnStartAction() {
        if (!consoleStartPowerOn) return;
        if (self.console.getCartridgeSocket().inserted()) self.console.userPowerOn();
        else if (Javatari.CARTRIDGE_SHOW_RECENT && !Javatari.CARTRIDGE_CHANGE_DISABLED) self.screen.openCartridgeChooserDialog(true);   // Show even if no recent ROMs present
    }

    function buildPeripherals() {
        self.peripheralControls = new jt.DOMPeripheralControls();
        self.consoleControls = new jt.DOMConsoleControls(self.peripheralControls);
        self.fileDownloader = new jt.FileDownloader();
        self.stateMedia = new jt.LocalStorageSaveStateMedia();
        self.recentROMs = new jt.RecentStoredROMs();
        self.fileLoader = new jt.FileLoader(self.recentROMs);
        self.speaker = new jt.WebAudioSpeaker(screenElement);
        self.screen = new jt.CanvasDisplay(screenElement);

        self.fileDownloader.connectPeripherals(self.screen);
        self.screen.connectPeripherals(self.recentROMs, self.fileLoader, self.fileDownloader, self.consoleControls, self.peripheralControls, self.stateMedia);
        self.speaker.connectPeripherals(self.screen);
        self.consoleControls.connectPeripherals(self.screen);
        self.stateMedia.connectPeripherals(self.fileDownloader);
        self.peripheralControls.connectPeripherals(self.screen, self.speaker, self.consoleControls, self.fileLoader);
    }

    function buildAndPlugConsole() {
        self.console = new jt.AtariConsole();
        self.stateMedia.connect(self.console.getSavestateSocket());
        self.fileLoader.connect(self.console);
        self.screen.connect(self.console);
        self.speaker.connect(self.console.getAudioSocket());
        self.consoleControls.connect(self.console.getConsoleControlsSocket());
        self.peripheralControls.connect(self.console.getConsoleControlsSocket(), self.console.getCartridgeSocket());
        // Cartridge Data operations unavailable self.console.getCartridgeSocket().connectFileDownloader(self.fileDownloader);
    }


    this.console = null;
    this.screen = null;
    this.speaker = null;
    this.consoleControls = null;
    this.fileDownloader = null;
    this.stateMedia = null;
    this.recentROMs = null;
    this.fileLoader = null;
    this.peripheralControls = null;

    this.isLoading = false;

    var roomPowerOnTime;


    init();

};


// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

Javatari.userPreferences = { };

Javatari.userPreferences.currentVersion = 1;
Javatari.userPreferences.compatibleVersions = new Set([ 1 ]);

Javatari.userPreferences.defaults = function() {
"use strict";

    var k = jt.DOMKeys;

    return {

        joystickKeys: [
            {
                left:    k.VK_LEFT,
                up:      k.VK_UP,
                right:   k.VK_RIGHT,
                down:    k.VK_DOWN,
                button:  k.VK_SPACE,
                buttonT: k.VK_DELETE
            }, {
                left:    k.VK_F,
                up:      k.VK_T,
                right:   k.VK_H,
                down:    k.VK_G,
                button:  k.VK_A,
                buttonT: k.VK_PERIOD
            }
        ],

        joystickGamepads: [
            {
                button:        0,
                buttonT:       1,
                select:        8,
                reset:         9,
                pause:         4,
                fastSpeed:     7,
                slowSpeed:     6,
                device:        -1,  // -1 = auto
                xAxis:         0,
                xAxisSig:      1,
                yAxis:         1,
                yAxisSig:      1,
                paddleAxis:    0,
                paddleAxisSig: 1,
                paddleCenter:  0.3,
                paddleSens:    0.75,
                deadzone:      0.3
            }, {
                button:        0,
                buttonT:       1,
                select:        8,
                reset:         9,
                pause:         4,
                fastSpeed:     7,
                slowSpeed:     6,
                device:        -1,  // -1 = auto
                xAxis:         0,
                xAxisSig:      1,
                yAxis:         1,
                yAxisSig:      1,
                paddleAxis:    0,
                paddleAxisSig: 1,
                paddleCenter:  0.3,
                paddleSens:    0.75,
                deadzone:      0.3
            }
        ],

        touch: {
            directionalBig: false
        },

        hapticFeedback: true,
        turboFireSpeed: 6,

        vSynch: null,                      // as specified in parameters
        crtFilter: null,                   // as specified in parameters

        audioBufferBase: -1                // auto

    };
};

Javatari.userPreferences.load = function() {
    var prefs;

    // Load from Local Storage
    try {
        prefs = JSON.parse(localStorage.javatari4prefs || "{}");
        // Migrations from old to new version control fields
        if (prefs.version) delete prefs.version;
    } catch(e) {
        // Give up
    }

    // Absent or incompatible version
    if (!prefs || !Javatari.userPreferences.compatibleVersions.has(prefs.prefsVersion)) {
        // Create new empty preferences and keep settings as possible
        var oldPrefs = prefs;
        prefs = {};
        if (oldPrefs) {
            // Migrations
        }
    }

    // Fill missing properties with defaults
    var defs = Javatari.userPreferences.defaults();
    for (var pref in defs)
        if (prefs[pref] === undefined) prefs[pref] = defs[pref];

    prefs.prefsVersion = Javatari.userPreferences.currentVersion;

    // Update current preferences
    if (!Javatari.userPreferences.current) Javatari.userPreferences.current = {};
    var cur = Javatari.userPreferences.current;
    for (pref in prefs) cur[pref] = prefs[pref];

    Javatari.userPreferences.isDirty = false;
};

Javatari.userPreferences.setDefaultJoystickKeys = function() {
    Javatari.userPreferences.current.joystickKeys = Javatari.userPreferences.defaults().joystickKeys;
    Javatari.userPreferences.setDirty();
};

Javatari.userPreferences.save = function() {
    if (!Javatari.userPreferences.isDirty) return;

    try {
        Javatari.userPreferences.current.javatariVersion = Javatari.VERSION;
        localStorage.javatari4prefs = JSON.stringify(Javatari.userPreferences.current);
        Javatari.userPreferences.isDirty = false;

        jt.Util.log("Preferences saved!");
    } catch (e) {
        // give up
    }
};

Javatari.userPreferences.setDirty = function() {
    Javatari.userPreferences.isDirty = true;
};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Images.embedded = true;

jt.Images.urls.logo = "data:image/png;base64,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";
jt.Images.urls.loading = "data:image/gif;base64,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";
jt.Images.urls.mouseCursor = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABL0lEQVRYw+3VP0oDQRTH8U8k+AcFFRUFERGLiFjEA1jZTo6RG6T3ArmFR9j0WlpaWBiwsNNyiwgW0Vg4CUPELhMt9guPffumeG9nf/MbvlnEYVmWo3a7PcIO1s2R3aT5KQ6wMo/GC/G5nNTWsYr6PHdgE+fJLjRxhFqMbNSxFr96K6nvYxhr7zE+Y8yUWghhNH5pNBr6/f5ksdfrXeA1xiCbBoqiUBSF6RwN7GIptwh/4wR7UyKduQZ0Op1JIc2xHTVSzzpAt9v9sdBqtczTB/6Mfz/A2AOGOYe4DCGMUqI33OAKl1MmNVsjwhmaIYTrxIBu8YA73OMZb7kG2MFhPPPH2ECJJzzG5iU+ch3DMvnfL/HcDxILztZcctPVo9stxXyYCPBDRUVFRUVFRUa+AB+1YCivg1lPAAAAAElFTkSuQmCC";
jt.Images.urls.panel = "data:image/jpeg;base64,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";
jt.Images.urls.panelSprites = "data:image/jpeg;base64,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";
jt.Images.urls.controllers = "data:image/jpeg;base64,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";
jt.Images.urls.iconSprites = "data:image/png;base64,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";

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Configurator = {

    applyConfig: function() {

        var urlParams = {};

        // Override parameters with values set in URL, if allowed
        if (Javatari.ALLOW_URL_PARAMETERS) {
            urlParams = parseURLParams();
            // First override PRESETS parameters
            if (urlParams.PRESETS) { this.applyParam("PRESETS", urlParams.PRESETS); delete urlParams.PRESETS }
        }

        // Apply reset
        if (urlParams.RESET) this.applyReset();

        // Apply  presets
        this.applyPresets(Javatari.PRESETS);

        // Apply additional single parameter overrides
        for (var param in urlParams) this.applyParam(param, urlParams[param]);

        // Ensure the correct types of the parameters
        normalizeParameterTypes();

        function parseURLParams() {
            var search = (window.location.search || "").split('+').join(' ');
            var reg = /[?&]?([^=]+)=([^&]*)/g;
            var tokens;
            var parameters = {};
            while (tokens = reg.exec(search)) {
                var parName = decodeURIComponent(tokens[1]).trim().toUpperCase();
                parName = jt.Configurator.abbreviations[parName] || parName;
                parameters[parName] = decodeURIComponent(tokens[2]).trim();
            }
            return parameters;
        }

        function normalizeParameterTypes() {
            Javatari.AUTO_POWER_ON_DELAY |= 0;
            Javatari.CARTRIDGE_CHANGE_DISABLED = Javatari.CARTRIDGE_CHANGE_DISABLED === true || Javatari.CARTRIDGE_CHANGE_DISABLED == "true";
            Javatari.SCREEN_RESIZE_DISABLED = Javatari.SCREEN_RESIZE_DISABLED === true || Javatari.SCREEN_RESIZE_DISABLED == "true";
            Javatari.SCREEN_FULLSCREEN_MODE = Javatari.SCREEN_FULLSCREEN_MODE |= 0;
            Javatari.SCREEN_FILTER_MODE |= 0;
            Javatari.SCREEN_CRT_MODE |= 0;
            Javatari.SCREEN_DEFAULT_SCALE = parseFloat(Javatari.SCREEN_DEFAULT_SCALE);
            Javatari.SCREEN_DEFAULT_ASPECT = parseFloat(Javatari.SCREEN_DEFAULT_ASPECT);
            Javatari.SCREEN_CANVAS_SIZE = Javatari.SCREEN_CANVAS_SIZE | 0;
            Javatari.SCREEN_CONTROL_BAR |= 0;
            Javatari.SCREEN_FORCE_HOST_NATIVE_FPS |= 0;
            Javatari.SCREEN_VSYNCH_MODE |= 0;
            Javatari.AUDIO_MONITOR_BUFFER_BASE |= 0;
            Javatari.AUDIO_MONITOR_BUFFER_SIZE |= 0;
            Javatari.AUDIO_SIGNAL_BUFFER_RATIO = parseFloat(Javatari.AUDIO_SIGNAL_BUFFER_RATIO);
            Javatari.AUDIO_SIGNAL_ADD_FRAMES |= 0;
        }
    },

    applyPresets: function(presetList) {
        var presetNames = (presetList || "").trim().toUpperCase().split(",");
        // Apply list in order
        for (var i = 0; i < presetNames.length; i++)
            this.applyPreset(presetNames[i].trim());
    },

    applyPreset: function(presetName) {
        if (!presetName) return;
        var presetPars = Javatari.PRESETS_CONFIG[presetName];
        if (presetPars) {
            jt.Util.log("Applying preset: " + presetName);
            for (var par in presetPars) {
                var parName = par.trim().toUpperCase();
                if (parName[0] !== "_") this.applyParam(parName, presetPars[par]);      // Normal Parameter to set
                else if (parName === "_INCLUDE") this.applyPresets(presetPars[par]);    // Preset to include
            }
        } else
            jt.Util.warning("Preset \"" + presetName + "\" not found, skipping...");
    },

    applyParam: function(name, value) {
        if (name.indexOf(".") < 0)
            Javatari[name] = value;
        else {
            var obj = Javatari;
            var parts = name.split('.');
            for (var p = 0; p < parts.length - 1; ++p) {
                obj = obj[parts[p]];
            }
            obj[parts[parts.length - 1]] = value;
        }
    },

    mediaURLSpecs: function() {
        // URLs specified by fixed media loading parameters
        var OPEN_TYPE = jt.FileLoader.OPEN_TYPE;
        return [
            Javatari.AUTODETECT_URL && {
                url: Javatari.AUTODETECT_URL,
                onSuccess: function (res) {
                    Javatari.room.fileLoader.loadFromContent(res.url, res.content, OPEN_TYPE.AUTO, 0, true, false);
                }
            },
            Javatari.CARTRIDGE_URL && {
                url: Javatari.CARTRIDGE_URL,
                onSuccess: function (res) {
                    Javatari.room.fileLoader.loadFromContent(res.url, res.content, OPEN_TYPE.ROM, 0, true, false, Javatari.CARTRIDGE_FORMAT);
                }
            }
        ];
    },

    applyReset: function() {
        jt.Util.warning("Removing all data saved on this client");
        for(var p in localStorage)
            if (p.indexOf("javatari") === 0) delete localStorage[p];
    },

    abbreviations: {
        P: "PRESETS",
        PRESET: "PRESETS",
        ROM: "CARTRIDGE_URL",
        CART: "CARTRIDGE_URL",
        FORMAT: "CARTRIDGE_FORMAT",
        ROM_FORMAT: "CARTRIDGE_FORMAT",
        CART_FORMAT: "CARTRIDGE_FORMAT",
        ANY: "AUTODETECT_URL",
        AUTO: "AUTODETECT_URL",
        AUTODETECT: "AUTODETECT_URL",
        STATE: "STATE_URL",
        SAVESTATE: "STATE_URL",
        VERSION: "VERSION_CHANGE_ATTEMPTED"      // Does not allow version to be changed ;-)
    }

};

// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

Javatari.start = function (consolePowerOn) {
"use strict";

    // Emulator can only be started once
    delete Javatari.start;
    delete Javatari.preLoadImagesAndStart;

    // Init preferences
    Javatari.userPreferences.load();

    // Get container elements
    if (!Javatari.screenElement) {
        Javatari.screenElement = document.getElementById(Javatari.SCREEN_ELEMENT_ID);
        if (!Javatari.screenElement)
            throw new Error('Javatari cannot be started. ' +
            'HTML document is missing screen element with id "' + Javatari.SCREEN_ELEMENT_ID + '"');
    }

    // Apply Configuration, including Machine Type and URL Parameters if allowed
    jt.Configurator.applyConfig();

    // Build and start emulator
    if (consolePowerOn === undefined) consolePowerOn = Javatari.AUTO_POWER_ON_DELAY >= 0;
    Javatari.room = new jt.Room(Javatari.screenElement, consolePowerOn);
    Javatari.room.powerOn();
    jt.Util.log("version " + Javatari.VERSION + " started");

    // Prepare ROM Database
    jt.CartridgeDatabase.uncompress();

    // Auto-load BIOS, Expansions, State, Cartridges, Disks and Tape files if specified and downloadable
    if (Javatari.STATE_URL) {
        // State loading, Console will Auto Power on
        new jt.MultiDownloader(
            [{ url: Javatari.STATE_URL }],
            function onAllSuccess(urls) {
                Javatari.room.start(function() {
                    Javatari.room.fileLoader.loadFromContent(urls[0].url, urls[0].content, jt.FileLoader.OPEN_TYPE.STATE, 0, false);
                });
            }
        ).start();
    } else {
        // Normal media loading. Power Console on only after all files are loaded and inserted
        var mediaURLs = jt.Configurator.mediaURLSpecs();
        new jt.MultiDownloader(
            mediaURLs,
            function onAllSuccess() {
                Javatari.room.start();
            }
        ).start();
    }

    Javatari.shutdown = function () {
        if (Javatari.room) Javatari.room.powerOff();
        jt.Util.log("shutdown");
    };

};

// Pre-load images if needed and start emulator as soon as all are loaded and DOM is ready
Javatari.preLoadImagesAndStart = function() {
    var domReady = false;
    var imagesToLoad = jt.Images.embedded ? 0 : jt.Images.count;

    function tryStart(bypass) {
        if (Javatari.start && Javatari.AUTO_START && (bypass || (domReady && imagesToLoad === 0)))
            Javatari.start();
    }

    document.addEventListener("DOMContentLoaded", function() {
        domReady = true;
        tryStart(false);
    });

    if (imagesToLoad > 0) {
        for (var i in jt.Images.urls) {
            var img = new Image();
            img.src = jt.Images.urls[i];
            img.onload = function () {
                imagesToLoad--;
                tryStart(false);
            };
        }
    }

    window.addEventListener("load", function() {
        tryStart(true);
    });
};

// AppCache update control
if (window.applicationCache) {
    function onUpdateReady() {
        alert("A new version is available!\nJavatari will restart...");
        window.applicationCache.swapCache();
        window.location.reload();
    }
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) onUpdateReady();
    else window.applicationCache.addEventListener("updateready", onUpdateReady);
}

Javatari.VERSION = "4.0.1";

// Start pre-loading images right away
Javatari.preLoadImagesAndStart();
