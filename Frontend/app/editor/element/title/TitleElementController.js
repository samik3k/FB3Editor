/**
 * Кнотроллер элемента title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.title.TitleElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				els = {},
				nodes = {},
				range;

			// получаем узел из выделения
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);

			nodes.node = range.commonAncestorContainer;
			els.node = nodes.node.getElement();
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			while (els.parent.isStyleHolder || els.parent.isStyleType)
			{
				nodes.node = nodes.parent;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
			}

			return nodes.node;
		}
	}
);