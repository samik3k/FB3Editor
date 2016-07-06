/**
 * Кнопка вставки блока poem.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.poem.Poem',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.poem.PoemController'
		],
		id: 'main-editor-button-poem',
		xtype: 'main-editor-button-poem',
		controller: 'main.editor.button.poem',
		html: '<i class="fa fa-pinterest fa-lg"></i>',
		tooltip: 'Поэма',
		elementName: 'poem'
	}
);