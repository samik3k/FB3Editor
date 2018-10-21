/**
 * Чекбокс установки регулярного выражения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.xml.search.find.regex.Regex',
	{
		extend: 'Ext.form.field.Checkbox',
		requires: [
			'FBEditor.view.panel.main.xml.search.find.regex.RegexController'
		],
		mixins: {
			cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
		},
		
		xtype: 'panel-xml-search-find-regex',
		controller: 'panel.xml.search.find.regex',
		
		cls: 'panel-xml-search-regex',
		
		listeners: {
			change: 'onChange'
		},
		
		translateText: {
			regex: 'Регулярное выражение'
		},
		
		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;
			
			me.boxLabel = tt.regex;
			
			me.callParent(arguments);
		},
		
		getSearchPanel: function ()
		{
			return this.mixins.cmp.getSearchPanel.call(this);
		}
	}
);