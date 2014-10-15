formation.js ( ver 0.3 )
============

This plug-in is possible CSS definitions, animation execution, and state management.

# ○ Introduction
You can .. 
- Collectively manage the CSS some data. By grouping using the 'Mode Name'.
- Multiple CSS3 animation execution of synchronous / asynchronous by connecting the 'Mode Name'.
- Coding more simple is possible. If you get the 'Mode Name' of current.
- See mode tree structure in dev tool.

# ○ Usage

##HTML
```html
<div id='animation'>
	<div id='ball1' class='series'></div>
	<div id='ball2' class='parallel'></div>
	<div id='ball3' class='parallel'></div>
</div>
```

##API

### list
- $.fm.set_mode()
- $.fm.exe()
- $.fm.get()
- $.fm.history()
- $.fm.mode
- $.fm.style()
- $.fm.set_option()

###$.fm.set_mode()
ModeName: (string) ClassNames.
```javascript
$.fm.set_mode( 

	/* Tag select */
	{'#animation':{
		
			/* Mode name : CSS Class names*/
			'start_mode': 'Class_Name1 Class_Name2'
		}
	}
);
```
ModeName: (function) Function.
```javascript
$.fm.set_mode( 

	/* Tag select */
	{'#animation':{
		
			/* Mode name : function */
			'start_mode': function(){ console.log( 'start_mode function' ); }
		}
	}
);
```
ModeName: (object) Styles and Function and Setting Sync.
```javascript
$.fm.set_mode( 

	/* Tag select */
	{'#animation':{
		
			/* Mode name */
			'start_mode':{
		
				/* Define styles */
				'style'	: [{},{},{}],

				/* Synchronous execution flg */
				'sync'	: true,

				/* Synchronous executioned function */
				'fn'	: function(){}
			}
		}
	}
);
```

Other Example1
```javascript
$.fm.set_mode( 

	/* Tag select */
	{'#animation':{
	
		/* Mode name */
		'start_mode':
			{
				/* Define styles */
				'style'	: 
				[
						{'#ball1'	: $.start_mode_ball1 },
						{'.paralle'	: $.start_mode_parallel },
						{'body'		: $.com.get_body_bgcolor }
				],
	
				/* Synchronous execution flg */	
				'sync'	: true,
	
				/* Synchronous executioned function */
				'fn'	: function(){ console.log('Synchronous Callback Function.') }
			}
	}
});

```
Other Example2
```javascript
$.fm.set_mode( 
	{'#animation':{
		'start_mode':
			{
				'style'	: 
				[
						{'#ball1'	: $.start_mode_ball1 },
						{'.paralle'	: $.start_mode_parallel },
						{'body'		: $.get_body_bgcolor_fn } 
				],
				// paralle execution.
				'sync'	: false,
				'fn'	: function(){ console.log('Asynchronous Callback Function.') }
			},
			
		'top_left_mode':
			{
				'style'	:
				[
						{'#ball1'		: $.top_left_mode_balll },
						{'.parallel'	: $.top_left_mode_parallel }
				],
				'sync'	: true,
				'fn'	: function(){ console.log('Synchronism Callback Function.') }
			},
			
		'bottom_right_mode':
			{
				'style'	:
				[
						{'#ball1'		: {'transform': 'translate( 50px, 50px ) rotate( -45deg ) skew( -45deg, -45deg )'}},
						{'.parallel'	: {'transform': 'transition':'1000ms','transform': 'scale( 2.2 )'}}
				],
				'sync'	: true,
				'fn'	: function(){ console.log('Synchronism Callback Function.') }
			}
	}
});

```

###$.fm.exe()
Example1 ( One argument )
```javascript
$.fm.exe(
	
	/* Tag select : Mode flow    */	
	{'#animation': ['start_mode', 'top_left_mode', 'bottom_right_mode']}
)
```
Example2 ( One argument )
```javascript
$.fm.exe(
	
	/* Tag select : Mode flow    */	
	{'#animation': ['start_mode', 'top_left_mode', 'bottom_right_mode']},	
	
	/* Synchronous Callback Function */
	'fn': function(){ alert('Finnish!') } 
})
```
Example3 ( Some arguments )
```javascript
$.fm.exe(
	/* Resolve Synchronous One argument */
	{'#animation1':['start_mode', 'top_left_mode', 'bottom_right_mode']},

	/* Resolve Synchronous One argument */
	{'#animation2':['top_left_mode', 'bottom_right_mode'],'fn': function(){}},

	/* Resolve Synchronous One argument */
	{'#animation3':['top_left_mode', 'bottom_right_mode'],'fn': $.finnish_alert() }
)
```

###$.fm.get_mode()
Get last excution mode,
```javascript
  $.fm.get_mode( '#animation' );

> 'bottom_right_mode'

```
and used as a control syntax.
```javascript
/* In your code */
if( $.fm.get_mode( '#animation' ) ) == 'bottom_right_mode' ){

}
```

