import { staticImplements } from "@/decorators/StaticImplements";
import Downloader from "@/Downloader";
import { React } from "@/helpers/React";

@staticImplements<Downloader>()
export default class FacebookDownloader {
    static siteRegex: RegExp = /facebook\..*/;
    

    getVideoImplementation(fiber: any, impl = "VideoPlayerProgressiveImplementation") {
        if(!fiber || !fiber.memoizedProps || !fiber.memoizedProps.implementations)
            return null;
        return fiber.memoizedProps.implementations.find((x: any) => x.typename === impl);
    }

    addVideoButton(on: HTMLElement, videoEl: HTMLElement, isShorts = false) {
        let btn = document.createElement("div");
        btn.innerHTML = "Download (HD)";
        btn.classList.add("dlBtn");
        if (isShorts) btn.classList.add("shorts");
        btn.onclick = () => this.btnAct(videoEl);
        on.prepend(btn);
    }

    btnAct(videoEl: HTMLElement) {
        let fiber = React.getReactFiber(videoEl);
        let props = React.fiberReturnUntil(fiber!, "a [from CoreVideoPlayer.react]");
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
                let fiber = React.getReactFiber(video.parentElement!);
                let props = React.fiberReturnUntil(fiber!, "a [from CoreVideoPlayer.react]");
                let appendTo: any = document.querySelector(`[data-instancekey='${props!.memoizedState.memoizedState}']`)!;
                let isShorts = false;
                if (props!.memoizedProps.subOrigin && props!.memoizedProps.subOrigin === "fb_shorts_viewer") {
                    let fiber2 = React.fiberReturnUntilFn(fiber, (fiber2) => { return fiber2.memoizedProps['data-video-id']});
                    let el = fiber2.stateNode.parentElement.nextSibling;
                    if (el.classList.contains("__fb-dark-mode"))
                        el = el.nextSibling;
                    appendTo = el;
                    isShorts = true;
                }
                this.addVideoButton(appendTo, video.parentElement!, isShorts);
            }
        }, 200);
    }
}