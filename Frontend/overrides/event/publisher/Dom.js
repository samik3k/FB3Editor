/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.event.publisher.Dom',
	{
		override: 'Ext.event.publisher.Dom',

		onReady: function() {
			var me = this,
				domEvents = me.handledDomEvents,
				ln, i;

			console.log('> Ext.event.publisher.Dom#onReady', domEvents);
			console.log('supportsTouchEvents && Ext.isWebKit && Ext.os.is.Desktop', Ext.supports.TouchEvents , Ext.isWebKit , Ext.os.is.Desktop);

			if (domEvents) {
				// If the publisher has handledDomEvents we attach delegated listeners up front
				// for those events. Dom publisher does not have a list of event names, but
				// attaches listeners dynamically as subscribers are subscribed.  This allows it
				// to handle all DOM events that are not explicitly handled by another publisher.
				// Subclasses such as Gesture must explicitly list their handledDomEvents.
				for (i = 0 , ln = domEvents.length; i < ln; i++) {
					me.addDelegatedListener(domEvents[i]);
				}
			}
			Ext.getWin().on('unload', me.destroy, me);
		},

		subscribe: function (element, eventName, delegated, capture)
		{
			var me = this,
				subscribers, id;

			if (eventName === 'touchstart' || eventName === 'touchend')
			{
				console.log(6, '> Ext.event.publisher.Dom#subscribe', eventName, this.target, element.component);
			}

			if (delegated && !me.directEvents[eventName]) {
				// delegated listeners
				subscribers = capture ? me.captureSubscribers : me.bubbleSubscribers;
				if (eventName === 'touchstart' || eventName === 'touchend'){console.log(6.1, subscribers, me.handles[eventName], me.delegatedListeners[eventName], me.handles, me.delegatedListeners);}

				if (!me.handles[eventName] && !me.delegatedListeners[eventName]) {
					if (eventName === 'touchstart' || eventName === 'touchend'){console.log(6.11);}
					// First time we've attached a listener for this eventName - need to begin
					// listening at the dom level
					me.addDelegatedListener(eventName);
				}

				if (subscribers[eventName]) {
					if (eventName === 'touchstart' || eventName === 'touchend'){console.log(6.12);}
					++subscribers[eventName];
				} else {
					if (eventName === 'touchstart' || eventName === 'touchend'){console.log(6.13);}
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
				if (eventName === 'touchstart' || eventName === 'touchend'){console.log(6.2, id, subscribers);}
				if (subscribers[id]) {
					if (eventName === 'touchstart' || eventName === 'touchend'){console.log(6.21);}
					++subscribers[id];
				} else {
					if (eventName === 'touchstart' || eventName === 'touchend'){console.log(6.22);}
					subscribers[id] = 1;
					me.addDirectListener(eventName, element, capture);
				}
			}
		},

		addDelegatedListener: function(eventName) {
			var me = this;

			console.log(77, '> Ext.event.publisher.Dom#addDelegatedListener', eventName, this.target, this.captureEvents);
			this.delegatedListeners[eventName] = 1;
			this.target.addEventListener(
				eventName, this.onDelegatedEvent, !!this.captureEvents[eventName]
			);
		},

		addDirectListener: function(eventName, element, capture) {
			if (eventName === 'touchstart' || eventName === 'touchend')
			{
				console.log(88, '> Ext.event.publisher.Dom#addDirectListener', eventName, element);
			}
			element.dom.addEventListener(
				eventName,
				capture ? this.onDirectCaptureEvent : this.onDirectEvent,
				capture
			);
		},

		doDelegatedEvent: function(e, invokeAfter) {
			var me = this,
				timeStamp = e.timeStamp;

			e = new Ext.event.Event(e);

			if (e.type === 'touchstart' || e.type === 'touchend')
			{
				console.log('Ext.event.publisher.Dom#doDelegatedEvent', e.type, e, me.isEventBlocked(e));
			}

			if (me.isEventBlocked(e)) {
				return false;
			}

			me.beforeEvent(e);

			Ext.frameStartTime = timeStamp;

			me.reEnterCount++;
			me.publish(e.type, e.target, e);
			me.reEnterCount--;

			if (invokeAfter !== false) {
				me.afterEvent(e);
			}

			return e;
		},

		publish: function(eventName, target, e) {
			var me = this,
				targets, el, i, ln;

			if (eventName === 'touchstart' || eventName === 'touchend')
			{
				console.log('Ext.event.publisher.Dom#publish', eventName, target, e);
			}

			if (Ext.isArray(target)) {
				// Gesture publisher passes an already created array of propagating targets
				targets = target;
			} else if (me.captureEvents[eventName]) {
				el = Ext.cache[target.id];
				targets = el ? [el] : [];
			} else {
				targets = me.getPropagatingTargets(target);
			}

			ln = targets.length;

			// We will now proceed to fire events in both capture and bubble phases.  You
			// may notice that we are looping all potential targets both times, and only
			// firing on the target if there is an Ext.Element wrapper in the cache.  This is
			// done (vs. eliminating non-cached targets from the array up front) because
			// event handlers can add listeners to other elements during propagation.  Looping
			// all the potential targets ensures that these dynamically added listeners
			// are fired.  See https://sencha.jira.com/browse/EXTJS-15953

			// capture phase (top-down event propagation).
			if (me.captureSubscribers[eventName]) {
				for (i = ln; i--;) {
					el = Ext.cache[targets[i].id];
					if (el) {
						me.fire(el, eventName, e, false, true);
						if (e.isStopped) {
							break;
						}
					}
				}
			}

			// bubble phase (bottom-up event propagation).
			// stopPropagation during capture phase cancels entire bubble phase
			if (!e.isStopped && me.bubbleSubscribers[eventName]) {
				for (i = 0; i < ln; i++) {
					el = Ext.cache[targets[i].id];
					if (el) {
						me.fire(el, eventName, e, false, false);
						if (e.isStopped) {
							break;
						}
					}
				}
			}
		},

		fire: function(element, eventName, e, direct, capture) {
			var event;

			if (eventName === 'touchstart' || eventName === 'touchend')
			{
				console.log('Ext.event.publisher.Dom#fire', element.hasListeners[eventName], element);
			}

			if (element.hasListeners[eventName]) {
				event = element.events[eventName];

				if (event) {
					if (capture && direct) {
						event = event.directCaptures;
					} else if (capture) {
						event = event.captures;
					} else if (direct) {
						event = event.directs;
					}

					// yes, this second null check for event is necessary - one of the
					// above assignments might have resulted in undefined
					if (event) {
						if (eventName === 'touchstart' || eventName === 'touchend')
						{
							console.log('Ext.event.publisher.Dom#setCurrentTarget', event, element.dom);
						}
						e.setCurrentTarget(element.dom);
						event.fire(e, e.target);
					}
				}
			}
		}
	}
);