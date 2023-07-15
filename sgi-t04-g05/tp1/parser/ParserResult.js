/**
 * Model that stores the value and errors of a parsing result
 */
export class ParserResult {
    /**
     * @param {*} value - Result value of the parser
     * @param {*} errors - Errors of the parser
     */
    constructor(value, errors){
        this.value = value;
        this.errors = errors;
    }

    /**
     * Initializes a ParserResult with the given error
     * @param {string} error - Error message
     * @returns ParserResult with the given error
     */
    static fromError(error) {
        return new ParserResult(null, [error]);
    }
    
    /**
     * Initializes a ParserResult with the given value
     * @param {*} value - Result of the parser
     * @returns ParserResult with the given value
     */
    static fromValue(value) {
        return new ParserResult(value, []);
    }
    
    /**
     * Collects all the errors of the parser results
     * @param {*} value - Result of the parser
     * @param {Array<ParserResult>} parserResults - Parser results to be collected
     * @param {string} context - key where the errors will be stored
     * @param {*} other_errors - Initial errors
     * @returns Collected ParserResult
     */
    static collect(value, parserResults, context, other_errors=[]){
        let errors = other_errors;
        for(const parserResult of parserResults){
            errors = errors.concat(parserResult.getErrors());
        }
        if(errors.length > 0){
            let k = {};
            k[context] = errors;
            return new ParserResult(value, [k]);
        }
        return this.fromValue(value);
    }

    /**
     * Gets the result value
     * @returns Result value
     */
    getValue() {
        return this.value;
    }

    /**
     * Gets the given default value, if the result has no value, else the result value
     * @param {*} defaultValue - Default value returned if the result has no value
     * @returns Default value, if the result has no value, else the result value
     */
    getValueOrDefault(defaultValue) {
        return this.value == null ? defaultValue : this.value;
    }

    /**
     * Gets the list of result errors
     * @returns List of result errors
     */
    getErrors() {
        return this.errors;
    }
    
    /**
     * Checks if there are result errors
     * @returns Boolean indicating if there are result errors
     */
    hasError() {
        return this.errors.length > 0;
    }
}