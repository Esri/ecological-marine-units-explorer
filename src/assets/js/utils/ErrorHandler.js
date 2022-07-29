export function errorHandler(error) {
    if (error.name && error.message) {
        console.debug(`${error.name} ${error.message}`);
    } else {
        console.debug(error);
    }
}
