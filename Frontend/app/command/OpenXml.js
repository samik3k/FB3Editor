/**
 * Открывает xml книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.command.OpenXml',
    {
        extend: 'FBEditor.command.AbstractCommand',

        /**
         * @private
         * @property {Ext.panel.Panel} Активная панель контента.
         */
        activePanelContent: null,

        /**
         * @private
         * @property {Ext.panel.Panel} Активная панель свойств.
         */
        activePanelProps: null,

        execute: function ()
        {
            var me = this,
                data = me.getData(),
                bridgeWindow = me.getBridgeWindow(),
                bridgeProps = FBEditor.getBridgeProps(),
                editorManager = FBEditor.getEditorManager(true),
                descManager = bridgeWindow.FBEditor.desc.Manager,
                result = true,
                content,
                props;

            content = bridgeWindow.Ext.getCmp('panel-main-content');
            me.activePanelContent = content.getLayout().getActiveItem();

            if (descManager.isLoadUrl() && !editorManager.isLoadUrl())
            {
                // если тело еще не было загружено по url, то загружаем
                editorManager.loadFromUrl();
            }
            else
            {
                content.fireEvent('contentXml');
            }

            props = bridgeProps.Ext && bridgeProps.Ext.getCmp ? bridgeProps.Ext.getCmp('panel-main-props-card') : null;

            if (props)
            {
                me.activePanelProps = props.getLayout().getActiveItem();
                props.fireEvent('activePanelXml');
            }

            return result;
        },

        unExecute: function ()
        {
            var me = this,
                data = me.getData(),
                activePanelContent = me.activePanelContent,
                activePanelProps = me.activePanelProps,
                bridgeWindow = me.getBridgeWindow(),
                bridgeProps = FBEditor.getBridgeProps(),
                content,
                props;

            content = bridgeWindow.Ext.getCmp('panel-main-content');
            content.setActiveItem(activePanelContent);
            props = bridgeProps.Ext.getCmp('panel-main-props-card');
            props.setActiveItem(activePanelProps);
        }
    }
);