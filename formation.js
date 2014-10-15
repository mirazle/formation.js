$(function() {

    // Define Base Function
    var formation = new Function;

    var css3_animation_end = [
	'webkitTransitionEnd', // webkit(Chrome1.0, Safari3.2)
	'oTransitionEnd', // Opera10.5
	'otransitionend', // Opera12
	'transitionend' // IE10, Fx4-, 12.10-
    ];

    // Extend Protptype Base Plugin
    $.extend(formation.prototype, {
	mode: {},
	style: {},
	set_mode: function(mode_piece) {
	    return set_mode_bank(this, mode_piece);
	},
	get: function(element_name) {
	    return get_mode(this, element_name);
	},
	exe: function() {
	    this.arguments = arguments;
	    return resolve_arguments(this);
	},
	history: function(element_name) {
	    return get_mode_history(this, element_name);
	},
	set_style: function(element_name) {
	    set_styles();
	},
	set_option: function(option) {
	    return set_option(this, option);
	},
	option: {
	    first_mode_name: 'normal_mode',
	    css_class_prefix: '-fm-',
	    debug_flg: false,
	    history_cnt: 5
	}
    });

    $(window).load(function() {
	set_styles();
    });

    function set_styles() {

	for (var styleSheetsNum = 0; styleSheetsNum < document.styleSheets.length; styleSheetsNum++) {

	    var rules = (document.styleSheets[styleSheetsNum]['rules'] != undefined) ?
		document.styleSheets[styleSheetsNum]['rules'] :
		document.styleSheets[styleSheetsNum]['cssRules'];

	    set_css_rules(rules, styleSheetsNum);
	}
    }

    function set_mode(_t, element_name, mode_name) {

	if (_t == undefined) var _t = fm;

	if (_t.mode[element_name] != undefined) {

	    _t.mode[element_name]['mode'] = mode_name;
	    return true;
	}
	return false;
    }

    function set_mode_bank(_t, _mode_piece) {

	var element_name = Object.keys(_mode_piece)[0];
	var mode_piece = _mode_piece[element_name];

	if ($(element_name).length == 0) return false;

	if (_t.mode[element_name] == undefined) {
	    _t.mode[element_name] = {
		'mode': _t.option.first_mode_name,
		'bank': mode_piece,
		'history': [],
		'com': {}
	    };

	    return true;
	} else {
	    _t.mode[element_name]['bank'] = $.extend(true, _t.mode[element_name]['bank'], mode_piece);
	    return true;
	}
    }

    function set_option(_t, option_obj) {

	var return_bool = false;

	if (option_obj['first_mode_name'] != undefined) {
	    _t.option['first_mode_name'] = option_obj['first_mode_name'];
	    return_bool = true;
	}
	if (option_obj['debug_flg'] != undefined) {
	    _t.option['debug_flg'] = option_obj['debug_flg'];
	    return_bool = true;
	}
	if (option_obj['history_cnt'] != undefined) {
	    _t.option['history_cnt'] = option_obj['history_cnt'];
	    return_bool = true;
	}
	return return_bool;
    }

    function get_mode(_t, element_name) {

	if (typeof(element_name) == 'string' && _t.mode[element_name] != undefined) {
	    return _t.mode[element_name]['mode']
	}

	return undefined;
    }

    function get_mode_bank(_t, element_name, mode_name) {

	var return_mode = _t.mode;

	if (typeof(element_name) == 'string' && _t.mode[element_name] != undefined) {

	    return_mode = _t.mode[element_name];

	    if (typeof(mode_name) == 'string' && _t.mode[element_name]['bank'][mode_name] != undefined) {

		return_mode = _t.mode[element_name]['bank'][mode_name];
	    }
	}

	return return_mode;
    }

    function get_mode_history(_t, element_name) {

	var return_history = undefined;

	if (typeof(element_name) == 'string' && _t.mode[element_name] != undefined) {

	    return_history = _t.mode[element_name]['history'];
	}
	return return_history;
    }

    function add_mode_history(exe, element_name, one_mode_styles, one_mode_styles_max_index) {

	var cap_mode_name = get_mode(exe, element_name);
	var add_mode_history_obj = {};
	add_mode_history_obj[cap_mode_name] = {};

	if (exe.option.first_mode_name == cap_mode_name) {

	    for (var one_mode_style_index = 0; one_mode_style_index <= one_mode_styles_max_index; one_mode_style_index++) {

		var styles = one_mode_styles[one_mode_style_index];

		for (var element in styles) {

		    if (add_mode_history_obj[cap_mode_name][element] == undefined) add_mode_history_obj[cap_mode_name][element] = {};
		    if (typeof(styles[element]) == 'function') styles[element] = styles[element]();

		    add_mode_history_obj[cap_mode_name][element] = $.extend(add_mode_history_obj[cap_mode_name][element], $(element).css(Object.keys(styles[element])));
		}
	    }
	} else {

	    add_mode_history_obj[cap_mode_name] = exe.mode[element_name]['bank'][cap_mode_name]['style'];
	}

	var history = exe.mode[element_name]['history'].unshift(add_mode_history_obj);

	exe.mode[element_name]['history'] = history.slice(0, exe.option.history_cnt);
    }

    function debug(exe, type, string) {

	if (exe != undefined) {
	    if (exe.option.debug_flg) {
		console.log(type + string);
	    }
	}
    }

    function resolve_arguments(exe) {

	// If, Resolve That Params Type Any String
	if (typeof(exe.arguments[0]) == 'string' && typeof(exe.arguments[1]) == 'string') {

	    var _arguments = exe.arguments;
	    var all_mode_callback = (typeof(exe.arguments[2]) == 'fnction') ? exe.arguments[2] : function() {};

	    exe.arguments = new Array({});
	    exe.arguments[0][_arguments[0]] = _arguments[1];
	    exe.arguments[0][_arguments[0]]['fn'] = all_mode_callback;
	}

	resolve_parallel_all_argument(exe).done(function() {
	    done_phase_controller(6, 'resolve_arguments', arguments)
	});
    }

    function resolve_parallel_all_argument(exe) {

	exe.resolve_parallel_all_argument = {};
	exe.resolve_parallel_all_argument.d = new $.Deferred;
	exe.resolve_parallel_all_argument.d_parallel = new Array();
	exe.resolve_parallel_all_argument['pointer'] = 0;
	exe.resolve_parallel_all_argument['max_pointer'] = exe.arguments.length - 1;
	exe.resolve_series_one_argument = new Array();

	for (var argument_index = 0; argument_index < exe.arguments.length; argument_index++) {

	    exe.resolve_series_one_argument[argument_index] = {};
	    exe.resolve_series_one_argument[argument_index].index = argument_index;
	    exe.resolve_series_one_argument[argument_index].element_name = Object.keys(exe.arguments[argument_index])[0];
	    exe.resolve_series_one_argument[argument_index].d = new $.Deferred;
	    exe.resolve_series_one_argument[argument_index].obj = exe.arguments[exe.resolve_series_one_argument[argument_index].index];
	    exe.resolve_series_one_argument[argument_index].callback = get_input_callback_func(exe.resolve_series_one_argument[argument_index].obj, true);

	    exe.resolve_parallel_all_argument.d_parallel.push(exe.resolve_series_one_argument[argument_index].d.promise());
	}

	$.when.apply(exe, exe.resolve_parallel_all_argument.d_parallel).done(function() {
	    done_phase_controller(5, 'resolve_parallel_all_argument', arguments)
	});

	resolve_series_one_argument(exe);

	return exe.resolve_parallel_all_argument.d.promise();
    }

    function resolve_series_one_argument(exe) {

	resolve_parallel_all_mode_in_one_obj(exe).done(function() {
	    done_phase_controller(4, 'resolve_series_one_argument', arguments)
	});
    }

    // Loop All Mode Obj in One Obj
    function resolve_parallel_all_mode_in_one_obj(exe) {

	var all_mode_in_one_argument = exe.resolve_series_one_argument[exe.resolve_parallel_all_argument['pointer']];
	exe.element_name = all_mode_in_one_argument['element_name'];
	var all_mode_name_array = (typeof(all_mode_in_one_argument['obj'][exe.element_name]) == 'object') ?
	    all_mode_in_one_argument['obj'][exe.element_name] :
	    new Array(all_mode_in_one_argument[exe.element_name]);

	exe.resolve_parallel_all_mode = {};
	exe.resolve_parallel_all_mode.d = new $.Deferred;
	exe.resolve_parallel_all_mode.d_parallel = new Array();
	exe.resolve_parallel_all_mode['pointer'] = 0;
	exe.resolve_parallel_all_mode['max_pointer'] = all_mode_name_array.length - 1
	exe.resolve_series_one_mode = new Array();

	// Loop One Mode Obj in Array Object
	for (var mode_index = 0; mode_index < all_mode_name_array.length; mode_index++) {

	    exe.resolve_series_one_mode[mode_index] = {};
	    exe.resolve_series_one_mode[mode_index].index = mode_index;
	    exe.resolve_series_one_mode[mode_index].mode_name = all_mode_name_array[mode_index];
	    exe.resolve_series_one_mode[mode_index].d = new $.Deferred;

	    var one_mode_data = get_mode_bank(exe, exe.element_name, all_mode_name_array[mode_index]);
	    exe.resolve_series_one_mode[mode_index].sync_one_mode_flg = (one_mode_data['sync'] == undefined) ? true : one_mode_data['sync'];

	    switch (typeof one_mode_data) {
		case 'object':

		    exe.resolve_series_one_mode[mode_index].callback = get_input_callback_func(one_mode_data, true);

		    if (typeof(one_mode_data['style']) == 'undefined') {

			if (typeof(one_mode_data['fn']) != 'undefined' && typeof(one_mode_data['fn']) == 'function') {

			    exe.resolve_series_one_mode[mode_index].styles = [{
				'@no_style': '@no_style'
			    }];
			} else {

			    exe.resolve_series_one_mode[mode_index].styles = [{}];
			    exe.resolve_series_one_mode[mode_index].styles[0] = one_mode_data;
			}

		    } else if (typeof(one_mode_data['style']) == 'string') {

			exe.resolve_series_one_mode[mode_index].styles = [{}];
			exe.resolve_series_one_mode[mode_index].styles[0][exe.element_name] = one_mode_data['style'];

		    } else if (typeof(one_mode_data['style']) == 'object' && typeof(one_mode_data['style'].length) == 'undefined') {

			exe.resolve_series_one_mode[mode_index].styles = [{}];
			exe.resolve_series_one_mode[mode_index].styles[0][exe.element_name] = one_mode_data['style'];

		    } else if (typeof(one_mode_data['style']) == 'object' && typeof(one_mode_data['style'].length) != 'undefined') {

			exe.resolve_series_one_mode[mode_index].styles = one_mode_data['style'];

		    }

		    break;
		case 'function':
		    exe.resolve_series_one_mode[mode_index].styles = [{
			'@no_style': '@no_style'
		    }];
		    exe.resolve_series_one_mode[mode_index].callback = one_mode_data
		    break;
		case 'string':
		    exe.resolve_series_one_mode[mode_index].styles = [{}];
		    exe.resolve_series_one_mode[mode_index].styles[0][exe.element_name] = one_mode_data
		    exe.resolve_series_one_mode[mode_index].callback = get_input_callback_func(one_mode_data, true);
		    break;
	    }

	    exe.resolve_series_one_mode[mode_index].d.done(function() {
		done_phase_controller(2, 'resolve_series_one_mode', arguments)
	    });

	    // Add Deferred Promise Object
	    exe.resolve_parallel_all_mode.d_parallel.push(exe.resolve_series_one_mode[mode_index].d.promise());
	}

	$.when.apply(exe, exe.resolve_parallel_all_mode.d_parallel).done(function() {
	    done_phase_controller(3, 'resolve_parallel_all_mode_in_one_obj', arguments)
	});

	resolve_series_one_mode(exe);

	return exe.resolve_parallel_all_mode.d.promise();
    }

    function resolve_series_one_mode(exe) {

	exe.mode_name = exe.resolve_series_one_mode[exe.resolve_parallel_all_mode['pointer']].mode_name;
	var one_mode_styles = exe.resolve_series_one_mode[exe.resolve_parallel_all_mode['pointer']].styles;
	var sync_one_mode_flg = exe.resolve_series_one_mode[exe.resolve_parallel_all_mode['pointer']].sync_one_mode_flg;

	var one_mode_styles_max_index = one_mode_styles.length - 1;
	var one_element_styles_when_deferreds = new Array();

	// TO DO
	//add_mode_history(exe, exe.element_name, one_mode_styles, one_mode_styles_max_index);

	for (var one_mode_style_index = 0; one_mode_style_index <= one_mode_styles_max_index; one_mode_style_index++) {

	    var last_styles = one_mode_styles[Object.keys(one_mode_styles).length - 1];
	    var last_element = Object.keys(last_styles)[0];
	    var styles = one_mode_styles[one_mode_style_index];


	    for (var element in styles) {

		var effect_way = (typeof(styles[element]) == 'object') ? 'object' : 'string';

		if (effect_way == 'string') {
		    effect_way = (element == '@no_style') ? '@no_style' : 'class';
		}

		var one_element_style_d = new $.Deferred;
		one_element_style_d.mode_name = exe.mode_name;
		one_element_style_d.element = element;

		switch (effect_way) {
		    case 'class':

			var add_class = new Array();
			var remove_class = new Array();
			var _add_class = (styles[element].indexOf(' ') !== false) ? styles[element].split(' ') : [styles[element]];

			if ($(element).attr('class') != undefined) {
			    if ($(element).attr('class').indexOf(' ') !== false) {
				var _remove_class = $(element).attr('class').split(' ');
			    } else {
				var _remove_class = [$(element).attr('class')];
			    }
			} else {
			    var _remove_class = new Array();
			}

			for (c_i = 0; c_i < _remove_class.length; c_i++) {
			    if (_remove_class[c_i].indexOf(exe.option.css_class_prefix) !== false) {
				remove_class.push(_remove_class[c_i]);
			    }
			}

			for (c_i = 0; c_i < _add_class.length; c_i++) {
			    if (_add_class[c_i].indexOf(exe.option.css_class_prefix) !== false) {
				add_class.push(_add_class[c_i]);
			    }
			}

			$(element).removeClass(remove_class.join(' '))
			    .addClass(add_class.join(' '));

			break;
		    case 'object':

			if (typeof(styles[element]) == 'function') styles[element] = styles[element]();

			// Effect css
			$(element).css(styles[element]);

			break;
		    case '@no_style':

			break;
		}

		if (sync_one_mode_flg) {

		    if (is_set_css3_animation_element(element)) {

			bind_one_function(exe, element, one_element_style_d);
			one_element_styles_when_deferreds.push(one_element_style_d.promise());

		    } else {

			one_element_styles_when_deferreds.push(one_element_style_d.resolve(exe));
		    }
		} else {

		    one_element_styles_when_deferreds.push(one_element_style_d.resolve(exe));
		}

		if (one_mode_style_index == one_mode_styles_max_index && element == last_element) {

		    $.when.apply(exe, one_element_styles_when_deferreds).done(function() {
			done_phase_controller(1, 'one_element_styles_one_mode', arguments)
		    });
		}
	    }
	}

	return exe.resolve_series_one_mode[exe.resolve_parallel_all_mode['pointer']].d.promise();
    }


    function done_phase_controller(phase_no, phase_name, _arguments) {

	var exe = _arguments[_arguments.length - 1];

	switch (phase_name) {
	    case 'one_element_styles_one_mode':

		exe.resolve_series_one_mode[exe.resolve_parallel_all_mode['pointer']].d.resolve(exe);
		break;
	    case 'resolve_series_one_mode':

		set_mode(exe, exe.element_name, exe.mode_name);

		exe.resolve_series_one_mode[exe.resolve_parallel_all_mode['pointer']].callback(exe);

		if (exe.resolve_parallel_all_mode['max_pointer'] == exe.resolve_parallel_all_mode['pointer']) {

		    exe.resolve_series_one_mode[exe.resolve_parallel_all_mode['pointer']].d.resolve(exe);

		} else {

		    exe.resolve_series_one_mode[exe.resolve_parallel_all_mode['pointer']].d.resolve(exe);
		    exe.resolve_parallel_all_mode['pointer'] ++;

		    // Eecurrent Execute
		    resolve_series_one_mode(exe);
		}
		break;
	    case 'resolve_parallel_all_mode_in_one_obj':

		exe.resolve_parallel_all_mode.d.resolve(exe);
		break;
	    case 'resolve_series_one_argument':

		// Execute Calback Function In One Obj
		exe.resolve_series_one_argument[exe.resolve_parallel_all_argument['pointer']].callback(exe);

		if (exe.resolve_parallel_all_argument['max_pointer'] == exe.resolve_parallel_all_argument['pointer']) {

		    exe.resolve_series_one_argument[exe.resolve_parallel_all_argument['pointer']].d.resolve(exe);

		} else {

		    exe.resolve_series_one_argument[exe.resolve_parallel_all_argument['pointer']].d.resolve(exe);
		    exe.resolve_parallel_all_argument['pointer'] ++;

		    // Eecurrent Execute
		    resolve_series_one_argument(exe);
		}
		break;
	    case 'resolve_parallel_all_argument':

		exe.resolve_parallel_all_argument.d.resolve();

		break;
	    case 'resolve_arguments':
		delete exe;
		break;
	}
    }

    function get_input_callback_func(arg, type) {
	var callback_func = (type) ? function() {} : false;
	if (typeof(arg) == 'string') return callback_func;
	if (Object.keys(arg).length == 0) return callback_func;
	if (typeof(arg) == 'function') arg['fn'] = arg;
	if (arg['fn'] == undefined) return callback_func;
	return (typeof(arg['fn']) == 'function') ? arg['fn'] : callback_func;
    }

    function is_set_css3_animation_element(element, type) {

	var is_css3_animation_element_flg = false;
	var type = (type == undefined) ? 'all' : type;

	if (element != '@no_style') {
	    if ($(element).length > 0) {

		if (type == 'all' || type == 'transition') {

		    var transition_values = $(element).css('transition').match(/\d+/g);

		    if (parseInt(transition_values[0]) > 0 || parseInt(transition_values[1]) > 0) {

			if ($(element).css('transform') != 'none') {
			    is_css3_animation_element_flg = true;
			}
		    }
		}

		if (type == 'all' || type == 'animation') {
		    var animation_values = $(element).css('animation').match(/\d+/g);

		    if (parseInt(animation_values[0]) > 0 || parseInt(animation_values[1]) > 0) {

			is_css3_animation_element_flg = true;
		    }
		}
	    }
	}

	return is_css3_animation_element_flg;
    }

    function bind_one_function(exe, element, one_element_style_d) {

	var css3_animationed_func = get_css3_animationed_func(exe, one_element_style_d);

	$(element).one(css3_animation_end.join(' '), css3_animationed_func);
    }

    function get_css3_animationed_func(exe, one_element_style_d) {

	return function() {
	    one_element_style_d.resolve(exe);
	}
    }

    function set_css_rules(rules, styleSheetsNum, rec_flg) {

	var rec_flg = (rec_flg == undefined) ? false : rec_flg;

	for (var style_num = 0; style_num < rules.length; style_num++) {

	    if (rules[style_num]['parentRule'] == null) {
		var media = (rules[style_num]['parentStyleSheet']['media']['mediaText'] != '') ?
		    rules[style_num]['parentStyleSheet']['media']['mediaText'] : 'all';
	    } else {
		var media = (rules[style_num]['parentRule']['media']['mediaText'] != '') ?
		    rules[style_num]['parentRule']['media']['mediaText'] : 'all';
	    }

	    if (fm.style[media] == undefined) fm.style[media] = {};

	    switch (rules[style_num]['type']) {
		case 3:
		    set_import(rules, media, style_num);
		    break;
		case 4:
		    var dig_key = (rules[style_num]['rules'] != undefined) ? 'rules' : 'cssRules';
		    set_css_rules(rules[style_num][dig_key], styleSheetsNum, true);
		    break;
		case 5:
		    set_fontface(rules, media, style_num);
		    break;
		case 6:
		    set_page(rules, media, style_num);
		    break;
		case 7:
		    set_keyframe(rules, media, style_num);
		    break;
		default:
		    set_style(rules, media, style_num, rules[style_num]['type']);
		    break;
	    }
	}
    }

    function set_page(rules, media, style_num, type) {

	if (fm.style[media]['@page'] == undefined) {
	    fm.style[media]['@page'] = {};
	}

	for (var i = 0; i < rules[style_num]['style'].length; i++) {

	    fm.style[media]['@page'][rules[style_num]['style'][i]] =
		rules[style_num]['style'][rules[style_num]['style'][i]];
	}
    }

    function set_import(rules, media, style_num) {

	if (fm.style[media]['@import'] == undefined) {
	    fm.style[media]['@import'] = new Array();
	}

	fm.style[media]['@import'].push(rules[style_num]['cssText'].replace('@import ', ''));
    }

    function set_style(rules, media, style_num) {

	var set_mode_banks = new Array();

	for (var i = 0; i < rules[style_num]['style'].length; i++) {

	    if (fm.style[media][rules[style_num]['selectorText']] == undefined) {

		fm.style[media][rules[style_num]['selectorText']] = {};
	    }

	    var mode_name_start_index = rules[style_num]['selectorText'].indexOf('.' + fm.option.css_class_prefix);

	    if (mode_name_start_index > 0) {

		var fm_class_last_index = rules[style_num]['selectorText'].lastIndexOf('.' + fm.option.css_class_prefix);
		var element_name = rules[style_num]['selectorText'].substr(0, fm_class_last_index);
		var mode_name = rules[style_num]['selectorText'].substr(fm_class_last_index).replace(/^\./, '');

		if (mode_name.split(/#|\.|:| /).length == 2) {

		    var _set_mode_bank = {};
		    _set_mode_bank[rules[style_num]['style'][i]] = rules[style_num]['style'][rules[style_num]['style'][i]]

		    set_mode_banks.push(_set_mode_bank);

		    //{'start_mode':{
		    //	'style' : [{}],
		    //	'sync'  : true,
		    //	'fn'    : function(){}
		    //  }}

		}
	    }

	    fm.style[media][rules[style_num]['selectorText']][rules[style_num]['style'][i]] =
		rules[style_num]['style'][rules[style_num]['style'][i]];

	    if (i == rules[style_num]['style'].length - 1) {

		if (set_mode_banks.length > 0) {

		    //set_mode_bank( fm, element_name, mode_piece);
		}
	    }
	}
    }

    function set_fontface(rules, media, style_num) {

	var font_face = {};

	if (fm.style[media]['@font-face'] == undefined) {
	    fm.style[media]['@font-face'] = new Array();
	}

	for (var i = 0; i < rules[style_num]['style'].length; i++) {
	    font_face[rules[style_num]['style'][i]] = rules[style_num]['style'][rules[style_num]['style'][i]];
	}

	fm.style[media]['@font-face'].push(font_face);
    }

    function set_keyframe(rules, media, style_num) {

	var key_name = rules[style_num]['cssText'].split(rules[style_num]['name'])[0].replace(' ', '');

	if (fm.style[media][key_name] == undefined) {

	    fm.style[media][key_name] = {};
	}

	if (fm.style[media][key_name][rules[style_num]['name']] == undefined) {

	    fm.style[media][key_name][rules[style_num]['name']] = {};
	}

	var dig_key = (rules[style_num]['rules'] != undefined) ? 'rules' : 'cssRules';
	var css_text_array = rules[style_num]['cssText'].split(rules[style_num]['name']);

	for (var i = 0; i < rules[style_num][dig_key].length; i++) {

	    if (fm.style[media][key_name][rules[style_num]['name']] == undefined) {

		fm.style[media][key_name][rules[style_num]['name']] = {};
	    }

	    for (var j = 0; j < rules[style_num][dig_key][i]['style'].length; j++) {

		if (fm.style[media][key_name][rules[style_num]['name']][rules[style_num][dig_key][i]['keyText']] == undefined) {

		    fm.style[media][key_name][rules[style_num]['name']][rules[style_num][dig_key][i]['keyText']] = {}
		}

		fm.style[media][key_name][rules[style_num]['name']][rules[style_num][dig_key][i]['keyText']][rules[style_num][dig_key][i]['style'][j]] =
		    rules[style_num][dig_key][i]['style'][rules[style_num][dig_key][i]['style'][j]];
	    }
	}
    }

    function size(obj) {
	return (obj.length == undefined) ? Object.keys(obj).length : obj.length;
    }

    $.extend({
	fm: new formation()
    });
})
