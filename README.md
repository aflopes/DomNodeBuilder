DomNodeBuilder
================
Library to build DOM nodes dynamically


Usage Example
-------------
	(function(builder){

		var text = builder.text,
			a = builder.a,
			p = builder.p,
			href = builder.href,
			onclick = builder.onclick;

		var e = builder.build(
			p(text("Demo: "),
				a(text("Click to Demo"), 
				  href("#"), 
				  onclick(function(){console.log('Demo click');}))));		

		window.document.getElementById('builder-target').appendChild(e);

	})(DomNodeBuilder);