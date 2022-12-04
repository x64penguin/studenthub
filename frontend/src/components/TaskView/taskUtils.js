import {v4 as uuid} from "uuid";

export function generateTask(rawText, elements) {
    let task = [];
    let cursorPosition = rawText.indexOf("$[");

    task.push(rawText.slice(0, cursorPosition === -1 ? undefined : cursorPosition));

    while (cursorPosition !== -1) {
        const endPosition = rawText.indexOf("]", cursorPosition);
        if (endPosition === -1) {
            return ["Что-то пошло не так: не закрыто \"$[\""];
        }
        const elementId = rawText.slice(cursorPosition, endPosition);
        const element = elements[elementId];

        if (element === undefined) {
            task.push("Элемент с id " + elementId + " не найден, удалите его и создайте заного");
        } else {
            task.push(element);
        }

        cursorPosition = rawText.indexOf("$[", cursorPosition);

        task.push(rawText.slice(endPosition, cursorPosition === -1 ? undefined : cursorPosition))
    }

    return task;
}

export function createBaseQuestion(type) {
    switch (type) {
        case "Ввод":
            return {
                qtype: "input",
                name: uuid(),
                type: "str",
                right: ""
            }
        case "Внутристрочный ввод":
            return {
                qtype: "inline input",
                name: uuid(),
                type: "str",
                right: ""
            }
    }
}