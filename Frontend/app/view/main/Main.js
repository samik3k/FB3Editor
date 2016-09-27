/**
 * Главный контейнер приложения.
 * Подключается в app.js через свойство "autoCreateViewport".
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.main.Main',
	{
	    extend: 'Ext.container.Container',
		layout: 'center',

		afterRender: function ()
		{
			var me = this,
				btn;

			btn = Ext.Widget(
				{
					xtype: 'button',
					text: 'Тест версии ' + FBEditor.version,
					handler: function ()
					{
						console.log('handler');
						alert('handler');
					},
					listeners: {
						click: function ()
						{
							console.log('listeners click');
						},
						afterrender: function ()
						{
							var view = this;

							view.getEl().dom.addEventListener(
								'click',
								function ()
								{
									console.log('-----------------------');
									console.log('addEventListener click');
								}
							);

							console.log('-----------------------');

							view.on(
								{
									click: function ()
									{
										console.log('on click object');
									}
								}
							);

							view.on(
								'click',
								function ()
								{
									console.log('on click string');
								}
							);
						}
					}
				}
			);

			me.add(btn);

			me.callParent(arguments);
		},

		/**
		 * Создает панель в отдельном окне.
		 * @param {String} name Имя панели.
		 */
		createPanel: function (name)
		{
			var me = this,
				xtype,
				panel;

			xtype = 'panel-main-' + name;
			panel = me.add(
				{
					xtype: xtype,
					region: 'center'
				}
			);
			document.title = document.title + ' - ' + panel.title;
		},

		/**
		 * Присоеденияет отсоединенную панель обратно.
		 * @param {String} name Имя панели.
		 * @param {Window} [win] Окно отсоединенной панели.
		 */
		attachPanel: function (name, win)
		{
			var me = this,
				id;

			id = 'panel-main-' + name;
			if (!me.contains(Ext.getCmp(id)))
			{
				FBEditor.childWindow[name] = null;
				me.add(me.panelConfig[name]);
				me.windowPanels[name] = null;
			}
		},

		/**
		 * Убирает отсоединенную панель из  главного окна.
		 * @param {Window} win Ссылка на окно с отсоединенной панелью.
		 */
		removeDetachedPanel: function (win)
		{
			var me = this,
				name,
				id;

			name = win.name;
			me.windowPanels[name] = win;
			id = 'panel-main-' + name;
			if (me.contains(Ext.getCmp(id)))
			{
				Ext.getCmp(id).close();
			}
		}
	}
);
