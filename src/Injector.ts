import Downloader from "./Downloader";

export class Injector {
    public downloaders: Downloader[] = [];

    register(downloader: Downloader) {
        if (Array.isArray(downloader)) {
            this.downloaders = this.downloaders.concat(downloader);
        } else
        this.downloaders.push(downloader);
    }

    inject(location: string) {
        for (const downloader of this.downloaders) {
            if (location.match(downloader.siteRegex))
                (new downloader).inject();
        }
    }
}

export default new Injector();