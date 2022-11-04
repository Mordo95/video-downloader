import { staticImplements } from "../decorators/StaticImplements";
import Downloader from "../Downloader";
import { DownloadButtonFactory } from "../factory/DownloadButtonFactory";

@staticImplements<Downloader>()
export default class YoutubeDownloader {
    static siteRegex: RegExp = /youtu(\.)?be.*/;
    public btnText = "Download (HD)";

    addVideoButton(on: HTMLElement) {
        let btn = document.createElement("div");
        btn.innerHTML = this.btnText;
        btn.classList.add("dlBtn");
        btn.onclick = () => this.getLinks(btn);
        on.prepend(btn);
    }

    getLinks(btn: HTMLElement) {
        let fd = new FormData();
        fd.set("q", window.location.href);
        fd.set("vt", "mp4");
        let url = "https://yt1s.com/api/ajaxSearch/index";
        GM_xmlhttpRequest({
            method: 'POST',
            url,
            // @ts-ignore
            data: fd,
            onload: (resp: Tampermonkey.Response<any>) => {
                let js = JSON.parse(resp.responseText);
                this.convert(btn, js.vid, js.links.mp4.auto.k);
            }
        });
    }

    convert(btn: HTMLElement, vid: any, k: any) {
        let fd = new FormData();
        fd.set("vid", vid);
        fd.set("k", k);
        btn.innerHTML = "Converting ...";
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://yt1s.com/api/ajaxConvert/convert',
            // @ts-ignore
            data: fd,
            timeout: 60000,
            onload: (resp: Tampermonkey.Response<any>) => {
                let js = JSON.parse(resp.responseText);
                let status = js.c_status;
                if (status === "CONVERTED") {
                    window.open(js.dlink);
                } else {
                    alert("Error converting video. Please try again later!");
                }
                btn.innerHTML = this.btnText;
            },
            onTimeout: () => { btn.innerHTML = this.btnText; }
        });
    }

    inject(): void {
        // @ts-ignore
        import('@style/style.scss');
        setInterval(() => {
            let videos = document.querySelectorAll("#ytd-player:not([data-tagged])");
            for (let video of videos) {
                video.setAttribute("data-tagged", "true");
                console.log(document.querySelector("#container"));
                this.addVideoButton(document.querySelector("#ytd-player")!);
            }
        }, 200);
    }

}