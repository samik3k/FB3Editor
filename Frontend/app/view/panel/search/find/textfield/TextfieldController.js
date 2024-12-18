/**
 * Контроллер поля ввода текста для поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.search.find.textfield.TextfieldController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.search.find.textfield',

        onChange: function (cmp, newVal, oldVal)
        {
            var me = this,
                view = me.getView(),
                searchPanel;

            searchPanel = view.getSearchPanel();
            searchPanel.fireEvent('change');
        },
	
	    onKeydown: function (cmp, e)
        {
	        var me = this,
		        view = me.getView(),
		        searchPanel,
		        replacePanel,
	            editorPanel,
	            manager;

	        searchPanel = view.getSearchPanel();
	        replacePanel = searchPanel.getReplacePanel();
	        editorPanel = searchPanel.getEditorPanel();
	        manager = editorPanel.getManager();
	
	        if (e.getKey() === Ext.event.Event.ESC)
            {
            	// скрываем панель поиска
	            manager.doEsc();
            }
	        else if (e.getKey() === Ext.event.Event.F && e.ctrlKey)
	        {
		        e.preventDefault();

		        // скрываем панель замены
		        replacePanel.hide();
	        }
	        else if (e.getKey() === Ext.event.Event.R && e.ctrlKey)
	        {
		        e.preventDefault();

		        // показываем панель замены
		        manager.doReplace();
	        }
        }
    }
);