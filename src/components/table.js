import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает роллбек при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  //Выводим дополнительные шаблоны до и после таблицы
  before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });
  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  //Обрабатываем события и вызова onAction()
  root.container.addEventListener("change", () => onAction());
  root.container.addEventListener("reset", () => setTimeout(onAction));
  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    //Роеобразовываем данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container;
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
