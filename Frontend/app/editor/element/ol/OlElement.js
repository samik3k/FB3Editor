/**
 * Элемент ol.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.ol.OlElement',
	{
		extend: 'FBEditor.editor.element.AbstractLiHolderElement',
		requires: [
			'FBEditor.editor.command.ol.CreateCommand',
			'FBEditor.editor.command.ol.DeleteWrapperCommand',
			'FBEditor.editor.element.ol.OlElementController'
		],
		controllerClass: 'FBEditor.editor.element.ol.OlElementController',
		htmlTag: 'ol',
		xmlTag: 'ol',
		cls: 'el-ol'
	}
);