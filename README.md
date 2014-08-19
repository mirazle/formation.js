formation.js
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
- $.fm.data
- $.fm.set_mode()
- $.fm.exe()
- $.fm.get_mode()
- $.fm.get_history()
- $.fm.mode
- $.fm.set_option()

###$.fm.data
Define common variables,
```javascript

$.fm.data.common_transition1 = '1000ms';
$.fm.data.common_transition2 = '2000ms';
```
Objects,
```javascript

$.fm.data.start_mode_ball1 = 
	{'display': 'block', 'transition': '2000ms','transform': 'translate( 600px, 600px) rotate( 0deg ) skew( 0deg, 0deg )'};

$.fm.data.start_mode_parallel = 
	{'display': 'block', 'transition': '1000ms','transform': 'scale( 1 )'};

```

Functions.
```javascript

$.fm.data.footer_width = function( mode ){ 

	if( mode == 'bottom_right_mode' ){
		return this.data.header_width;
	}else{
		return $('#contents').width(); 
	}
}

```
###$.fm.set_mode()
Description.
```javascript
$.fm.set_mode( 

	/* Tag select */
	'#animation':{
		
		/* Mode name */
		'start_mode':{
		
				/* Define styles */
				'style'	: [{}],

				/* Synchronous execution flg */
				'sync'	: true,

				/* Synchronous executioned function */
				'fn'	: function(){}
		}
	}
);

```
Example1
```javascript
$.fm.set_mode( 

	/* Tag select */
	'#animation':{
	
		/* Mode name */
		'start_mode':
			{
				/* Define styles */
				'style'	: 
				[
						{'#ball1'	: $.fm.data.start_mode_ball1 },
						{'.paralle'	: $.fm.data.start_mode_parallel },												{'body'		: function(){  return ( ( new Date() ).getMinutes() > 30 )? {'background-color':'rgba( 255, 255, 255, 1 )'} : {'background-color':'rgba( 0, 0, 0, 1 )'} } }
				],
	
				/* Synchronous execution flg */	
				'sync'	: true,
	
				/* Synchronous executioned function */
				'fn'	: function(){ console.log('Synchronous Callback Function.') }
			}
});

```
Example2
```javascript
$.fm.set_mode( 
	'#animation':{
		'start_mode':
			{
				'style'	: 
				[
						{'#ball1'	: $.fm.data.start_mode_ball1 },
						{'.paralle'	: $.fm.data.start_mode_parallel },			'transition':'1000ms','transform': 'scale( 1 )'}},
						{'body'		: function(){  return ( ( new Date() ).getMinutes() > 30 )? {'background-color':'rgba( 255, 255, 255, 1 )'} : {'background-color':'rgba( 0, 0, 0, 1 )'} } }
				],

				'sync'	: false,
				'fn'	: function(){ console.log('Asynchronous Callback Function.') }
			},
			
		'top_left_mode':
			{
				'style'	:
				[
						{'#ball1'		: {'transform': 'translate( 50px, 50px )	rotate( 45deg ) skew( 45deg, 45deg )'}},
						{'.parallel'	: {'transform': 'transition':'5000ms','transform': 'scale( 2.2 )'}}
				],
				'sync'	: true,
				'fn'	: function(){ console.log('Synchronism Callback Function.') }
			},
			
		'bottom_right_mode':
			{
				'style'	:
				[
						{'#ball1'		: {'transform': 'translate( 50px, 50px )	rotate( -45deg ) skew( -45deg, -45deg )'}},
						{'.parallel'	: {'transform': 'transition':'1000ms','transform': 'scale( 2.2 )'}}
				],
				'sync'	: true,
				'fn'	: function(){ console.log('Synchronism Callback Function.') }
			}
});

```

###$.fm.exe()
Example1 ( One argument )
```javascript
$.fm.exe({
	/* Tag select */	
	'#animation':
	
	/* Mode flow */	
	['start_mode', 'top_left_mode', 'bottom_right_mode']
})
```
Example2 ( One argument )
```javascript
$.fm.exe({
	/* Tag select */	
	'#animation':
	
	/* Mode flow */	
	['start_mode', 'bottom_right_mode', 'top_left_mode', 'bottom_right_mode'],
	
	/* Synchronous Callback Function */
	'fn': function(){}
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
	{'#animation3':['top_left_mode', 'bottom_right_mode'],'fn': function(){}}
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
if( $.fm.get_mode( '#animation' ) ) == 'bottom_right_mode' ){

	/* Your code */
}
```

###$.fm.get_history()
Orders from new.
```javascript

$.fm.get_history( '#animation' )

>[Object, Object, Object, Object, Object, Object]

```
..See details.
```javascript

$.fm.get_history( '#animation' );

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

###$.fm.set_option()

```javascript

$.fm.set_option(

		// default:false => Output debug code in dev tool.
		'debug_flg'			: false,

		// default:false => When no mode name in $.fm.get_history('any_selector').
		'first_mode_name'	: 'normal', 
		
		// default:false => Save cnt in $.fm.get_histry('any_selector').
		'history_cnt'		: 5,

)

```

# ○ License

MIT License Copyright (C) 2014 mirazle
