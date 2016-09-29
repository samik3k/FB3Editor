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

			if (eventName === 'click')
			{
				console.log(4, ' > Ext.util.Event#addListener', eventName, me.findListener(fn, scope) === -1, observable);
			}

			//<debug>
			if (scope && !Ext._namedScopes[scope] && (typeof fn === 'string') && (typeof scope[fn] !== 'function')) {
				Ext.raise("No method named '" + fn + "' found on scope object");
			}
			//</debug>

			if (me.findListener(fn, scope) === -1) {
				listener = me.createListener(fn, scope, options, caller, manager);

				if (me.firing) {
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
					if (!isNegativePriority || hasNegativePriorityIndex) {
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
						// if the priority is a negative number, and there are no other negative
						// priority listeners, then no calculation is needed - the negative
						// priority listener gets appended to the end of the listeners array.
						me._highestNegativePriorityIndex = index;
					}
				} else if (hasNegativePriorityIndex) {
					// listeners with a priority of 0 or undefined are appended to the end of
					// the listeners array unless there are negative priority listeners in the
					// listeners array, then they are inserted before the highest negative
					// priority listener.
					index = highestNegativePriorityIndex;
				}

				if (!isNegativePriority && index <= highestNegativePriorityIndex) {
					me._highestNegativePriorityIndex ++;
				}
				if (index === length) {
					listeners[length] = listener;
				} else {
					Ext.Array.insert(listeners, index, [listener]);
				}

				if (observable.isElement) {
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
		}
	}
);