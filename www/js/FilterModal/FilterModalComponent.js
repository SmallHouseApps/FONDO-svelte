/* FilterModalComponent.html generated by Svelte v1.60.2 */
var FilterModalComponent = (function() { "use strict";

	function dateStart(dateStart) {
                var date = dateStart;
                
                if(dateStart.split('.').length > 1){
                    var day = dateStart.split('.')[0];
                    if(day.toString().length == 1) day = '0'+day;

                    var month = dateStart.split('.')[1];
                    if(month.toString().length == 1) month = '0'+month;

                    var year = dateStart.split('.')[2];
                    date = year+'-'+month+'-'+day;
                } 

                
                return date;
            }

	function dateEnd(dateEnd) {
    var date = dateEnd;

    if(dateEnd.split('.').length > 1){
        var day = dateEnd.split('.')[0];
        if(day.toString().length == 1) day = '0'+day;

        var month = dateEnd.split('.')[1];
        if(month.toString().length == 1) month = '0'+month;

        var year = dateEnd.split('.')[2];
        date = year+'-'+month+'-'+day;
    } 

    return date;
}

	function oncreate(){
    M.FormSelect.init(document.querySelectorAll('select'));
};

	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-vd5tlj-style';
		style.textContent = ".svelte-vd5tlj#FilterModalComponent,.svelte-vd5tlj #FilterModalComponent{padding-top:10px;padding-bottom:15px;background-color:white;transform:translate3d(0, -100%, 0);transition:transform 200ms}";
		appendNode(style, document.head);
	}

	function create_main_fragment(component, state) {
		var div, div_1, div_2, input, input_updating = false, text, label, text_3, div_3, input_1, input_1_updating = false, text_4, label_1, text_7, div_4, button;

		function input_input_handler() {
			input_updating = true;
			component.set({ dateStart: input.value });
			input_updating = false;
		}

		function input_1_input_handler() {
			input_1_updating = true;
			component.set({ dateEnd: input_1.value });
			input_1_updating = false;
		}

		function click_handler(event) {
			component.close();
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				div_2 = createElement("div");
				input = createElement("input");
				text = createText("\r\n            ");
				label = createElement("label");
				label.textContent = "С";
				text_3 = createText("\r\n        ");
				div_3 = createElement("div");
				input_1 = createElement("input");
				text_4 = createText("\r\n            ");
				label_1 = createElement("label");
				label_1.textContent = "ПО";
				text_7 = createText("\r\n        ");
				div_4 = createElement("div");
				button = createElement("button");
				button.textContent = "Применить";
				this.h();
			},

			h: function hydrate() {
				addListener(input, "input", input_input_handler);
				setAttribute(input, "type", "date");
				input.className = "validate";
				div_2.className = "input-field col s6";
				addListener(input_1, "input", input_1_input_handler);
				setAttribute(input_1, "type", "date");
				input_1.className = "validate";
				div_3.className = "input-field col s6";
				addListener(button, "click", click_handler);
				button.className = "btn green right waves-effect waves-light";
				div_4.className = "col s12";
				div_1.className = "row";
				div.id = "FilterModalComponent";
				div.className = "svelte-vd5tlj";
			},

			m: function mount(target, anchor) {
				insertNode(div, target, anchor);
				appendNode(div_1, div);
				appendNode(div_2, div_1);
				appendNode(input, div_2);

				input.value = state.dateStart;

				appendNode(text, div_2);
				appendNode(label, div_2);
				appendNode(text_3, div_1);
				appendNode(div_3, div_1);
				appendNode(input_1, div_3);

				input_1.value = state.dateEnd;

				appendNode(text_4, div_3);
				appendNode(label_1, div_3);
				appendNode(text_7, div_1);
				appendNode(div_4, div_1);
				appendNode(button, div_4);
			},

			p: function update(changed, state) {
				if (!input_updating) input.value = state.dateStart;
				if (!input_1_updating) input_1.value = state.dateEnd;
			},

			u: function unmount() {
				detachNode(div);
			},

			d: function destroy() {
				removeListener(input, "input", input_input_handler);
				removeListener(input_1, "input", input_1_input_handler);
				removeListener(button, "click", click_handler);
			}
		};
	}

	function FilterModalComponent(options) {
		init(this, options);
		this._state = assign({}, options.data);
		this._recompute({ dateStart: 1, dateEnd: 1 }, this._state);

		if (!document.getElementById("svelte-vd5tlj-style")) add_css();

		var _oncreate = oncreate.bind(this);

		if (!options.root) {
			this._oncreate = [];
		}

		this._fragment = create_main_fragment(this, this._state);

		this.root._oncreate.push(_oncreate);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);

			callAll(this._oncreate);
		}
	}

	assign(FilterModalComponent.prototype, {
	 	destroy: destroy,
	 	get: get,
	 	fire: fire,
	 	observe: observe,
	 	on: on,
	 	set: set,
	 	teardown: destroy,
	 	_set: _set,
	 	_mount: _mount,
	 	_unmount: _unmount,
	 	_differs: _differs
	 });

	FilterModalComponent.prototype._recompute = function _recompute(changed, state) {
		if (changed.dateStart) {
			if (this._differs(state.dateStart, (state.dateStart = dateStart(state.dateStart)))) changed.dateStart = true;
		}

		if (changed.dateEnd) {
			if (this._differs(state.dateEnd, (state.dateEnd = dateEnd(state.dateEnd)))) changed.dateEnd = true;
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function appendNode(node, target) {
		target.appendChild(node);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function addListener(node, event, handler) {
		node.addEventListener(event, handler, false);
	}

	function setAttribute(node, attribute, value) {
		node.setAttribute(attribute, value);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function removeListener(node, event, handler) {
		node.removeEventListener(event, handler, false);
	}

	function init(component, options) {
		component._observers = { pre: blankObject(), post: blankObject() };
		component._handlers = blankObject();
		component._bind = options._bind;

		component.options = options;
		component.root = options.root || component;
		component.store = component.root.store || options.store;
	}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = this.get = noop;

		if (detach !== false) this._fragment.u();
		this._fragment.d();
		this._fragment = this._state = null;
	}

	function get(key) {
		return key ? this._state[key] : this._state;
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			handlers[i].call(this, data);
		}
	}

	function observe(key, callback, options) {
		var group = options && options.defer
			? this._observers.post
			: this._observers.pre;

		(group[key] || (group[key] = [])).push(callback);

		if (!options || options.init !== false) {
			callback.__calling = true;
			callback.call(this, this._state[key]);
			callback.__calling = false;
		}

		return {
			cancel: function() {
				var index = group[key].indexOf(callback);
				if (~index) group[key].splice(index, 1);
			}
		};
	}

	function on(eventName, handler) {
		if (eventName === 'teardown') return this.on('destroy', handler);

		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		this.root._lock = true;
		callAll(this.root._beforecreate);
		callAll(this.root._oncreate);
		callAll(this.root._aftercreate);
		this.root._lock = false;
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			dispatchObservers(this, this._observers.pre, changed, this._state, oldState);
			this._fragment.p(changed, this._state);
			dispatchObservers(this, this._observers.post, changed, this._state, oldState);
		}
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	function _unmount() {
		if (this._fragment) this._fragment.u();
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function blankObject() {
		return Object.create(null);
	}

	function noop() {}

	function dispatchObservers(component, group, changed, newState, oldState) {
		for (var key in group) {
			if (!changed[key]) continue;

			var newValue = newState[key];
			var oldValue = oldState[key];

			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}
	return FilterModalComponent;
}());