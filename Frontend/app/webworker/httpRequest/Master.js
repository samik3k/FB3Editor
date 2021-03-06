/**
 * Владелец потока httpRequest.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.webworker.httpRequest.Master',
	{
		extend: 'FBEditor.webworker.AbstractMaster',

		name: 'httpRequest',

		/**
		 * Прерывает запрос.
		 */
		abort: function ()
		{
			var me = this;

			me.post(
				{
					abort: true
				}
			);
		},

		message: function (e)
		{
			var data = e.data,
				manager = FBEditor.webworker.Manager,
				me = manager.getMaster(data.masterName),
				response = data.data.response,
				callbackId = data.data.callbackId || null,
				callback;

			//console.log('Поток ' + data.masterName + ' сообщил:', data, me);

			// колбэк
			callback = me.getCallback(callbackId);

			if (callback && !data.data.abort)
			{
				callback.fn.call(callback.scope, response, data.data);
			}
		},

		error: function (e)
		{
			var manager = FBEditor.webworker.Manager,
				me = manager.getMaster('httpRequest'),
				msg,
				callback;

			msg = 'Ошибка выполнения потока ' + e.filename + ' в строке ' + e.lineno + ': ' + e.message;
			Ext.log({msg: msg, level: 'error'});

			// первый колбэк
			callback = me.getCallback();

			if (callback)
			{
				callback.fn.call(callback.scope, false);
			}
		}

	}
);