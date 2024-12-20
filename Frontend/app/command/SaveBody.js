/**
 * Сохраняет тело.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.SaveBody',
	{
		extend: 'FBEditor.command.AbstractCommand',

		execute: function ()
		{
			var me = this,
				data = me.data,
				result = false,
				editorManager = data.editorManager;

			try
			{
				// сохраняем тело книги на хабе
				editorManager.saveToUrl();
			}
			catch (e)
			{
				Ext.log({level: 'error', msg: 'Ошибка сохранения тела книги', dump: e});
				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: e,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}

			return result;
		},

		unExecute: function ()
		{
			//
		}
	}
);