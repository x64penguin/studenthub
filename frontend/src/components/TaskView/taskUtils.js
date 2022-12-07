import {parse, v4 as uuid} from "uuid";

function parseTaskElements(str) {
    const regex = /$[[^]]]/g;
    const matches = str.match(regex);

    if (!matches) {
        return [];
    }

    let parsedValues = [];

    for (let i = 0; i < matches.length; i++) {
        const value = matches[i].slice(2, -1);
        const index = str.indexOf(matches[i]);

        parsedValues.push({ value, index });
    }

    return parsedValues;
}

export function generateTask(rawText, elements) {
    let elementNames = parseTaskElements(rawText);
    let task = [];
    let startIndex = 0;

    for (let i = 0; i < elementNames.length; i++) {
        const name = elementNames[i];
        const substring = rawText.substring(startIndex, name.index);

        task.push(substring);
        task.push(elements[name.value]);

        startIndex = name.index + name.value.length + 3;
    }

    return task;
}

export function createBaseQuestion(type) {
    const id = uuid();
    const baseQuestion = {
        name: id,
        inline: false,
    }
    switch (type) {
        case "Ввод":
            return {
                ...baseQuestion,
                qtype: "input",
                type: "str",
                right: ""
            }
        case "Выбор":
            return {
                ...baseQuestion,
                qtype: "select",
                multiselect: false,
                variants: [],
                right: [],
            }
        case "Последовательность":
            return {
                ...baseQuestion,
                qtype: "order",
                variants: [],
                right: []
            }
        case "Связка":
            return {
                ...baseQuestion,
                qtype: "connect",
                variants_l: [],
                variants_r: [],
                right: [],
            }
    }
}

export function replaceQuestion(elements, name, element) {
    let result = [];

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].name === name) {
            result.push(element);
        } else {
            result.push(elements[i]);
        }
    }

    return result;
}