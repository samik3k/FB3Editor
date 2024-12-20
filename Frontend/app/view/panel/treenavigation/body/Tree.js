/**
 * Дерево навигации по тексту.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.Tree',
	{
		extend: 'FBEditor.view.panel.treenavigation.AbstractTree',
		requires: [
            'FBEditor.command.OpenBody',
			'FBEditor.view.panel.treenavigation.body.TreeController',
			'FBEditor.view.panel.treenavigation.body.TreeStore',
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.Section'
		],

		id: 'panel-body-navigation',
		xtype: 'panel-body-navigation',
		controller: 'panel.body.navigation',

		stateId: 'panel-body-navigation',
		stateful: true,
		useArrows: true,
		animate: false,

		selModel: {
			// предотвращаем перенос фокуса
			preventFocus: true
		},

		syncContentId: 'main-editor',
        cmdName: 'FBEditor.command.OpenBody',
		
		translateText: {
			loadText: 'Загрузить текст'
		},

		initComponent: function ()
		{
			var me = this;

			me.store = Ext.create('FBEditor.view.panel.treenavigation.body.TreeStore');
			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				tt = me.translateText,
				bridgeWindow = FBEditor.getBridgeWindow(),
				descManager = bridgeWindow.FBEditor.desc.Manager,
				manager = FBEditor.getEditorManager(),
				rootData,
				data;

			data = manager.getContent();

			if (data)
			{
				if (descManager.isLoadUrl() && !manager.isLoadUrl())
				{
					// необходимо загрузить текст
					
					rootData = me.store.getRoot().data;
					
					me.store.loadData(
						[
							{
								root: true,
								text: tt.loadText,
								expandable: rootData.expandable,
								icon: rootData.icon,
								cls: rootData.cls,
								iconCls: rootData.iconCls
							}
						]
					);
				}
				else
				{
					// дерево навигации по тексту
					me.loadData(data);
				}
			}

			me.callParent(arguments);
		},

		destroy: function ()
		{
			var me = this;

			// сохраняем состояние открытых узлов дерева перед уничтожением панели
			me.saveStateNodes();

			me.callParent(arguments);
		},
		
		/**
		 * Создает контекстное меню для элемента.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @param {Object} evt Объект события itemcontextmenu.
		 */
		createContextMenu: function (el, evt)
		{
			var me = this,
				data;
			
			// данные контекстного меню
			data = {
				x: evt.pageX,
				y: evt.pageY,
				element: el
			};
			
			if (el.isSection)
			{
				// контекстное меню секции
				Ext.create('FBEditor.view.panel.treenavigation.body.contextmenu.section.Section', data);
			}
			else
			{
				// общее контекстное меню
				Ext.create('FBEditor.view.panel.treenavigation.body.contextmenu.ContextMenu', data);
			}
		},

		/**
		 * Загружает в дерево ресурсы.
		 * @param {FBEditor.editor.element.AbstractElement} data Корневой элемент тела книги.
		 */
		loadData: function (data)
		{
			var me = this,
				treeData;

			me.saveStateNodes();
			treeData = me.getTreeData(data);
			me.store.loadData(treeData);
			me.getView().expand(me.store.first());
		},

		/**
		 * Возвращает струткуру дерева текста.
		 * @param {FBEditor.editor.element.AbstractElement} root Корневой элемент тела книги.
		 * @return {Array} Структура дерева.
		 */
		getTreeData: function (root)
		{
			var me = this,
				rootData = me.store.getRoot().data,
				treeData,
				rootTreeData;

			treeData = me.getTreeChildren(root);
			//console.log('treeData', treeData);

			rootTreeData = [
				{
					root: true,
					text: rootData.text,
					expandable: rootData.expandable,
					icon: rootData.icon,
					cls: rootData.cls,
					iconCls: rootData.iconCls,
					children: treeData.children,
					elementId: root.elementId
				}
			];

			return rootTreeData;
		},

		/**
		 * Рекурсивная функция, возвращающая данные всех потомков для дерева.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент текста.
		 * @param {String} parentPath Путь родителя элемента в дереве навигации.
		 * @return {Array} Структура дерева потомков элемента.
		 */
		getTreeChildren: function (el, parentPath)
		{
			var me = this,
				val = null,
				manager = FBEditor.getEditorManager();


			if (el.showedOnTree)
			{
				if (el.children)
				{
					// сохраняем полный путь элемента в дереве навигации
					parentPath = parentPath || '';
					el.treePath = parentPath + '/' + el.elementId;
					//console.log('tree', el.treePath);
				}

				val = {};
				val.text = el.getNameTree();
				val.elementId = el.elementId;
				val.expanded = manager.stateExpandedNodesTree[el.elementId] ? true : false;
				val.icon = ' ';
				val.cls = 'treenavigation-children treenavigation-children-body';
				val.cls += el.cls ? ' treenavigation-children-' + el.cls : '';

				Ext.Array.each(
					el.children,
					function (item)
					{
						var child;

						if (item.showedOnTree)
						{
							// отображаем элемент в дереве
							child = me.getTreeChildren(item, el.treePath);

							if (child)
							{
								val.children = val.children || [];
								val.children.push(child);
							}
						}
						else
						{
							// проверяем следующих вложенных потомков для отображения в дереве
							Ext.Array.each(
								item.children,
								function (itemChild)
								{
									child = me.getTreeChildren(itemChild, el.treePath);

									if (child)
									{
										val.children = val.children || [];
										val.children.push(child);
									}
								}
							);
						}
					}
				);

				val.leaf = !val.children;
			}

			return val;
		},

		/**
		 * Сохраняет id открытых узлов, чтобы восстановить их при следующем обновлении данных дерева.
		 * @param {Array} [data] Дочерние узлы. Если не указаны, то по умолчанию беруться дочерние узлы корневого узла.
		 */
		saveStateNodes: function (data)
		{
			var me = this,
				manager = FBEditor.getEditorManager();

			data = data || me.store.getData().items[0].data.children;

			Ext.Array.each(
				data,
				function (item)
				{
					if (item.expanded)
					{
						// сохраняем id открытого узла
						manager.stateExpandedNodesTree[item.elementId] = true;
					}
					else if (manager.stateExpandedNodesTree[item.elementId])
					{
						// удаляем id закрытого узла
						delete manager.stateExpandedNodesTree[item.elementId];
					}

					if (item.children && item.children.length)
					{
						me.saveStateNodes(item.children);
					}
				}
			);
		},

		/**
		 * Разворачивает ветку элемента в дереве навигации.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 */
		expandElement: function (el)
		{
			var me = this;

			if (Ext.isEmpty(el.treePath) && el.parent)
			{
				me.expandElement(el.parent);

				return;
			}

			//console.log('expandElement', el.treePath, el);
			me.selectPath(el.treePath, 'elementId');
		},

		/**
		 * Устанавливает фокус на корневом узле дерева навигации по тексту.
		 */
		selectRoot: function ()
		{
			var me = this,
				root = me.getRootNode(),
				path;

			path = '/' + root.id;
			//console.log(path);
			me.selectPath(path);
		},

		/**
		 * Переписывает стандартный метод, возвращающий корневой узел (необходимо для метода #selectPath).
		 * @return {Ext.data.TreeModel} Корневой узел.
		 */
		getRootNode: function ()
		{
			var me = this,
				store= me.store,
				root;

			root = store && store.first() ? store.first() : me.callParent();

			return root;
		}
	}
);