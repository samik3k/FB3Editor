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

			console.log(domEvents);

			console.log(Ext.supports.Touch, Ext.supports.TouchEvents);

			if (domEvents) {
				// If the publisher has handledDomEvents we attach delegated listeners up front
				// for those events. Dom publisher does not have a list of event names, but
				// attaches listeners dynamically as subscribers are subscribed.  This allows it
				// to handle all DOM events that are not explicitly handled by another publisher.
				// Subclasses such as Gesture must explicitly list their handledDomEvents.
				for (i = 0, ln = domEvents.length; i < ln; i++) {
					me.addDelegatedListener(domEvents[i]);
				}
			}

			Ext.getWin().on('unload', me.destroy, me);
		}
	}
);