DomBuilder = function(){
	
	//Attribute definition
	function Attribute(name,value){
		this.name = name;
		this.value = value;
	}
	
	//Text definition
	function Text(value){
		this.value = value;
	}
	
	// EventHandler definition
	function EventHandler(name, handlingFunction){
		this.name = name;
		this.handlingFunction = handlingFunction;
		this.args = [];
		for(var i=2; i<arguments.length; i++){
			args.push(arguments[i]);
		}
	}

	// Node definition
	function Node(name){
		this.name = name;
		this.attributes= [];
		this.childs = [];
		this.eventHandlers = [];

		this.hasText = function(){
			return this.text !== undefined && this.text !== null;
		}

		for(var i=1; i<arguments.length; i++){
			var arg = arguments[i];
			
			if(arg instanceof Attribute){
				this.attributes.push(arg);

			}else if(arg instanceof Node){
				this.childs.push(arg);
			
			}else if(arg instanceof EventHandler){
				this.eventHandlers.push(arg);
	
			}else if(arg instanceof Text){
				if(!this.hasText()){
					this.text = arg;
				}else{
					throw Error("Can only assign a Text instance to a Node");
				}
			}else{
				throw Error("Unrecognized object received");
			}
		}
	}

	/*
	 * THE BUILDER FUNCTION
	 */
	var build = function(node){
		if(node instanceof Node){
			console.debug("Building node: " + node);
			
			var elem = window.document.createElement(node.name);
			
			//Handle Attributes
			node.attributes.forEach(function(attribute){
				if(attribute instanceof Attribute){
					elem.setAttribute(attribute.name, attribute.value);		
				}else{
					throw Error("Invalid Attribute object received")	
				}
			});

			//Handle Text
			if(node.hasText()){
				elem.appendChild(window.document.createTextNode(node.text.value));
			}
	
			//Handle event handlers
			node.eventHandlers.forEach(function(eh){
				elem[eh.name] = function (){eh.handlingFunction.apply(this, eh.args)}; 
			});

			//Handle child nodes
			node.childs.forEach(function(c){
				elem.appendChild(build(c));
			});
			return elem;
		}else{
			throw Error("Invalid Node object received");
		}
	}


	/*
	 *	FACTORY FUNCTIONS
	 */
	var createObject = function(type, argsToApply){
		var ctorArgsArray = Array.prototype.slice.call(argsToApply);
		var curriedCtor = Function.prototype.bind.apply(type, [null].concat(ctorArgsArray));
  		return new curriedCtor();
	}

	var createObjectAlias = function(alias, type, argsToApply){
		var ctorArgsArray = Array.prototype.slice.call(argsToApply);
		ctorArgsArray.unshift(alias);
		var curriedCtor = Function.prototype.bind.apply(type, [null].concat(ctorArgsArray));
  		return new curriedCtor();
	}

	var createNode = function(argsToApply){
		return createObject(Node,argsToApply);
	}

	var createNodeAlias = function(alias, argsToApply){
		return createObjectAlias(alias, Node, argsToApply);
	}

	var createEventHandler = function(argsToApply){
		return createObject(EventHandler,argsToApply);
	}

	var createEventHandlerAlias = function(alias, argsToApply){
		return createObjectAlias(alias, EventHandler, argsToApply);
	}

	/*
	 * The DomBuilder object
	 */
	var builderObj = {
		build: build,

		//Base builder functions
		attr: function(name, value){
			return new Attribute(name,value);
		},
		node: function(name){
  			return createNode(arguments);
		},
		text: function(value){
			return new Text(value);
		}
	};

	// Elements alias from https://developer.mozilla.org/en-US/docs/Web/HTML/Element
	['a','abbr','address','area','article','aside','audio','b','base',
	'bdi','bdo','blockquote','body','br','button','canvas','caption',
	'center','cite','code','col','colgroup','command','content','data',
	'datalist','dd','del','details','dfn','dialog','div','dl','dt',
	'element','em','embed','fieldset','figcaption','figure','font',
	'footer','form','head','header','hgroup','hr','html','i','iframe',
	'img','input','ins','kbd','keygen','label','legend','li','link','main',
	'map','mark','menu','menuitem','meta','meter','nav','nobr','noframes',
	'noscript','object','ol','optgroup','option','output','p','param',
	'picture','pre','progress','q','rp','rt','rtc','ruby','s','samp','script',
	'section','select','shadow','small','source','span','strong','style','sub',
	'summary','sup','table','tbody','td','template','textarea','tfoot','th',
	'thead','time','title','tr','track','u','ul','var','video','wbr'].forEach(function(e){
		builderObj[e] = function(){
			return createNodeAlias(e,arguments);
		}
	});

	// Attributes alias from https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
	['accept','accept-charset','accesskey','action','align','alt','async','autocomplete',
	'autofocus','autoplay','autosave','bgcolor','border','buffered','challenge','charset',
	'checked','cite','class','code','codebase','color','cols','colspan','content',
	'contenteditable','contextmenu','controls','coords','data','datetime',
	'default','defer','dir','dirname','disabled','download','draggable','dropzone','enctype',
	'for','form','formaction','headers','height','hidden','high','href','hreflang','http-equiv',
	'icon','id','ismap','itemprop','keytype','kind','label','lang','language','list','loop','low',
	'manifest','max','maxlength','media','method','min','multiple','name','novalidate','open',
	'optimum','pattern','ping','placeholder','poster','preload','radiogroup','readonly','rel',
	'required','reversed','rows','rowspan','sandbox','scope','scoped','seamless','selected','shape',
	'size','sizes','span','spellcheck','src','srcdoc','srclang','srcset','start','step','style',
	'summary','tabindex','target','title','type','usemap','value','width','wrap'].forEach(function (a) {
		builderObj[a] = function(value){
			return new Attribute(a,value);
		}
	});

	// Event handlers alias from https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
	['onabort','onautocomplete','onautocompleteerror','onblur','oncancel','oncanplay','oncanplaythrough',
	'onchange','onclick','onclose','oncontextmenu','oncuechange','ondblclick','ondrag','ondragend',
	'ondragenter','ondragexit','ondragleave','ondragover','ondragstart','ondrop','ondurationchange',
	'onemptied','onended','onerror','onfocus','oninput','oninvalid','onkeydown','onkeypress','onkeyup',
	'onload','onloadeddata','onloadedmetadata','onloadstart','onmousedown','onmouseenter','onmouseleave',
	'onmousemove','onmouseout','onmouseover','onmouseup','onmousewheel','onpause','onplay','onplaying',
	'onprogress','onratechange','onreset','onresize','onscroll','onseeked','onseeking','onselect',
	'onshow','onsort','onstalled','onsubmit','onsuspend','ontimeupdate','ontoggle','onvolumechange','onwaiting'].forEach(function (h) {
		builderObj[h] = function(){
			return createEventHandlerAlias(h,arguments);
		}
	});

	return builderObj;
}();

