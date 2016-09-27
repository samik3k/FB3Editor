/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.event.publisher.Dom',
	{
		override: 'Ext.event.publisher.Dom',

		subscribe: function (element, eventName, delegated, capture)
		{
			var me = this,
				subscribers, id;

			if (eventName === 'click' && element.component && element.component.xtype === 'button')
			{
				console.log('subscribe', eventName, delegated && !me.directEvents[eventName],  element.component);
			}

			if (delegated && !me.directEvents[eventName]) {
				// delegated listeners
				subscribers = capture ? me.captureSubscribers : me.bubbleSubscribers;

				if (eventName === 'click' && element.component && element.component.xtype === 'button')
				{
					console.log(!me.handles[eventName] && !me.delegatedListeners[eventName], subscribers[eventName]);
				}

				if (!me.handles[eventName] && !me.delegatedListeners[eventName]) {
					// First time we've attached a listener for this eventName - need to begin
					// listening at the dom level
					me.addDelegatedListener(eventName);
				}

				if (subscribers[eventName]) {
					++subscribers[eventName];
				} else {
					subscribers[eventName] = 1;
				}
			} else {
				subscribers = capture ? me.directCaptureSubscribers : me.directSubscribers;

				id = element.id;
				// Direct subscribers are tracked by eventName first and by element id second.
				// This allows the element id key to be deleted when there are no more subscribers
				// so that this map does not grow indefinitely (it can only grow to a finite
				// set of event names) - see unsubscribe
				subscribers = subscribers[eventName] || (subscribers[eventName] = {});
				if (subscribers[id]) {
					++subscribers[id];
				} else {
					subscribers[id] = 1;
					me.addDirectListener(eventName, element, capture);
				}
			}
		},

		addDirectListener: function(eventName, element, capture) {
			var me = this;

			if (eventName === 'click' && element.component && element.component.xtype === 'button')
			{
				console.log('addDirectListener', eventName, element.component);
			}

			me.callParent(arguments);
		}
	}
);