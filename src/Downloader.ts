
export interface DownloaderImpl {
    inject(): void;
}

export default interface Downloader {
    new():DownloaderImpl;
    siteRegex: RegExp;
    
}