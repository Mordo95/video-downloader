
export namespace Html {

    export function parentsUntil(el: HTMLElement, query: string) {
        let elInst = el;
        while (elInst != null) {
            if (elInst.matches(query))
                return elInst;
            elInst = elInst.parentElement!;
        }
        return null;
    }
}