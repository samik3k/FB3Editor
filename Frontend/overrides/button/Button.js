/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.button.Button',
	{
		override: 'Ext.button.Button',

		onRender: function() {
			var me = this,
				addOnclick, btn, btnListeners;

			console.log(0, '<before callParent> Ext.button.Button#onRender', me);

			me.callParent(arguments);
			// Set btn as a local variable for easy access
			btn = me.el;
			console.log(0, '<after callParent> Ext.button.Button#onRender', btn);
			if (me.tooltip) {
				console.log(0.1, me.tooltip);
				me.setTooltip(me.tooltip, true);
			}
			// Add the mouse events to the button
			if (me.handleMouseEvents) {
				console.log(0.2, me.handleMouseEvents);
				btnListeners = {
					scope: me,
					mouseover: me.onMouseOver,
					mouseout: me.onMouseOut,
					mousedown: me.onMouseDown
				};
				if (me.split) {
					console.log(0.21, me.split);
					btnListeners.mousemove = me.onMouseMove;
				}
			} else {
				console.log(0.3);
				btnListeners = {
					scope: me
				};
			}
			// Touch start events must be preventDefaulted when in disabled state
			if (Ext.supports.Touch) {
				console.log(0.4, Ext.supports.Touch, me.onTouchStart);
				btnListeners.touchstart = me.onTouchStart;
			}
			// Check if it is a repeat button
			if (me.repeat) {
				console.log(0.5, me.repeat);
				me.mon(new Ext.util.ClickRepeater(btn, Ext.isObject(me.repeat) ? me.repeat : {}), 'click', me.onRepeatClick, me);
			} else {
				console.log(0.6, btnListeners, me.clickEvent);
				// If the activation event already has a handler, make a note to add the handler later
				if (btnListeners[me.clickEvent]) {
					console.log(0.61);
					addOnclick = true;
				} else {
					console.log(0.62, me.onClick);
					btnListeners[me.clickEvent] = me.onClick;
				}
			}
			// Add whatever button listeners we need
			console.log(0.7);
			me.mon(btn, btnListeners);
			if (me.hasFrameTable()) {
				console.log(0.8, me.frameTable, me.frameTableListener);
				me.mon(me.frameTable, 'click', me.frameTableListener, me);
			}
			// If the listeners object had an entry for our clickEvent, add a listener now
			if (addOnclick) {
				console.log(0.9, me.clickEvent, me.onClick);
				me.mon(btn, me.clickEvent, me.onClick, me);
			}
			Ext.button.Manager.register(me);
		}
	}
);