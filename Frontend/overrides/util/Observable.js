/**
 * .
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.util.Observable',
	{
		override: 'Ext.util.Observable',

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