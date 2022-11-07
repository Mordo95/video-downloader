import { staticImplements } from "@/decorators/StaticImplements";
import Downloader from "@/Downloader";
import { React } from "@/helpers/React";

@staticImplements<Downloader>()
export default class TwitterDownloader {
    static siteRegex: RegExp = /twitter\..*/;
    readonly TWITTER_BEARER = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";



    async fetchGuestToken() {
        const resp = await fetch("https://api.twitter.com/1.1/guest/activate.json", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.TWITTER_BEARER}`
            }
        })
        const respJson = await resp.json();
        return respJson.guest_token;
    }

    async queryApi(twId: string) {
        const resp = await fetch(`https://api.twitter.com/2/timeline/conversation/${twId}.json`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.TWITTER_BEARER}`,
                "X-Guest-Token": await this.fetchGuestToken()
            }
        });
        return await resp.json();
    }

    addVideoButton(on: HTMLElement, videoEl: HTMLElement) {
        let btn = document.createElement("div");
        btn.innerHTML = "Download (HD)";
        btn.classList.add("dlBtn");
        btn.onclick = () => this.btnAct(videoEl);
        on.prepend(btn);
    }

    async btnAct(videoEl: HTMLElement) {
        const fiber = React.getReactFiber(videoEl.parentElement!.parentElement!);
        const fiber2 = React.fiberReturnUntilFn(fiber, (x) => x.memoizedProps?.contentId);
        const twId = fiber2.memoizedProps.videoId.id;
        const data = await this.queryApi(twId);
        const media = data.globalObjects.tweets[twId].extended_entities.media;
        console.log(data.globalObjects.tweets[twId], media);
        if (media.length === 0) { alert("Cannot fetch media data"); }
        let variants = media[0].video_info.variants;
        variants = variants.filter((x: any) => x.content_type !== "application/x-mpegURL").sort((a: any, b: any) => {
           return a.bitrate > b.bitrate ? -1 : 1; 
        });
        window.open(variants[0].url);
    }

    inject() {
        // @ts-ignore
        import('@style/style.scss');
        setInterval(() => {
            let videos = document.querySelectorAll("video:not([data-tagged])");
            for (let video of videos) {
                video.setAttribute("data-tagged", "true");
                this.addVideoButton(video.parentElement!, (<HTMLElement>video));
            }
        }, 200);
    }
}