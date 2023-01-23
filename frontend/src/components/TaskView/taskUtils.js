function parseTaskElements(str) {
    const matches = str.match(/\$\[.+?]/g);

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

export function generateTask({text, elements}) {
    let elementNames = parseTaskElements(text);
    let task = [];
    let startIndex = 0;

    for (let i = 0; i < elementNames.length; i++) {
        const name = elementNames[i];
        const substring = text.substring(startIndex, name.index);
        const element = elements.find(e => e.name === name.value);

        if (substring !== '') {
            task.push(substring);
        }
        if (!element) {
            task.push("Неверное название элемента");
            startIndex = name.index + name.value.length + 3;
            continue;
        }
        if (element.qtype === "connect") {
            task.push({...element, right: element.right[1]});
        } else {
            task.push(element);
        }

        startIndex = name.index + name.value.length + 3;
    }

    task.push(text.substring(startIndex));

    return task;
}

export function formatTask(task) {
    let formatted = {
        text: "",
        elements: [],
    };

    task.forEach(fragment => {
       if (typeof fragment === "string") {
           formatted.text += fragment;
       } else {
           formatted.text += `$[${fragment.name}]`;

           if (fragment.qtype === "connect") {
               formatted.elements.push({...fragment, right: [[], fragment.right]});
           } else {
               formatted.elements.push(fragment);
           }
       }
    });

    return formatted;
}

export function createBaseQuestion(type) {
    const baseQuestion = {
        name: "",
        inline: false,
        points: 1
    }
    switch (type) {
        case "Ввод":
            return {
                ...baseQuestion,
                qtype: "input",
                int: false,
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
                right: [[], {}],
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