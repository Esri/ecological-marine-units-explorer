export function formatRegionLabel(input) {
    let formattedValue = ``;
    if (input.length > 0) {
        formattedValue = input.split("(")[0].trim();
    }
    return formattedValue;
}

export function formatValue(input) {
    return input.toLocaleString("en-US");
}

export function formatLabel(str) {
    if (str.length > 4) {
        return str;
    } else {
        return '<span style="opacity:0;">0</span>' + str;
    }
}

/**
 *
 * @param items
 * @param classStr
 */
export function removeSelected(items, classStr) {
    items.forEach(item => {
        removeClass(item, classStr);
    });
}

/**
 *
 * @param className
 * @param allNodes
 * @param includeAnchor
 */
export function clearDOM(className = "", allNodes = false, includeAnchor = false) {
    let nodes = (allNodes) ? document.querySelectorAll(className) : document.querySelector(className);
    if (includeAnchor) {
        nodes.forEach(node => {
            node.parentNode.removeChild(node);
        });
    } else {
        while (nodes.firstChild) {
            nodes.removeChild(nodes.firstChild);
        }
    }
}

/**
 * Check if an element has a specific class
 *
 * @param domNode
 * @param className
 * @returns {boolean}
 */
export function hasClass(domNode, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(domNode.getAttribute('class'));
}

/**
 * Add one or more classes to an element
 *
 * @param domNode
 * @param classes
 */
export function addClass(domNode, classes) {
    classes.split(' ').forEach(function (c) {
        if (!hasClass(domNode, c)) {
            let existingClass = domNode.getAttribute('class') || '';
            domNode.setAttribute('class', existingClass + ' ' + c);
        }
    });
}

/**
 * Remove one or more classes from an element
 *
 * @param domNode
 * @param classes
 */
export function removeClass(domNode, classes) {
    classes.split(' ').forEach(function (c) {
        let removedClass = (domNode.getAttribute('class') || '').replace(new RegExp('(\\s|^)' + c + '(\\s|$)', 'g'), '$2');
        if (hasClass(domNode, c)) {
            domNode.setAttribute('class', removedClass);
        }
    });
}

/**
 *
 * @param element
 */
export function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function fadeOutHandler(eleId) {
    let ele = document.getElementById(eleId);
    ele.setAttribute("class", "fade-out");
}

export function fadeInHandler(eleId) {
    let ele = document.getElementById(eleId);
    ele.setAttribute("class", "fade-in");
}

export function getElementDimensions(elementId) {
    const ele = document.getElementById(elementId);
    const dimensions = ele.getBoundingClientRect();
    return {
        "chartContainerWidth": dimensions.width,
        "chartContainerHeight": dimensions.height
    };
}

export function applyMask(selector = ``, width = 0, height = 0) {
    const ele = document.querySelectorAll(selector);
    ele.forEach(mask => {
        mask.style.width = width;
        mask.style.height = height;
    });
}

/**********
 *
 * Mobile
 *
 **********/
export function phoneChartContainer(ele, i) {
    if (i < 1) {
        ele.style.display = "flex";
    } else {
        ele.style.display = "none";
    }
}

export function tabletChartContainer(ele, i) {
    if (i < 2) {
        ele.style.display = "flex";
    } else {
        ele.style.display = "none";
    }
}

export function laptopChartContainer(ele, i) {
    if (i < 3) {
        ele.style.display = "flex";
    } else {
        ele.style.display = "none";
    }
}

export function desktopChartContainer(ele, i) {
    ele.style.display = "flex";
}
