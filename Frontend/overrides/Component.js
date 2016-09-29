/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.Component',
	{
		override: 'Ext.Component',

		addManagedListener: function(item, ename, fn, scope, options, /* private */ noDestroy) {
			var me = this,
				managedListeners = me.managedListeners = me.managedListeners || [],
				config, passedOptions;

			if (ename === 'click' || ename.click){console.log(2, '> Ext.mixin.Observable#addManagedListener', item);}

			if (typeof ename !== 'string') {
				// When creating listeners using the object form, allow caller to override the default of 
				// using the listeners object as options. 
				// This is used by relayEvents, when adding its relayer so that it does not contribute 
				// a spurious options param to the end of the arg list. 
				passedOptions = arguments.length > 4 ? options : ename;
				if (ename === 'click' || ename.click){console.log(2.1, passedOptions);}

				options = ename;
				for (ename in options) {
					if (options.hasOwnProperty(ename)) {
						config = options[ename];
						if (ename === 'click' || ename.click){console.log(2.11, config, item.$eventOptions);}
						if (!item.$eventOptions[ename]) {
							if (ename === 'click' || ename.click){console.log(2.111);}
							// recurse, but pass the noDestroy parameter as true so that lots of individual Destroyables are not created. 
							// We create a single one at the end if necessary. 
							me.addManagedListener(item, ename, config.fn || config, config.scope || options.scope || scope, config.fn ? config : passedOptions, true);
						}
					}
				}
				if (options && options.destroyable) {
					if (ename === 'click' || ename.click){console.log(2.12, passedOptions);}
					return new ListenerRemover(me, item, options);
				}
			}
			else {
				if (ename === 'click'){console.log(2.2, fn);}
				if (fn !== Ext.emptyFn) {
					if (ename === 'click'){console.log(2.21, options);}
					item.doAddListener(ename, fn, scope, options, null, me, me);

					// The 'noDestroy' flag is sent if we're looping through a hash of listeners passing each one to addManagedListener separately 
					if (!noDestroy && options && options.destroyable) {
						if (ename === 'click'){console.log(2.211);}
						return new ListenerRemover(me, item, ename, fn, scope);
					}
				}
			}
		},
		
		initEvents: function() {
			var me = this,
				afterRenderEvents = me.afterRenderEvents,
				afterRenderEvent, el, property, index, len;

			console.log('**********************');
			console.log(1, '> Ext.Component#initEvents', afterRenderEvents, me);

			if (afterRenderEvents) {
				console.log(1.1);
				for (property in afterRenderEvents) {
					el = me[property];

					console.log(1.11, property, el, el.on);
					if (el && el.on) {
						console.log(1.111, afterRenderEvents[property]);
						afterRenderEvent = afterRenderEvents[property];

						for (index = 0, len = afterRenderEvent.length ; index < len ; ++index) {
							console.log(1.1111, index, afterRenderEvent[index]);
							me.mon(el, afterRenderEvent[index]);
						}
					}
				}
			}

			if (me.focusable) {
				console.log(1.2);
				me.initFocusableEvents();
			}
		}
	}
);