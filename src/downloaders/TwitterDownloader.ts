import { staticImplements } from "@/decorators/StaticImplements";
import Downloader from "@/Downloader";

@staticImplements<Downloader>()
export default class TwitterDownloader {
    static siteRegex: RegExp = /twitter\..*/;

    getReactFiber(el: HTMLElement) {
        for (let prop of Object.keys(el)) {
            if (prop.startsWith("__reactFiber")) {
                return (<Record<string, any>>el)[prop];
            }
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

    fiberReturnUntil(fiber: any, predicate: (fiber: any) => boolean) {
        let fiberInst = fiber;
        while (fiberInst != null) {
            if (predicate(fiberInst))
                return fiberInst;
            fiberInst = fiberInst.return;
        }
        return null;
    }

    addVideoButton(on: HTMLElement, videoEl: HTMLElement) {
        let btn = document.createElement("div");
        btn.innerHTML = "Download (HD)";
        btn.classList.add("dlBtn");
        btn.onclick = () => this.btnAct(videoEl);
        on.prepend(btn);
    }
    // TODO: Fetch bearer token from https://ma-0.twimg.com/twitter-assets/responsive-web/web/ltr/main.5b6bf12947d7a3a6.js using jsonp
    // GET "https://api.twitter.com/2/timeline/conversation/1588262810839969793.json"
    // Example response at https://privatebin.net/?8b894069e25a4b7a#5Ypa3nu1554tAUghg9mX1seNJt7JEqGtS4MSG7ND6XpA

    btnAct(videoEl: HTMLElement) {
        /*let fiber = this.getReactFiber(videoEl);
        let props = this.fiberReturnUntil(fiber, "a [from CoreVideoPlayer.react]");
        let impl = this.getVideoImplementation(props);
        if (impl.data.hdSrc) {
            window.open(impl.data.hdSrc);
        } else {
            window.open(impl.data.sdSrc);
        }*/
        const fiber = this.getReactFiber(videoEl.parentElement!.parentElement!);
        const fiber2 = this.fiberReturnUntil(fiber, (x) => x.memoizedProps?.contentId);
        console.log(fiber, fiber2);
    }

    inject() {
        // @ts-ignore
        import('@style/style.scss');
        setInterval(() => {
            let videos = document.querySelectorAll("video:not([data-tagged])");
            for (let video of videos) {
                video.setAttribute("data-tagged", "true");
                this.addVideoButton(video.parentElement!, (<HTMLElement>video));
                //const article = 
                /*let fiber = this.getReactFiber(video.parentElement!);
                let props = this.fiberReturnUntil(fiber, "a [from CoreVideoPlayer.react]");
                this.addVideoButton(document.querySelector(`[data-instancekey='${props.memoizedState.memoizedState}']`)!, video.parentElement!);*/
            }
        }, 200);
    }
}