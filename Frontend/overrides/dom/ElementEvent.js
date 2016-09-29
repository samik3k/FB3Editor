/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.dom.ElementEvent',
	{
		override: 'Ext.dom.ElementEvent',

		addListener: function(fn, scope, options, caller, manager) {
			var me = this,
				added = false,
				name = me.name,
				captures, directs, directCaptures;

			if (name === 'click')
			{
				console.log(4, '> Ext.dom.ElementEvent#addListener', name, options, Ext.event.publisher.Dom.instance.directEvents);
			}

			options = options || {};

			if (options.delegated === false || Ext.event.publisher.Dom.instance.directEvents[name]) {
				if (name === 'click'){console.log(4.1, Ext.event.publisher.Dom.instance.directEvents[name]);}
				if (options.capture) {
					directCaptures = me.directCaptures ||
					                 (me.directCaptures = new Ext.util.Event(me.observable, name));
					if (name === 'click'){console.log(4.11, directCaptures);}
					added = directCaptures.addListener(fn, scope, options, caller, manager);
				} else {
					directs = me.directs || (me.directs = new Ext.util.Event(me.observable, name));
					if (name === 'click'){console.log(4.12, directs);}
					added = directs.addListener(fn, scope, options, caller, manager);
				}
			} else if (options.capture) {
				captures = me.captures || (me.captures = new Ext.util.Event(me.observable, name));
				if (name === 'click'){console.log(4.2, captures);}
				added = captures.addListener(fn, scope, options, caller, manager);
			} else {
				if (name === 'click'){console.log(4.3);}
				added = me.callParent([fn, scope, options, caller, manager]);
			}

			return added;
		}
	}
);