export function collect(generator) {
    if (!generator || Array.isArray(generator)) {
        return generator;
    }

    let result = [];
    let item;
    while (item = generator.next()) {
        if (item.done) break;
        result.push(item.value);
    }
    return result;
}

export function* merge(...sources) {
    for (const source of sources) {
        yield* source;
    }
}
