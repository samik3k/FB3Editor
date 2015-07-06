/**
 * Абстрактный класс формы редактирования свойств элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.AbstractEditor',
	{
		extend: 'Ext.form.Panel',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.AbstractEditorController'
		],
		controller: 'panel.props.body.editor',
		layout: 'anchor',
		width: '100%',
		listeners: {
			change: 'onChange'
		},

		/**
		 * @property {String} Имя элемента.
		 */
		elementName: null,

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Ссылка на элемент.
		 */
		element: null,

		/**
		 * @property {Boolean} isLoad Первичная ли загрузка данных, после рендеринга формы.
		 * Если заргузка первичная, то нет необходимости реагировать на событие change полей формы.
		 */
		isLoad: false,

		constructor: function (data)
		{
			var me = this;

			me.elementName = data.elementName;
			me.callParent(arguments);
		},

		/**
		 * Обновляет данные.
		 * @param {Object} data Данные.
		 * @param {Boolean} isLoad Первичная ли загрузка данных, после рендеринга формы.
		 * Если заргузка первичная, то нет необходимости реагировать на событие change полей формы.
		 */
		updateData: function (data, isLoad)
		{
			var me = this;

			me.isLoad = isLoad;
			me.element = data.el ? data.el : me.element;
		}
	}
);