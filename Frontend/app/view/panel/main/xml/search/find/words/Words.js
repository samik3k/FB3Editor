/**
 * Чекбокс установки поиска слов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.find.words.Words',
	{
		extend: 'Ext.form.field.Checkbox',
		requires: [
			'FBEditor.view.panel.main.xml.search.find.words.WordsController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
		},
		
		xtype: 'panel-xml-search-find-words',
		controller: 'panel.xml.search.find.words',
		
		cls: 'panel-xml-search-words',

		listeners: {
			change: 'onChange'
		},
		
		translateText: {
			words: 'Слова'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.boxLabel = tt.words;
			
			me.callParent(arguments);
		},
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);