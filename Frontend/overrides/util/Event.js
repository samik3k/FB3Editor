/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.util.Event',
	{
		override: 'Ext.util.Event',

		addListener: function(fn, scope, options, caller, manager) {
			var me = this,
				added = false,
				observable = me.observable,
				eventName = me.name,
				listeners, listener, priority, isNegativePriority, highestNegativePriorityIndex,
				hasNegativePriorityIndex, length, index, i, listenerPriority;

			if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown')
			{
				console.log(5, '> Ext.util.Event#addListener', eventName, me.findListener(fn, scope) === -1, observable);
			}

			//<debug>
			if (scope && !Ext._namedScopes[scope] && (typeof fn === 'string') && (typeof scope[fn] !== 'function')) {
				Ext.raise("No method named '" + fn + "' found on scope object");
			}
			//</debug>

			if (me.findListener(fn, scope) === -1) {
				listener = me.createListener(fn, scope, options, caller, manager);
				if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown')
				{
					console.log(5.1, listener);
				}

				if (me.firing) {
					if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown')
					{
						console.log(5.11, listener);
					}
					// if we are currently firing this event, don't disturb the listener loop
					me.listeners = me.listeners.slice(0);
				}
				listeners = me.listeners;
				index = length = listeners.length;
				priority = options && options.priority;
				highestNegativePriorityIndex = me._highestNegativePriorityIndex;
				hasNegativePriorityIndex = highestNegativePriorityIndex !== undefined;
				if (priority) {
					// Find the index at which to insert the listener into the listeners array,
					// sorted by priority highest to lowest.
					isNegativePriority = (priority < 0);
					if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown')
					{
						console.log(5.12);
					}
					if (!isNegativePriority || hasNegativePriorityIndex) {
						if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown')
						{
							console.log(5.121);
						}
						// If the priority is a positive number, or if it is a negative number
						// and there are other existing negative priority listenrs, then we
						// need to calcuate the listeners priority-order index.
						// If the priority is a negative number, begin the search for priority
						// order index at the index of the highest existing negative priority
						// listener, otherwise begin at 0
						for(i = (isNegativePriority ? highestNegativePriorityIndex : 0); i < length; i++) {
							// Listeners created without options will have no "o" property
							listenerPriority = listeners[i].o ? listeners[i].o.priority||0 : 0;
							if (listenerPriority < priority) {
								index = i;
								break;
							}
						}
					} else {
						if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown')
						{
							console.log(5.122);
						}
						// if the priority is a negative number, and there are no other negative
						// priority listeners, then no calculation is needed - the negative
						// priority listener gets appended to the end of the listeners array.
						me._highestNegativePriorityIndex = index;
					}
				} else if (hasNegativePriorityIndex) {
					if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown')
					{
						console.log(5.13);
					}
					// listeners with a priority of 0 or undefined are appended to the end of
					// the listeners array unless there are negative priority listeners in the
					// listeners array, then they are inserted before the highest negative
					// priority listener.
					index = highestNegativePriorityIndex;
				}

				if (!isNegativePriority && index <= highestNegativePriorityIndex) {
					if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown')
					{
						console.log(5.14);
					}
					me._highestNegativePriorityIndex ++;
				}
				if (index === length) {
					if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown'){console.log(5.15, index);}
					listeners[length] = listener;
				} else {
					if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown'){console.log(5.16);}
					Ext.Array.insert(listeners, index, [listener]);
				}

				if (observable.isElement) {
					if (eventName === 'click' || eventName === 'tap' || eventName === 'mousedown'){console.log(5.17);}
					// It is the role of Ext.util.Event (vs Ext.Element) to handle subscribe/
					// unsubscribe because it is the lowest level place to intercept the
					// listener before it is added/removed.  For addListener this could easily
					// be done in Ext.Element's doAddListener override, but since there are
					// multiple paths for listener removal (un, clearListeners), it is best
					// to keep all subscribe/unsubscribe logic here.
					observable._getPublisher(eventName).subscribe(
						observable,
						eventName,
						options.delegated !== false,
						options.capture
					);
				}

				added = true;
			}

			return added;
		},

		createListener: function(fn, scope, o, caller, manager) {
			var me = this,
				namedScope = Ext._namedScopes[scope],
				listener = {
					fn: fn,
					scope: scope,
					ev: me,
					caller: caller,
					manager: manager,
					namedScope: namedScope,
					defaultScope: namedScope ? (scope || me.observable) : undefined,
					lateBound: typeof fn === 'string'
				},
				handler = fn,
				wrapped = false,
				type;

			//console.log(55, '> Ext.util.Event#createListener', o);

			// The order is important. The 'single' wrapper must be wrapped by the 'buffer' and 'delayed' wrapper
			// because the event removal that the single listener does destroys the listener's DelayedTask(s)
			if (o) {
				listener.o = o;
				if (o.single) {
					handler = me.createSingle(handler, listener, o, scope);
					wrapped = true;
				}
				if (o.target) {
					handler = me.createTargeted(handler, listener, o, scope, wrapped);
					wrapped = true;
				}
				if (o.delay) {
					handler = me.createDelayed(handler, listener, o, scope, wrapped);
					wrapped = true;
				}
				if (o.buffer) {
					handler = me.createBuffered(handler, listener, o, scope, wrapped);
					wrapped = true;
				}

				if (me.observable.isElement) {
					// If the event type was translated, e.g. mousedown -> touchstart, we need to save
					// the original type in the listener object so that the Ext.event.Event object can
					// reflect the correct type at firing time
					type = o.type;
					if (type) {
						listener.type = type;
					}
				}
			}

			listener.fireFn = handler;
			listener.wrapped = wrapped;
			return listener;
		}
	}
);