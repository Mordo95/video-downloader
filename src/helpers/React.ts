
export namespace React {

    interface AnyProperties {
        [prop: string]: any
    }

    export type ReactFiber = AnyProperties & {};
    export type ReactInternalState = AnyProperties & {};

    
    /**
     * Returns the React Fiber instance from a HTML element
     * @param el the element
     * @returns a react fiber instance, or null if it doesn't exist
     */
    export function getReactFiber(el: HTMLElement) {
        for (let prop of Object.keys(el)) {
            if (prop.startsWith("__reactFiber")) {
                return (<ReactFiber>(<Record<string, any>>el)[prop]);
            }
        }
        return null;
    }

    /**
     * Returns a fiber instance looping back in the return frame until the desired displayName is found.
     * @param fiber the fiber instance
     * @param displayName the display name
     * @returns a fiber instance, or null if it doesn't exist
     */
    export function fiberReturnUntil(fiber: ReactFiber, displayName: string) {
        let fiberInst = fiber;
        while (fiberInst != null) {
            let fiberInstName = "";
            if (typeof fiberInst.elementType === "string")
                fiberInstName = fiberInst.elementType;
            else if (typeof fiberInst.elementType === "function")
                fiberInstName = fiberInst.elementType.displayName;
            if (fiberInstName === displayName)
                return fiberInst;

            fiberInst = fiberInst.return;
        }
        return null;
    }

    /**
     * Returns a fiber instance looping back in the return frame until the desired predicate matches it.
     * @param fiber the fiber instance
     * @param predicate the predicate to check against
     * @returns a fiber instance, or null if it doesn't exist
     */
    export function fiberReturnUntilFn(fiber: any, predicate: (fiber: any) => boolean) {
        let fiberInst = fiber;
        while (fiberInst != null) {
            if (predicate(fiberInst))
                return fiberInst;
            fiberInst = fiberInst.return;
        }
        return null;
    }

    /**
     * Returns a reactInternalState prop from a HTML element
     * @param el the element
     * @returns A React Internal State instance
     */
    export function getInternalState(el: HTMLElement) {
        for (let prop of Object.keys(el)) {
            if (prop.startsWith("__reactInternalInstance")) {
                return (<ReactInternalState>(<Record<string,any>>el)[prop]);
            }
        }
        return null;
    }

    /**
     * Returns a react internal state looping back in the return frame until the desired prop is found.
     * @param inst 
     * @param prop 
     * @returns A React Internal State instance
     */
    export function returnUntil(inst: ReactInternalState, prop: any) {
        let fInst = inst;
        while (fInst != null) {
            if (fInst.pendingProps[prop])
                return fInst;

            fInst = fInst.return;
        }
        return null;
    }

}