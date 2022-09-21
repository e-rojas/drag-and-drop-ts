export function autoBind(_target, _methodName, descriptor) {
    const mainMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFunction = mainMethod.bind(this);
            return boundFunction;
        },
    };
    return adjDescriptor;
}
//# sourceMappingURL=autobind.js.map