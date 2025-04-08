export function objectTreeSelect(object: any, tree: string) {
    return tree.split('.').reduce((acc, curr) => {
        if (curr.includes('[')) {
            const [prop, idx] = curr.split('[');
            return acc[prop][idx.slice(0, -1)];
        }
        return acc[curr];
    }, object);
}

export function removeEmptyProperties(obj: any) {
    const result: any = {};
    Object.keys(obj).forEach((key: string) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (Array.isArray(obj[key])) {
                result[key] = obj[key];
            } else {
                const res = removeEmptyProperties(obj[key]);
                if (Object.keys(res).length > 0) {
                    result[key] = res;
                }
            }
        } else if (obj[key] !== null && obj[key] !== undefined) {
            result[key] = obj[key];
        }
    });
    return result;
}

export function jsonToFormData(data: Record<string, any>, formData: FormData = new FormData(), parentKey?: string): FormData {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const fullKey = parentKey ? `${parentKey}[${key}]` : key;

            if (data[key] instanceof Blob) {
                // If the value is a Blob, append it to the FormData directly
                formData.append(fullKey, data[key], (data[key] as any)['name'] || 'file');
            } else if (typeof data[key] === 'object' && data[key] !== null) {
                // If the value is an object or array, recursively call jsonToFormData
                if (Array.isArray(data[key])) {
                    for (let i = 0; i < data[key].length; i++) {
                        jsonToFormData({ [i]: data[key][i] }, formData, fullKey);
                    }
                } else {
                    jsonToFormData(data[key], formData, fullKey);
                }
            } else {
                // If the value is a primitive type, append it to the FormData
                formData.append(fullKey, data[key]);
            }
        }
    }

    return formData;
}
