/**
 * Панель навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.navigation.Navigation',
    {
        extend: 'FBEditor.view.panel.main.AbstractDetach',
	    requires: [
		    'FBEditor.view.panel.main.navigation.NavigationController',
		    'FBEditor.view.panel.main.navigation.NavigationModel'
	    ],
	    id: 'panel-main-navigation',
	    xtype: 'panel-main-navigation',
	    controller: 'panel.main.navigation',
	    viewModel: {
		    type: 'panel.main.navigation'
	    },
	    panelName: 'navigation',
        title: 'Навигация',
        html: 'Содержимое левой панели'
    }
);