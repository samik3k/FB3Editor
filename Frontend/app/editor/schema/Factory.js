/**
 * Фабрика для схемы текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.schema.Factory',
	{
		singleton: 'true',

		/**
		 * @property {Array} Список определенных типов.
		 */
		definedTypes: [],

		/**
		 * @private
		 * @property {Object} Список отложенных типов для определения.
		 */
		_deferredTypes: {},

		/**
		 * Создает новый элемент.
		 * @param {String} name Название элемента.
		 * @param {Object} [options] Опции элемента.
		 * @return {Object} Элемент схемы.
		 */
		createElement: function (name, options)
		{
			var me = this,
				n = name,
				opts = options,
				schemaName = opts.schemaName.replace(/:/g, '.'),
				nameEl,
				el,
				cls;

			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно создать элемент схемы текста. Передано пустое назавние элемента.');
			}
			try
			{
				n = n.replace(/-([a-z])/g, '$1');
				n = Ext.String.capitalize(n);
				nameEl = 'FBEditor.editor.schema.' + schemaName + '.' + n + 'Element';

				if (!opts.extend)
				{
					delete opts.extend;
				}
				else
				{
					opts.extend = 'FBEditor.editor.schema.' + schemaName + '.extend.' + opts.extend.substring(5);
				}

				//console.log(n);

				// класс
				cls = {
					constructor: function ()
					{
						var me = this,
							cls = me.superclass;

						me.sequence = me.sequence || [];

						while (cls)
						{
							if (cls.sequence)
							{
								me.sequence = Ext.Array.merge(cls.sequence, me.sequence);
							}

							if (cls.choice)
							{
								me.choice = me.choice || {};
								me.choice = Ext.applyIf(me.choice, cls.choice);
							}

							if (cls.attributes)
							{
								me.attributes = me.attributes || {};
								me.attributes = Ext.applyIf(me.attributes, cls.attributes);
							}

							cls = cls.superclass;
						}

						Ext.Object.each(
							me.attributes,
						    function (name, item)
						    {
							    var typeCls,
							        type,
							        pattern;

							    if (item.type && /:/.test(item.type))
							    {
								    typeCls = 'FBEditor.editor.schema.' + schemaName + '.extend.' + item.type.substring(5);
								    type = Ext.create(typeCls);
								    
								    // необходимые свойства нужно прописать напрямую,
								    // чтобы при формировнии строкового представляния из json
								    // они корректно преобразовались
								    
								    // исправляем паттерн
								    pattern = type.pattern ? type.pattern.replace(/d\+/g, '\\d+') : null;

								    item.type = {
								    	base: type.base,
									    pattern: pattern,
									    enumeration: type.enumeration
								    };
								    //console.log(name, item);
							    }
						    }
						);
					}
				};

				cls = Ext.apply(opts, cls);

				// определяем и создаем класс элемента
				Ext.define(nameEl, cls);
				el = Ext.create(nameEl);
				//console.log(el);
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: 'Неопределенный элемент схемы текста: ' + nameEl, dump: e});
			}

			return el;
		},

		/**
		 * Определяет новый тип.
		 * @param {String} name Название типа.
		 * @param {Object} [options] Данные типа.
		 */
		defineType: function (name, options)
		{
			var me = this,
				definedTypes = me.definedTypes,
				deferredTypes = me._deferredTypes,
				n = name,
				opts = Ext.clone(options),
				schemaName = opts.schemaName.replace(/:/g, '.'),
				nameType;

			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно определить тип схемы текста. Передано пустое назавние типа.');
			}

			try
			{
				n = n.replace(/-([a-z])/g, '$1');
				nameType = 'FBEditor.editor.schema.' + schemaName + '.extend.' + n;
				//console.log('def', nameType);

				if (opts.extend)
				{
					opts.extend = 'FBEditor.editor.schema.' + schemaName + '.extend.' + opts.extend.substring(5);

					if (!Ext.Array.contains(definedTypes, opts.extend))
					{
						//console.log(opts.extend);
						deferredTypes[nameType] = {name: name, options: options};

						return;
					}
				}

				// определяем класс типа
				Ext.define(nameType, opts);

				// добавляем название типа в список
				definedTypes.push(nameType);
				//console.log(n, opts);

				delete deferredTypes[nameType];
				me._checkDeferredTypes();
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: 'Неопределенный тип схемы текста: ' + nameType, dump: e});
			}
		},

		/**
		 * @private
		 * Проверка опрделения отложенных типов.
		 */
		_checkDeferredTypes: function ()
		{
			var me = this,
				deferredTypes = me._deferredTypes;

			Ext.Object.each(
				deferredTypes,
			    function (key, item)
			    {
				    me.defineType(item.name, item.options);
			    }
			);
		}
	}
);