/* AuthComponent.html generated by Svelte v1.60.2 */
var AuthComponent = (function() { "use strict";

	function oncreate() {
    this.observe('email', email => { console.log('email: ', email); });
    this.observe('password', password => { console.log('password: ', password); });
};

	function create_main_fragment(component, state) {
		var div, div_1, div_2, div_3, text_4, div_4, div_5, i, text_5, input, input_updating = false, text_6, label, text_9, div_6, i_1, text_10, input_1, input_1_updating = false, text_11, label_1, text_14, button, text_16, div_7;

		function input_input_handler() {
			input_updating = true;
			component.set({ email: input.value });
			input_updating = false;
		}

		function input_1_input_handler() {
			input_1_updating = true;
			component.set({ password: input_1.value });
			input_1_updating = false;
		}

		function click_handler(event) {
			component.login();
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				div_2 = createElement("div");
				div_3 = createElement("div");
				div_3.innerHTML = "<h3 style=\"text-align: center; margin-bottom: 10px;\">Приветствуем!</h3>\r\n                <span style=\"font-size: 16px\">Авторизация в систему FONDO</span>";
				text_4 = createText("\r\n            ");
				div_4 = createElement("div");
				div_5 = createElement("div");
				i = createElement("i");
				text_5 = createText("\r\n                    ");
				input = createElement("input");
				text_6 = createText("\r\n                    ");
				label = createElement("label");
				label.textContent = "Email";
				text_9 = createText("\r\n                ");
				div_6 = createElement("div");
				i_1 = createElement("i");
				text_10 = createText("\r\n                    ");
				input_1 = createElement("input");
				text_11 = createText("\r\n                    ");
				label_1 = createElement("label");
				label_1.textContent = "Пароль";
				text_14 = createText("\r\n                ");
				button = createElement("button");
				button.innerHTML = "<i class=\"mdi mdi-chevron-right black-text\"></i>";
				text_16 = createText("\r\n                ");
				div_7 = createElement("div");
				div_7.innerHTML = "<span>Забыли пароль?</span>";
				this.h();
			},

			h: function hydrate() {
				setStyle(div_3, "height", "40vh");
				setStyle(div_3, "padding-top", "15%");
				i.className = "mdi mdi-account prefix";
				addListener(input, "input", input_input_handler);
				input.id = "email";
				setAttribute(input, "type", "text");
				label.htmlFor = "email";
				div_5.className = "input-field col s12";
				i_1.className = "mdi mdi-lock prefix";
				addListener(input_1, "input", input_1_input_handler);
				input_1.id = "password";
				setAttribute(input_1, "type", "password");
				label_1.htmlFor = "password";
				div_6.className = "input-field col s12";
				addListener(button, "click", click_handler);
				button.className = "btn-floating btn-large white waves-effect waves-teal";
				setStyle(button, "margin-top", "25px");
				setStyle(div_7, "position", "absolute");
				setStyle(div_7, "bottom", "10px");
				setStyle(div_7, "left", "0");
				setStyle(div_7, "width", "100%");
				div_4.className = "row flex-block";
				setStyle(div_4, "height", "58vh");
				setStyle(div_4, "align-content", "center");
				div_2.className = "white-text";
				setStyle(div_2, "text-align", "center");
				div_1.className = "teal-cover-block";
				div.id = "AuthComponent";
			},

			m: function mount(target, anchor) {
				insertNode(div, target, anchor);
				appendNode(div_1, div);
				appendNode(div_2, div_1);
				appendNode(div_3, div_2);
				appendNode(text_4, div_2);
				appendNode(div_4, div_2);
				appendNode(div_5, div_4);
				appendNode(i, div_5);
				appendNode(text_5, div_5);
				appendNode(input, div_5);

				input.value = state.email;

				appendNode(text_6, div_5);
				appendNode(label, div_5);
				appendNode(text_9, div_4);
				appendNode(div_6, div_4);
				appendNode(i_1, div_6);
				appendNode(text_10, div_6);
				appendNode(input_1, div_6);

				input_1.value = state.password;

				appendNode(text_11, div_6);
				appendNode(label_1, div_6);
				appendNode(text_14, div_4);
				appendNode(button, div_4);
				appendNode(text_16, div_4);
				appendNode(div_7, div_4);
			},

			p: function update(changed, state) {
				if (!input_updating) input.value = state.email;
				if (!input_1_updating) input_1.value = state.password;
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

	function AuthComponent(options) {
		init(this, options);
		this._state = assign({}, options.data);

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

	assign(AuthComponent.prototype, {
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

	AuthComponent.prototype._recompute = noop;

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function setStyle(node, key, value) {
		node.style.setProperty(key, value);
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

	function appendNode(node, target) {
		target.appendChild(node);
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

	function noop() {}

	function blankObject() {
		return Object.create(null);
	}

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
	return AuthComponent;
}());