
export const Params = {
    paramsToObject(entries: any) {
        const result: Record<any,any> = {}
        for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
            result[key] = value;
        }
        return result;
    },

    buildParams(p: any) {
        return new URLSearchParams(p).toString();
    }
}