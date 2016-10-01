/**
 * Инициализация приложения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

/*
Статические переменные и функции приложения.

{String} Версия
FBEditor.version

{Boolean} Доступен ли хаб
FBEditor.accessHub

{Window} Родительское окно
FBEditor.parentWindow

{Object} Дочерние окна
FBEditor.childWindow

{Boolean} Флаг закрытия окна, чтобы избежать зацикливания
FBEditor.closingWindow

{Function} Мост для передачи событий в основное приложение
FBEditor.getBridgeWindow()

{Function} Мост для передачи событий в приложение панели свойств
FBEditor.getBridgeProps()

{Function} Мост для передачи событий в приложение панели навигации
FBEditor.getBridgeNavigation()

{Function} Возвращает хранилище localStorage для приложения
FBEditor.getLocalStorage()

{Function} Возвращает активный менеджер редактора текста
FBEditor.getEditorManager()

{Function} Устанавливает активный менеджер редактора текста
FBEditor.setEditorManager(manager)

*/

Ext.define(
	'FBEditor.Application',
	{
	    extend: 'Ext.app.Application',
	    name: 'FBEditor',
		requires: [
			'FBEditor.command.HistoryCommand',
			'FBEditor.file.Manager',
			'FBEditor.resource.Manager',
			'FBEditor.route.Manager',
			'FBEditor.scroll.Scroll',
			'FBEditor.util.xml.Jsxml',
			'FBEditor.util.Format',
			'FBEditor.webworker.Manager',
			'FBEditor.xsd.Desc'
		],
	    stores: [],

		init: function ()
		{
			console.log('Ext.supports', Ext.supports);

			// версия
			FBEditor.version = Ext.manifest.loader ? Ext.manifest.loader.cache : 'developer';
			FBEditor.versionParam = Ext.manifest.loader ?
			                        Ext.manifest.loader.cacheParam + '=' + FBEditor.version : 'developer';
		},

	    launch: function ()
	    {
		    // удаляем информационную заставку
		    document.querySelector('.app-loading').parentNode.removeChild(document.querySelector('.app-loading'));
	    }
	}
);

(function renderingInfo ()
{
	// меняем сообщение о загрузки
	document.querySelector('.app-loading-info').firstChild.nodeValue = 'Рендеринг';
	//document.querySelector('.app-loader').style.visibility = 'hidden';
	//eval("Ext = null;");
}());