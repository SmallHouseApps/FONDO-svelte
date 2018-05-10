/* www/layouts/ApplicList/ApplicListComponent.html generated by Svelte v1.60.2 */
var ApplicListComponent = (function() { "use strict";

	function create_main_fragment(component, state) {
		var each_anchor;

		var each_value = state.applics;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, assign(assign({}, state), {
				each_value: each_value,
				applic: each_value[i],
				applic_index: i
			}));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_anchor = createComment();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insertNode(each_anchor, target, anchor);
			},

			p: function update(changed, state) {
				var each_value = state.applics;

				if (changed.applics) {
					for (var i = each_blocks.length; i < each_value.length; i += 1) {
						var each_context = assign(assign({}, state), {
							each_value: each_value,
							applic: each_value[i],
							applic_index: i
						});

						each_blocks[i] = create_each_block(component, each_context);
						each_blocks[i].c();
						each_blocks[i].m(each_anchor.parentNode, each_anchor);
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].u();
						each_blocks[i].d();
					}
					each_blocks.length = each_value.length;
				}
			},

			u: function unmount() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
				}

				detachNode(each_anchor);
			},

			d: function destroy() {
				destroyEach(each_blocks);
			}
		};
	}

	// (1:0) {{#each applics as applic}}
	function create_each_block(component, state) {
		var applic = state.applic, each_value = state.each_value, applic_index = state.applic_index;
		var div;

		return {
			c: function create() {
				div = createElement("div");
				div.innerHTML = "<div class=\"col s12 m6\"><div class=\"card\"><div class=\"card-image\"><img src=\"img/login-bg.jpg\" alt=\"\" height=\"100\">\r\n                <span class=\"card-title\">Card Title</span>\r\n                <button class=\"btn-floating halfway-fab waves-effect waves-light red\"><i class=\"material-icons\">add</i></button></div>\r\n            <div class=\"card-content\"><p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require\r\n                    little markup to use effectively.</p></div></div></div>\r\n";
				this.h();
			},

			h: function hydrate() {
				div.className = "row";
			},

			m: function mount(target, anchor) {
				insertNode(div, target, anchor);
			},

			p: function update(changed, state) {
				applic = state.applic;
				each_value = state.each_value;
				applic_index = state.applic_index;

			},

			u: function unmount() {
				detachNode(div);
			},

			d: noop
		};
	}

	function ApplicListComponent(options) {
		init(this, options);
		this._state = assign({}, options.data);

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(ApplicListComponent.prototype, {
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

	ApplicListComponent.prototype._recompute = noop;

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function createComment() {
		return document.createComment('');
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function destroyEach(iterations) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d();
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function noop() {}

	function init(component, options) {
		component._observers = { pre: blankObject(), post: blankObject() };
		component._handlers = blankObject();
		component._bind = options._bind;

		component.options = options;
		component.root = options.root || component;
		component.store = component.root.store || options.store;
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

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
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
	return ApplicListComponent;
}());