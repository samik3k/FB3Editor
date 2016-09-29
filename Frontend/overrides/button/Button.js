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

			console.log(0, '> onRender', me);

			me.callParent(arguments);
			// Set btn as a local variable for easy access
			btn = me.el;
			if (me.tooltip) {
				me.setTooltip(me.tooltip, true);
			}
			// Add the mouse events to the button
			if (me.handleMouseEvents) {
				btnListeners = {
					scope: me,
					mouseover: me.onMouseOver,
					mouseout: me.onMouseOut,
					mousedown: me.onMouseDown
				};
				if (me.split) {
					btnListeners.mousemove = me.onMouseMove;
				}
			} else {
				btnListeners = {
					scope: me
				};
			}
			// Touch start events must be preventDefaulted when in disabled state
			if (Ext.supports.Touch) {
				btnListeners.touchstart = me.onTouchStart;
			}
			// Check if it is a repeat button
			if (me.repeat) {
				me.mon(new Ext.util.ClickRepeater(btn, Ext.isObject(me.repeat) ? me.repeat : {}), 'click', me.onRepeatClick, me);
			} else {
				// If the activation event already has a handler, make a note to add the handler later
				if (btnListeners[me.clickEvent]) {
					addOnclick = true;
				} else {
					btnListeners[me.clickEvent] = me.onClick;
				}
			}
			// Add whatever button listeners we need
			console.log('onRender mon');
			me.mon(btn, btnListeners);
			if (me.hasFrameTable()) {
				me.mon(me.frameTable, 'click', me.frameTableListener, me);
			}
			// If the listeners object had an entry for our clickEvent, add a listener now
			if (addOnclick) {
				me.mon(btn, me.clickEvent, me.onClick, me);
			}
			Ext.button.Manager.register(me);
		}
	}
);