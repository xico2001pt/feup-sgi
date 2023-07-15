/**
 * Printer for the parser errors
 */
export class ParserErrorPrinter {
    /**
     * Prints the given error with the given nesting level
     * @param {*} error - String or object with error messages
     * @param {number} nesting_level - Level of identation
     */
    static print(error, nesting_level=0) {
        if(Array.isArray(error)){
            for(const e of error){
                if (typeof e === 'string' || e instanceof String){
                    console.warn(" ".repeat(nesting_level*4) + e);
                } else {
                    for(const [context, otherErrors] of Object.entries(e)) {
                        console.warn(" ".repeat(nesting_level*4) + "context: " + context);
                        this.print(otherErrors, nesting_level+1);
                    }
                }
            }
        } else {
            console.log(" ".repeat(nesting_level*4) + error);
        }
    }
}