###$.fm.history()
Orders from new.
```javascript

$.fm.history( '#animation' )

>[Object, Object, Object, Object, Object, Object]

```
..See details.
```javascript

$.fm.history( '#animation' );

>[
	{
		/* Mode name */
		'bottom_right_mode':
		[
			'#ball1'	: {transform: "translate( 50px, 50px ) rotate( -45deg ) skew( -45deg, -45deg )"},
			'.parallel'	: {transform: "transition: 1000ms translate( 50px, 50px ) rotate( -45deg ) skew( -45deg, -45deg)"}
		]
	},
	
	{
		/* Mode name */
		'top_left_mode':
 		[
			'#ball1'	: {'transform': 'translate( 50px, 50px ) rotate( 45deg ) skew( 45deg, 45deg )'}},
			'.parallel'	: {'transform': 'transition':'5000ms','transform': 'scale( 2.2 )'}}
		]
	},
	
	{
		/* Mode name */
		'start_mode':
 		[
			'#ball1'  	: {'display': 'block', 'transition':'2000ms','transform': 'translate( 600px, 600px) rotate( 0deg ) skew( 0deg, 0deg )'},
			'.paralle'	: {'display': 'block', 'transition':'1000ms','transform': 'scale( 1 )'},
			'body'		: function(){  
							return ( ( new Date() ).getMinutes() > 30 )? 
								{'background-color':'rgba( 255, 255, 255, 1 )'} : 									{'background-color':'rgba( 0, 0, 0, 1 )'}
				}
		]
	}
												.
												.
```
###$.fm.mode
See all data ( Summary )
```javascript

$.fm.mode

>Object {

	/* Tag select */
	'#animation':
	{
		/* Now mode */
		mode: "bottom_right_mode"

		/* Some mode bank */
		bank: Object

		/* Exe mode log */
		history: Array[12]
	},

	/* Tag select */
	'#main_screen':
	{
		/* Now mode */
		mode: "mode2"

		/* Set mode bank */
		bank: Object

		/* Exe mode log */
		history: Array[2]

												.
												.
```

See all data ( Detail )
```javascript

$.fm.mode

>Object {

	/* Tag select */
	'#animation':
	{
		/* Now mode */
		mode: "bottom_right_mode"

		/* Set mode bank */
		bank: Object

			start_mode: Object
				fn: function (){}
				style: Array[1]
				sync: false

			top_left_mode: Object
				fn: function (){}
				style: Array[2]
				sync: true

			bottom_right_mode: Object
				fn: function (){}
				style: Array[2]
				sync: true

			mode4: Object
			mode5: Object
			mode6: Object
			
		/* Excution mode log */
		history: Array[2]

			0: Object
				bottom_right_mode: Array[2]
					0: Object
						'#ball1'	: {transform: "translate( 50px, 50px ) rotate( -45deg ) skew( -45deg, -45deg )"},
						'.parallel'	: {transform: "transition: 1000ms translate( 50px, 50px ) rotate( -45deg ) skew( -45deg, -45deg)"}

			1: Object
			2: Object
												.
												.
```

## $.fm.style()
All css properties is in one structure.
```javascript

$.fm.style()

>Object {

    /* Media type list*/
    all: Object

        /* Selector and properties */
        #element: Object
            font-size: "18px"
            left: "-2px"
            position: "relative"
            vertical-align: "super"
        @-webkit-keyframes: Object
            blink: Object
                0%: Object
                    opacity: "0"
                100%: Object
            blink2: Object
        @font-face: Array[2]
            0: Object
                font-family: "sample1"
                src: "url(http://example.com/css/sample1.ttf), local(sample1.ttf)"
            1: Object
        @import: Array[1]
            0: "url("http://example.com/css/sample.css") handheld, tv;"
            length: 1
        @page: Object
            margin-bottom: "3px"
            margin-left: "3px"
            margin-right: "3px"
            margin-top: "3px"
            
    /* Media type list*/
    screen and (max-width: 480px): Object
    screen and (max-width: 659px): Object
    screen and (max-width: 768px): Object
    screen, tv: Object
        
        #element: Object
            font-size: "28px"
            left: "-20px"
                                                .   
                                                .   
```

###$.fm.set_option()

```javascript

$.fm.set_option({

		// default:false => Output debug code in dev tool.
		'debug_flg'			: false,

		// default: 'normal_mode' => When no mode name in $.fm.history('any_selector').
		'first_mode_name'	: 'normal_mode', 
		
		// default:false => Save cnt in $.fm.get_histry('any_selector').
		'history_cnt'		: 5

})

```

# ○ License

MIT License Copyright (C) 2014 mirazle
