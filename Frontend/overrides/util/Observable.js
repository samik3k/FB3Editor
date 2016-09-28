/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.util.Observable',
	{
		override: 'Ext.util.Observable',
		
		constructor: function(config) {
			var me = this,
				self = me.self,
				declaredListeners, listeners,
				bubbleEvents, len, i;

			if (me.xtype === 'button')
			{
				//console.log('Observable', me.$observableInitialized, me);
			}

			// Observable can be extended and/or mixed in at multiple levels in a Class 
			// hierarchy, and may have its constructor invoked multiple times for a given 
			// instance.  The following ensures we only perform initialization the first 
			// time the constructor is called. 
			if (me.$observableInitialized) {
				return;
			}
			me.$observableInitialized = true;

			me.hasListeners = new me.HasListeners();

			me.eventedBeforeEventNames = {};

			me.events = me.events || {};

			declaredListeners = self.listeners;
			if (declaredListeners && !me._addDeclaredListeners(declaredListeners)) {
				// Nulling out declared listeners allows future instances to avoid 
				// recursing into the declared listeners arrays if the first instance 
				// discovers that there are no declarative listeners in its hierarchy 
				self.listeners = null;
			}

			listeners = (config && config.listeners) || me.listeners;

			if (listeners) {
				if (listeners instanceof Array) {
					// Support for listeners declared as an array: 
					// 
					//     listeners: [ 
					//         { foo: fooHandler }, 
					//         { bar: barHandler } 
					//     ] 
					for (i = 0, len = listeners.length; i < len; ++i) {
						me.addListener(listeners[i]);
					}
				} else {
					me.addListener(listeners);
				}
			}

			bubbleEvents = (config && config.bubbleEvents) || me.bubbleEvents;

			if (bubbleEvents) {
				me.enableBubble(bubbleEvents);
			}

			if (me.$applyConfigs) {
				// Ext.util.Observable applies config properties directly to the instance 
				if (config) {
					Ext.apply(me, config);
				}
			}
			else {
				// Ext.mixin.Observable uses the config system 
				me.initConfig(config);
			}

			if (listeners) {
				// Set as an instance property to preempt the prototype in case any are set there. 
				// Prevents listeners from being added multiple times if this constructor 
				// is called more than once by multiple parties in the inheritance hierarchy 
				me.listeners = null;
			}
		},

		privates: {
			doAddListener: function(ename, fn, scope, options, order, caller, manager) {
				var me = this,
					managedName = options && options.managedName,
					event, managedListeners, priority;

				order = order || (options && options.order);

				if (order) {
					priority = (options && options.priority);

					if (!priority) { // priority option takes precedence over order
						// do not mutate the user's options
						options = options ? Ext.Object.chain(options) : {};
						options.priority = me.$orderToPriority[order];
					}
				}

				ename = Ext.canonicalEventName(ename);

				//<debug>
				if (!fn) {
					Ext.raise("Cannot add '" + ename + "' listener to " + me.$className +
					          " instance.  No function specified.");
				}
				//</debug>

				if (!manager && (scope && scope.isObservable && (scope !== me))) {
					manager = scope;
				}

				if (manager) {
					// if scope is an observable, the listener will be automatically managed
					// this eliminates the need to call mon() in a majority of cases
					managedListeners = manager.managedListeners = manager.managedListeners || [];

					managedListeners.push({
						                      item: me,
						                      ename: managedName || ename,
						                      fn: fn,
						                      scope: scope,
						                      options: options
					                      });
				}

				event = (me.events || (me.events = {}))[ename];
				if (!event || !event.isEvent) {
					event = me._initEvent(ename);
				}

				if (ename === 'click')
				{
					console.log('doAddListener', ename, fn !== Ext.emptyFn, event);
				}

				if (fn !== Ext.emptyFn) {
					if (event.addListener(fn, scope, options, caller, manager)) {
						// If a new listener has been added (Event.addListener rejects duplicates of the same fn+scope)
						// then increment the hasListeners counter
						me.hasListeners._incr_(ename);
					}
				}
			}
		}
	}
);