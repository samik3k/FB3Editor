/**
 * Абстрактный класс элементов содержащих стилевые элементы.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractStyleHolderElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		isStyleHolder: true,
		isStyleType: true,
		showedOnTree: false
	}
);