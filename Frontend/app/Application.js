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
		listen: {
			controller: {
				'#': {
					unmatchedroute : 'onUnmatchedRoute'
				}
			}
		},

		init: function ()
		{

		},

	    launch: function ()
	    {
		    // удаляем информационную заставку
		    document.querySelector('.app-loading').parentNode.removeChild(document.querySelector('.app-loading'));
	    },

		/**
		 * Инициализирует applicationCache.
		 */
		initApplicationCache: function ()
		{
			var cache;

			if (window.applicationCache)
			{
				cache = window.applicationCache;

				// после успешного обновления кэша, делаем swap
				cache.addEventListener(
					'updateready',
					function (e)
					{
						var cache = window.applicationCache;

						cache.swapCache();
						Ext.log('Swap Application Cache');
					},
					false
				);

				// попытка обновления кэша
				//cache.update();
			}
		},

		/**
		 * Отслеживает обращение к несуществующим хэшам роута.
		 * @param {String} hash Хэш.
		 */
		onUnmatchedRoute : function (hash)
		{
			if (FBEditor.parentWindow)
			{
				window.close();
			}
		},

		/**
		 * Выполняет необходимые действия перед закрытием окна.
		 * @param {FBEditor.Application} scope Ссылка на приложение.
		 */
		onbeforeunload: function (scope)
		{
			if (FBEditor.parentWindow && !FBEditor.closingWindow)
			{
				// процесс закрытия отсоединенной панели

				// флаг закрытия окна, чтобы избежать зацикливания
				FBEditor.closingWindow = true;

				if (!FBEditor.parentWindow.FBEditor.closingWindow)
				{
					if (window.name === 'navigation')
					{
						Ext.getCmp('panel-resources-navigation').destroy();
						Ext.getCmp('panel-body-navigation').destroy();
					}

					// присоединяем отсоединенную панель обратно в главное окно редактора
					FBEditor.parentWindow.Ext.getCmp('main').attachPanel(window.name, window);

					// удаляем сохраненное состояние отсоединенной панели
					FBEditor.getLocalStorage().removeItem(window.name);
				}

				// принудительно закрываем окно, даже если оно было обновлено
				window.close();
			}
			else
			{
				// процесс закрытия основного окна редактора

				FBEditor.closingWindow = true;
				Ext.getCmp('main').fireEvent('closeapplication');
			}
		},

		/**
		 * Вызывается при получении фокуса окном.
		 */
		onfocus: function ()
		{
			//фокус на главном окне
			if (!window.name)
			{
				//
			}
		},

		/**
		 * Доступен ли хаб.
		 */
		getAccessHub: function ()
		{
			var manager = FBEditor.webworker.Manager,
				master;

			FBEditor.accessHub = false;

			// владелец потока
			master = manager.factory('httpRequest');

			// запрос на доступ к хабу через поток
			master.post(
				{
					url: 'https://hub.litres.ru/pages/machax_arts/?uuid=1'
				},
				function (response, data)
				{
					//console.log('response, data', response, data);
					if (response)
					{
						FBEditor.accessHub = response.substring(0, 1) === '{' ? true : false;
						Ext.log({msg: 'Хаб доступен', level: 'info'});
						if (FBEditor.accessHub)
						{
							// оповещаем все необходимые компоненты, что хаб доступен
							Ext.getCmp('main').fireEvent('accessHub');
						}
					}

					master.destroy();
					delete master;
				}
			);
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