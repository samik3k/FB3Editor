/**
 * Удаляет выделенную часть элементов.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.RemoveNodesCommand',
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
				offset = {},
				pos = {},
				reg = {},
				sel = window.getSelection(),
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				range;

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

				if (range.collapsed)
				{
					throw Error('Отсутствует выделение');
				}

				// TODO проверить перед удалением на допустимость получаемой структуры согласно схеме

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();

				data.viewportId = nodes.common.viewportId;

				offset = {
					start: range.startOffset,
					end: range.endOffset
				};
				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					parentStart: range.commonAncestorContainer.parentNode,
					collapsed: range.collapsed,
					offset: offset
				};

				console.log('remove nodes ', data.range);

				// первый элемент
				nodes.first = range.startContainer;
				els.first = nodes.first.getElement();
				els.commonId = els.common.elementId;
				while (els.first && els.first.parent.elementId !== els.commonId)
				{
					nodes.first = els.isRoot ? nodes.first.firstChild : nodes.first.parentNode;
					els.first = nodes.first ? nodes.first.getElement() : null;
				}

				// последний элемент
				nodes.last = range.endContainer;
				els.last = nodes.last.getElement();
				while (els.last && els.last.parent.elementId !== els.commonId)
				{
					nodes.last = els.isRoot ? nodes.last.lastChild : nodes.last.parentNode;
					els.last = nodes.last ? nodes.last.getElement() : null;
				}

				// регулярные выражения для определения позиции выделения
				reg.start = new RegExp('^' + Ext.String.escapeRegex(range.toString()));
				reg.start2 = new RegExp('^' + Ext.String.escapeRegex(els.first.getText()));
				reg.end = new RegExp(Ext.String.escapeRegex(range.toString()) + '$');
				reg.end2 = new RegExp(Ext.String.escapeRegex(els.last.getText()) + '$');

				// находится ли начальная точка выделения в начале первого элемента
				pos.isStart = reg.start.test(els.first.getText()) || reg.start2.test(range.toString());

				// находится ли конечная точка выделения в конце последнего элемента
				pos.isEnd = reg.end.test(els.last.getText()) || reg.end2.test(range.toString());

				data.range.pos = pos;
				//console.log('pos', pos, range.toString());

				if (!pos.isStart)
				{
					// разбиваем первый элемент
					nodes.container = range.startContainer;
					nodes.start = manager.splitNode(els, nodes, offset.start);
				}
				else
				{
					nodes.start = nodes.first;
				}

				if (!pos.isEnd)
				{
					// разбиваем последний элемент
					nodes.container = range.endContainer;
					nodes.end = manager.splitNode(els, nodes, offset.end);
					nodes.cursor = nodes.end;
					nodes.startCursor = 0;
					nodes.end = nodes.end.previousSibling;
				}
				else
				{
					nodes.end = nodes.last;
					if (nodes.start.previousSibling)
					{
						nodes.cursor = manager.getDeepFirst(nodes.start.previousSibling);
						nodes.startCursor = nodes.cursor.nodeValue ? nodes.cursor.nodeValue.length : 0;
					}
				}

				els.start = nodes.start.getElement();
				els.end = nodes.end.getElement();
				nodes.parent = nodes.common;
				els.parent = els.common;

				//console.log('nodes, els', nodes, els);return false;

				// удаляем элементы

				els.removed = [];
				nodes.removed = [];

				nodes.next = nodes.start;
				els.next = nodes.next.getElement();
				while (els.next && els.next.elementId !== els.end.elementId)
				{
					els.removed.push(els.next);
					nodes.removed.push(nodes.next);

					nodes.buf = nodes.next.nextSibling;
					els.parent.remove(els.next);
					nodes.parent.removeChild(nodes.next);
					nodes.next = nodes.buf;
					els.next = nodes.next ? nodes.next.getElement() : null;
				}
				nodes.nextCursor = nodes.next.nextSibling ? nodes.next.nextSibling : null;
				els.removed.push(els.next);
				nodes.removed.push(nodes.next);
				els.parent.remove(els.next);
				nodes.parent.removeChild(nodes.next);

				nodes.first = nodes.parent.firstChild;

				if (!nodes.first)
				{
					// если в родительском элементе не осталось потомков, то вставляем в него пустой параграф
					els.isEmpty = true;

					// пустой параграф
					els.p = manager.createEmptyP();
					els.new = els.p;

					if (els.parent.isRoot)
					{
						// в корневом элементе должна быть хотя бы одна секция
						els.s = factory.createElement('section');
						els.s.add(els.p);
						els.new = els.s;
					}

					nodes.new = els.new.getNode(data.viewportId);

					els.parent.add(els.new);
					nodes.parent.appendChild(nodes.new);

					nodes.cursor = manager.getDeepFirst(nodes.new);
					nodes.startCursor = 0;
				}

				//console.log('nodes, els', nodes, els);

				// синхронизируем
				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: nodes.startCursor
					}
				);

				// сохраняем узлы
				data.nodes = nodes;
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.parent);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				console.log('nodes', nodes);
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
				manager = FBEditor.editor.Manager,
				range;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				nodes = data.nodes;
				els = data.els;

				console.log('undo remove nodes ', data, nodes);

				if (els.isEmpty)
				{
					// удаляем пустой параграф или секцию
					els.parent.remove(els.new);
					nodes.parent.removeChild(nodes.new);
					nodes.nextCursor = null;
				}

				// восстанавливаем удлаенные элементы
				Ext.Array.each(
					nodes.removed,
					function (node)
					{
						if (nodes.nextCursor)
						{
							els.nextCursor = nodes.nextCursor.getElement();
							els.parent.insertBefore(node.getElement(), els.nextCursor);
							nodes.parent.insertBefore(node, nodes.nextCursor);
						}
						else
						{
							els.parent.add(node.getElement());
							nodes.parent.appendChild(node);
						}
					}
				);

				if (!range.pos.isStart)
				{
					// соединяем первый элемент
					nodes.prev = nodes.removed[0].previousSibling;
					manager.joinNode(nodes.removed[0]);

					// удаляем пустые элементы
					manager.removeEmptyNodes(nodes.prev);
				}

				if (!range.pos.isEnd)
				{
					// соединяем последний элемент
					manager.joinNode(nodes.nextCursor);

					// удаляем пустые элементы
					manager.removeEmptyNodes(nodes.removed[nodes.removed.length - 1]);
				}

				els.parent.sync(data.viewportId);

				manager.suspendEvent = false;

				// устанавливаем курсор
				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end
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