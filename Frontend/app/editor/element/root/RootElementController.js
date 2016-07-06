/**
 * Кнотроллер корневого элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.root.RootElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.TextModifiedCommand'
		],

		/**
		 * Редактирование текстового узла.
		 * @param {Object} e Событие.
		 * @param {Node} e.target Редактируемый узел.
		 */
		onTextModified: function (e)
		{
			var me = this,
				target = e.target,
				parentNode,
				manager,
				cmd;

			manager = me.getElement().getManager();

			if (manager.isSuspendEvent())
			{
				return;
			}

			parentNode = target.parentNode;

			if (!parentNode.getElement)
			{
				Ext.defer(
					function ()
					{
						this.onTextModified({target: target});
					},
					1,
					me
				);

				return;
			}

			//console.log('DOMCharacterDataModified:', e, me);

			cmd = Ext.create('FBEditor.editor.command.TextModifiedCommand',
				{node: target, newValue: e.newValue, oldValue: e.prevValue});

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
		},

		onMouseDown: function (e)
		{
			var me = this,
				nodes = {},
				els = {},
				manager,
				helper,
				viewportId;

			nodes.target = e.target;
			els.target = nodes.target.getElement ? nodes.target.getElement() : null;

			if (els.target.isRoot)
			{
				// при клике по пустому корневому элементу ставим курсор в конец строки самого последнего абзаца

				manager = els.target.getManager();
				viewportId = nodes.target.viewportId;

				els.last = els.target.getDeepLast();
				helper = els.last.getNodeHelper();
				nodes.last = helper.getNode(viewportId);
				els.offset = els.last.isText ? els.last.text.length  : 0;

				manager.setCursor(
					{
						startNode: nodes.last,
						startOffset: els.offset
					}
				);

				e.preventDefault();
			}
		},

		onFocus: function (e)
		{
			var me = this,
				els = {},
				nodes = {},
				relatedTarget = e.relatedTarget,
				manager,
				helper,
				viewportId;

			els.root = me.getElement();
			manager = els.root.getManager();

			if (relatedTarget &&
			    (!relatedTarget.getElement || !relatedTarget.getElement().getRoot().equal(els.root)))
			{
				// ставим курсор в начало документа если фокус пришел с другого компонента

				me.enableAllEditable();

				els.deepFirst = els.root.getDeepFirst();
				helper = els.deepFirst.getNodeHelper();
				viewportId = e.target.viewportId;
				nodes.deepFirst = helper.getNode(viewportId);

				manager.setCursor(
					{
						startNode: nodes.deepFirst
					}
				);

				// прокручиваем скролл в начало документа
				helper = els.root.getNodeHelper();
				nodes.root = helper.getNode(viewportId);
				nodes.root.scrollTop = 0;
			}
		}
	}
);