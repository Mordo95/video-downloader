import { staticImplements } from "@/decorators/StaticImplements";
import Downloader from "@/Downloader";

@staticImplements<Downloader>()
export default class FacebookDownloader {
    static siteRegex: RegExp = /facebook\..*/;

    getReactFiber(el: HTMLElement) {
        for (let prop of Object.keys(el)) {
            if (prop.startsWith("__reactFiber")) {
                return (<Record<string, any>>el)[prop];
            }
        }
        return null;
    }

    fiberReturnUntil(fiber: any, displayName: string) {
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

    parentsUntil(el: HTMLElement, query: string) {
        let elInst = el;
        while (elInst != null) {
            if (elInst.matches(query))
                return elInst;
            elInst = elInst.parentElement!;
        }
        return null;
    }

    getVideoImplementation(fiber: any, impl = "VideoPlayerProgressiveImplementation") {
        if(!fiber || !fiber.memoizedProps || !fiber.memoizedProps.implementations)
            return null;
        return fiber.memoizedProps.implementations.find((x: any) => x.typename === impl);
    }

    addVideoButton(on: HTMLElement, videoEl: HTMLElement) {
        let btn = document.createElement("div");
        btn.innerHTML = "Download (HD)";
        btn.classList.add("dlBtn");
        btn.onclick = () => this.btnAct(videoEl);
        on.prepend(btn);
    }

    btnAct(videoEl: HTMLElement) {
        let fiber = this.getReactFiber(videoEl);
        let props = this.fiberReturnUntil(fiber, "a [from CoreVideoPlayer.react]");
        let impl = this.getVideoImplementation(props);
        if (impl.data.hdSrc) {
            window.open(impl.data.hdSrc);
        } else {
            window.open(impl.data.sdSrc);
        }
    }

    inject() {
        // @ts-ignore
        import('@style/facebook.scss');
        setInterval(() => {
            let videos = document.querySelectorAll("video:not([data-tagged])");
            for (let video of videos) {
                video.setAttribute("data-tagged", "true");
                let fiber = this.getReactFiber(video.parentElement!);
                let props = this.fiberReturnUntil(fiber, "a [from CoreVideoPlayer.react]");
                this.addVideoButton(document.querySelector(`[data-instancekey='${props.memoizedState.memoizedState}']`)!, video.parentElement!);
            }
        }, 200);
    }
}