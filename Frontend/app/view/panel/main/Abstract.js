/**
 * Абстрактный класс основной панели.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.Abstract',
    {
        extend: 'Ext.panel.Panel',
	    /*header: {
		    padding: 5
	    },*/
	    split: {
		    size: 2,
		    collapsible: false
	    },
	    bodyPadding: 5,
	    stateful: true,

	    /**
	     * @property {String} Имя панели.
	     */
	    panelName: null
    }
);