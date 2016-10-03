/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.dom.Element',
	{
		override: 'Ext.dom.Element',

		privates: {
			doAddListener: function (eventName, fn, scope, options, order, caller, manager)
			{
				var me = this,
					observableDoAddListener, additiveEventName,
					translatedEventName;

				// Even though the superclass method does conversion to lowercase, we need
				// to do it here because we need to use the lowercase name for lookup
				// in the event translation map.
				eventName = Ext.canonicalEventName(eventName);
				if (eventName === 'touchstart' || eventName === 'touchend'){console.log(3, '> Ext.dom.Element#doAddListener', eventName, me.blockedEvents, me);}

				// Blocked events (such as emulated mouseover in mobile webkit) are prevented
				// from firing
				if (!me.blockedEvents[eventName])
				{
					observableDoAddListener = me.mixins.observable.doAddListener;
					options = options || {};
					if (eventName === 'touchstart' || eventName === 'touchend'){console.log(3.1, options, observableDoAddListener);}

					if (me.longpressEvents[eventName])
					{
						if (eventName === 'touchstart' || eventName === 'touchend'){console.log(3.12);}
						me.disableTouchContextMenu();
					}

					if (Element.useDelegatedEvents === false)
					{
						options.delegated = options.delegated || false;
						if (eventName === 'touchstart' || eventName === 'touchend'){console.log(3.13, options.delegated);}
					}

					if (options.translate !== false)
					{
						// translate events where applicable.  This allows applications that
						// were written for desktop to work on mobile devices and vice versa.
						additiveEventName = me.additiveEvents[eventName];
						if (eventName === 'touchstart' || eventName === 'touchend'){console.log(3.14, additiveEventName, me.additiveEvents);}
						if (additiveEventName)
						{
							if (eventName === 'touchstart' || eventName === 'touchend'){console.log(3.141, additiveEventName);}
							// additiveEvents means the translation is "additive" - meaning we
							// need to attach the original event in addition to the translated
							// one.  An example of this is devices that have both mousedown
							// and touchstart
							options.type = eventName;
							eventName = additiveEventName;
							observableDoAddListener.call(me, eventName, fn, scope, options, order, caller, manager);
						}

						translatedEventName = me.eventMap[eventName];
						if (translatedEventName)
						{
							if (eventName === 'touchstart' || eventName === 'touchend'){console.log(3.142, translatedEventName);}
							// options.type may have already been set above
							options.type = options.type || eventName;
							eventName = translatedEventName;
						}
					}

					observableDoAddListener.call(me, eventName, fn, scope, options, order, caller, manager);

					// after the listener has been added to the ListenerStack, it's original
					// "type" (for translated events) will be stored on the listener object in
					// the ListenerStack.  We can now delete type from the options object
					// since it is not a user-supplied option
					delete options.type;
				}
			}
		}
	}
);