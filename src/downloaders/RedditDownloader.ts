import { staticImplements } from "@/decorators/StaticImplements";
import Downloader from "@/Downloader";
import { Params } from "@/helpers/Params";

@staticImplements<Downloader>()
export default class RedditDownloader {
    static siteRegex: RegExp = /reddit\..*/;
    public btnText = "Download (HD)";

    addVideoButton(on: HTMLElement) {
        on.querySelectorAll(".dlBtn").forEach(el => el.remove());
        let btn = document.createElement("div");
        btn.innerHTML = this.btnText;
        btn.classList.add("dlBtn");
        btn.onclick = () => this.btnAct(btn);
        on.prepend(btn);
    }

    returnUntil(inst: any, prop: any) {
        let fInst = inst;
        while (fInst != null) {
            if (fInst.pendingProps[prop])
                return fInst;

            fInst = fInst.return;
        }
        return null;
    }

    getReactInternalState(el: HTMLElement) {
        for (let prop of Object.keys(el)) {
            if (prop.startsWith("__reactInternalInstance")) {
                return (<Record<string,any>>el)[prop];
            }
        }
        return null;
    }

    btnAct(btn: HTMLElement) {
        let src = this.returnUntil(this.getReactInternalState(btn.parentElement!), "mpegDashSource");
        if (!src) {
            alert("Unable to load video data");
            return;
        }
        let mpegDashUrl = src.pendingProps.mpegDashSource;
        let match = mpegDashUrl.match(/https:\/\/v.redd.it\/(?<videoId>.+)\/DASHPlaylist\.mpd/);
        if (!match) {
            alert("Unable to load video data");
            return;
        }
        let videoId = match.groups.videoId;
        let p = Params.buildParams({
            video_url: 'https://v.redd.it/' + videoId + '/DASH_720.mp4?source=fallback',
            audio_url: 'https://v.redd.it/' + videoId + '/DASH_audio.mp4?source=fallback',
            permalink: window.location.origin + src.pendingProps.postUrl.pathname
        });
        window.open("https://ds.redditsave.com/download.php?" + p);
    }

    inject() {
        // @ts-ignore
        import('@style/reddit.scss');
        setInterval(() => {
            let videos = document.querySelectorAll("video:not([data-tagged])");
            for (let video of videos) {
                if (video.parentElement!.querySelector(".dlBtn") == null && (<HTMLElement>video.parentElement!.parentElement!.firstChild!).getAttribute("role") !== "slider")
                    this.addVideoButton(video.parentElement!);
            }
        }, 200);
    }
}