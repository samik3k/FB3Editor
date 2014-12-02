/**
 * Конвертер данных описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.converter.desc.Data',
	{
		extend: 'FBEditor.converter.AbstractConverter',
		singleton: true,

		toForm: function (data)
		{
			var me = this,
				d;

			d = me.normalize(data);
			d = me.convertPeriodical(d);
			d = me.convertTitle(d);
			d = me.convertSequence(d);
			d = me.convertRelations(d);
			d = me.convertClassification(d);
			d = me.convertWritten(d);
			d = me.convertDocumentInfo(d);
			d = me.convertPublishInfo(d);
			d = me.convertCustomInfo(d);

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля periodical.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertPeriodical: function (data)
		{
			var d = data;

			if (d.periodical)
			{
				d['periodical-id'] = d.periodical.id;
				d['periodical-number'] = d.periodical.number.number;
				d['periodical-year'] = d.periodical.number.year;
				d['periodical-date'] = d.periodical.number.date ? d.periodical.number.date : '';
				d['periodical-text'] = d.periodical.number.text ? d.periodical.number.text : '';
				d['periodical-issn'] = d.periodical.issn ? d.periodical.issn : '';
				if (d.periodical.title)
				{
					d['periodical-title-main'] = d.periodical.title.main;
					d['periodical-title-sub'] = d.periodical.title.sub ? d.periodical.title.sub : '';
					d['periodical-title-alt'] = d.periodical.title.alt ? d.periodical.title.alt : '';
				}
				delete d.periodical;
			}

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля title.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertTitle: function (data)
		{
			var d = data;

			d['title-main'] = d.title.main;
			d['title-sub'] = d.title.sub ? d.title.sub : '';
			d['title-alt'] = d.title.alt ? d.title.alt : '';
			delete d.title;

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля sequence.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertSequence: function (data)
		{
			var me = this,
				d = data;

			d.sequence = me._convertPropertyName(d.sequence, 'sequence');

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля relations.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertRelations: function (data)
		{
			var me = this,
				d = data;

			d.relations = {
				'relations-subject': d['fb3-relations'].subject,
				'relations-object': d['fb3-relations'].object ? d['fb3-relations'].object : ''
			};
			d.relations['relations-subject'] = me._convertPropertyName(d.relations['relations-subject'],
			                                                           'relations-subject');
			d.relations['relations-object'] = me._convertPropertyName(d.relations['relations-object'],
			                                                           'relations-object');
			delete d['fb3-relations'];

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля classification.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertClassification: function (data)
		{
			var d = data;

			d['classification-class-contents'] = d['fb3-classification'].class.contents;
			d['classification-class-text'] = d['fb3-classification'].class.text;
			d['classification-subject'] = {};
			Ext.Object.each(
				d['fb3-classification'].subject,
			    function (index, value)
			    {
				    d['classification-subject'][index] = {
					    'classification-subject': value
				    };
			    }
			);
			d['classification-custom-subject'] = d['fb3-classification']['custom-subject'] ?
			                                     d['fb3-classification']['custom-subject'] : '';
			d['classification-udk'] = d['fb3-classification'].udk ? d['fb3-classification'].udk : '';
			d['classification-bbk'] = d['fb3-classification'].bbk ? d['fb3-classification'].bbk : '';
			if (d['fb3-classification']['target-audience'])
			{
				d['classification-target-audience-text'] = d['fb3-classification']['target-audience'].text ?
				                                           d['fb3-classification']['target-audience'].text : '';
				d['classification-target-audience-education'] =
					d['fb3-classification']['target-audience'].education ?
					d['fb3-classification']['target-audience'].education : '';
				d['classification-target-audience-age-min'] =
					d['fb3-classification']['target-audience']['age-min'] ?
					d['fb3-classification']['target-audience']['age-min'] : '';
				d['classification-target-audience-age-max'] =
					d['fb3-classification']['target-audience']['age-max'] ?
					d['fb3-classification']['target-audience']['age-max'] : '';
			}
			if (d['fb3-classification'].coverage)
			{
				d['classification-coverage-text'] = d['fb3-classification'].coverage.text ?
				                                    d['fb3-classification'].coverage.text : '';
				d['classification-coverage-country'] = d['fb3-classification'].coverage.country ?
				                                       d['fb3-classification'].coverage.country : '';
				d['classification-coverage-place'] = d['fb3-classification'].coverage.place ?
				                                     d['fb3-classification'].coverage.place : '';
				d['classification-coverage-date'] = d['fb3-classification'].coverage.date ?
				                                    d['fb3-classification'].coverage.date : '';
				d['classification-coverage-age'] = d['fb3-classification'].coverage.age ?
				                                   d['fb3-classification'].coverage.age : '';
				d['classification-coverage-date-from'] = d['fb3-classification'].coverage['date-from'] ?
				                                         d['fb3-classification'].coverage['date-from'] : '';
				d['classification-coverage-date-to'] = d['fb3-classification'].coverage['date-to'] ?
				                                       d['fb3-classification'].coverage['date-to'] : '';
			}
			delete d['fb3-classification'];

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля written.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertWritten: function (data)
		{
			var d = data;

			if (d.written)
			{
				d['written-lang'] = d.written.lang;
				if (d.written.date)
				{
					d['written-date-value'] = d.written.date.value ? d.written.date.value : '';
					d['written-date-text'] = d.written.date.text ? d.written.date.text : '';
				}
				d['written-country'] = d.written.country ? d.written.country : '';
				delete d.written;
			}

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля document-info.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertDocumentInfo: function (data)
		{
			var d = data;

			d['document-info-created'] = d['document-info'].created;
			d['document-info-updated'] = d['document-info'].updated;
			d['document-info-program-used'] = d['document-info']['program-used'] ?
			                                  d['document-info']['program-used'] : '';
			d['document-info-src-url'] = d['document-info']['src-url'] ?
			                                  d['document-info']['src-url'] : '';
			d['document-info-ocr'] = d['document-info'].ocr ? d['document-info'].ocr : '';
			d['document-info-editor'] = d['document-info'].editor ? d['document-info'].editor : '';
			delete d['document-info'];

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля publish-info.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertPublishInfo: function (data)
		{
			var me = this,
				d = data;

			d['publish-info'] = me._convertPropertyName(d['publish-info'], 'publish-info');

			return d;
		},

		/**
		 * @private
		 * Пребразует данные для поля custom-info.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Преобразованные данные.
		 */
		convertCustomInfo: function (data)
		{
			var me = this,
				d = data;

			d['custom-info'] = me._convertPropertyName(d['custom-info'], 'custom-info');

			return d;
		},

		/**
		 * @private
		 * Преобразует названия свойств в объекте данных.
		 * @param {Object} data Объект данных.
		 * @param {String} propertyName Название объекта данных.
		 * @return {Object} Преобразованный объект данных.
		 */
		_convertPropertyName: function (data, propertyName)
		{
			var d = data,
				name = propertyName;

			d = d ? d : '';
			d = d['0'] ? d : {'0': d};
			Ext.Object.each(
				d,
				function (index, item)
				{
					Ext.Object.each(
						item,
						function (key, val)
						{
							if (Ext.isObject(val) && !val['0'])
							{
								Ext.Object.each(
									val,
									function (k, v)
									{
										d[index][name + '-' + key + '-' + k] = v;
									}
								);
							}
							else
							{
								d[index][name + '-' + key] = val;
							}
							delete d[index][key];
						}
					);
				}
			);

			return d;
		}
	}
);