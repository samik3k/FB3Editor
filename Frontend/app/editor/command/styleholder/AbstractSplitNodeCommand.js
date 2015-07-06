/**
 * Разбивает элемент на два.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.styleholder.AbstractSplitNodeCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		elementName: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				pos = {},
				sel = window.getSelection(),
				range,
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory;

			try
			{
				manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанвливаем выделение
					manager.setCursor(data.saveRange);
				}

				// получаем данные из выделения
				range = sel.getRangeAt(0);

				if (!range.collapsed)
				{
					throw Error('Выделение недопустимо');
				}

				nodes.node = range.commonAncestorContainer;
				els.node = nodes.node.getElement();

				data.viewportId = nodes.node.viewportId;

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					parentStart: range.commonAncestorContainer.parentNode,
					collapsed: range.collapsed,
					offset: {
						start: range.startOffset,
						end: range.endOffset
					}
				};

				console.log('split ' + me.elementName, data.range);

				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();

				// ищем самый верхний контейнер
				while (!els.p.hisName(me.elementName))
				{
					nodes.node = nodes.p;
					els.node = nodes.node.getElement();
					nodes.p = nodes.p.parentNode;
					els.p = nodes.p.getElement();
				}

				nodes.parentP = nodes.p.parentNode;
				els.parentP = nodes.parentP.getElement();

				nodes.nextP = nodes.p.nextSibling;

				// новый элемент
				els.newP = factory.createElement(me.elementName);
				nodes.newP = els.newP.getNode(data.viewportId);
				if (nodes.nextP)
				{
					els.nextP = nodes.nextP.getElement();
					els.parentP.insertBefore(els.newP, els.nextP);
					nodes.parentP.insertBefore(nodes.newP, nodes.nextP);
				}
				else
				{
					els.parentP.add(els.newP);
					nodes.parentP.appendChild(nodes.newP);
				}

				pos.isEnd = data.range.end.nodeValue && data.range.offset.end === data.range.end.nodeValue.length ?
				            manager.isLastNode(nodes.p, data.range.end) : false;
				pos.isStart = data.range.offset.start === 0 ?
				              manager.isFirstNode(nodes.p, data.range.start) : false;

				data.range.pos = pos;
				//console.log('pos', pos, range.toString());

				if (!pos.isStart && !pos.isEnd)
				{
					// делим узел
					nodes.common = nodes.p;
					els.common = els.p;
					nodes.container = data.range.start;
					nodes.start = manager.splitNode(els, nodes, data.range.offset.start);
					els.common.removeEmptyText();
					els.start = nodes.start.getElement();
					nodes.prev = nodes.start.previousSibling;
					els.prev = nodes.prev ? nodes.prev.getElement() : null;
					if (els.prev && els.prev.isEmpty())
					{
						// удаляем пустой начальный элемент
						els.p.remove(els.prev);
						nodes.p.removeChild(nodes.prev);
					}
					if (els.start.isEmpty())
					{
						// удаляем пустой конечный элемент
						els.p.remove(els.start);
						nodes.p.removeChild(nodes.start);
						nodes.start = null;
					}
				}
				else if (data.range.offset.start === 0)
				{
					nodes.start = nodes.node;
				}
				else
				{
					nodes.start = nodes.node.nextSibling;
				}

				nodes.next = nodes.start;

				//console.log('nodes', nodes); return false;

				if (els.p.isEmpty())
				{
					// удаляем пустой элемент из исходного
					nodes.empty = nodes.p.firstChild;
					els.empty = nodes.empty.getElement();
					els.p.remove(els.empty);
					nodes.p.removeChild(nodes.empty);
					nodes.next = null;
				}

				// переносим все элементы из старого в новый
				while (nodes.next)
				{
					nodes.buf = nodes.next.nextSibling;
					els.next = nodes.next.getElement();
					els.newP.add(els.next);
					nodes.newP.appendChild(nodes.next);
					nodes.next = nodes.buf;
				}

				if (els.p.isEmpty())
				{
					// вставляем пустой элемент в исходный
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(data.viewportId);

					els.p.add(els.empty);
					nodes.p.appendChild(nodes.empty);
					nodes.node = nodes.empty;
				}

				if (els.newP.isEmpty())
				{
					// вставляем пустой элемент в новый
					els.empty = manager.createEmptyElement();
					nodes.empty = els.empty.getNode(data.viewportId);

					els.newP.add(els.empty);
					nodes.newP.appendChild(nodes.empty);
				}

				//console.log('nodes, els', nodes, els);

				els.parentP.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.newP.firstChild,
					startOffset: 0,
					focusElement: els.newP
				};
				manager.setCursor(data.saveRange);

				// сохраняем ссылки
				me.data.nodes = nodes;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.removeNext();
			}

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				range,
				manager = FBEditor.editor.Manager;

			try
			{
				manager.suspendEvent = true;

				// исходные данные
				nodes = data.nodes;
				range = data.range;

				console.log('undo split ' + me.elementName, nodes, data);

				els.p = nodes.p.getElement();
				els.node = nodes.node.getElement();
				els.newP = nodes.newP.getElement();
				els.parentP = nodes.parentP.getElement();
				els.prev = nodes.prev ? nodes.prev.getElement() : null;
				els.start = nodes.start ? nodes.start.getElement() : null;

				// курсор
				nodes.cursor = range.start;// nodes.node;

				if (els.p.isEmpty() && els.newP.isEmpty())
				{
					nodes.cursor = nodes.node;
				}
				else
				{
					// восстанавливаем исходный текст
					if (els.p.isEmpty())
					{
						// удаляем пустой элемент из старого
						els.p.remove(els.node);
						nodes.p.removeChild(nodes.node);
					}

					if (!els.newP.isEmpty())
					{
						// переносим все элементы из нового в старый
						nodes.first = nodes.newP.firstChild;
						while (nodes.first)
						{
							els.first = nodes.first.getElement();
							els.p.add(els.first);
							nodes.p.appendChild(nodes.first);
							nodes.first = nodes.newP.firstChild;
						}

						// курсор
						nodes.cursor = nodes.cursor.parentNode ? nodes.cursor : nodes.p.firstChild;
					}

					if (els.prev && els.prev.hisName(els.start.xmlTag))
					{
						// объединяем узлы
						manager.joinNode(nodes.start);
						//range.start = node.prev;
						els.parentP.removeEmptyText();
					}
				}

				// удаляем новый элемент
				els.parentP.remove(els.newP);
				nodes.parentP.removeChild(nodes.newP);

				els.parentP.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: range.offset.start,
					focusElement: els.p
				};
				manager.setCursor(data.saveRange);

				data.nodes = nodes;

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
		}
	}
);