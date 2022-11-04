
export type DownloadButtonOptions = {
    onClick: () => void,
    text?: string,
}

export const DownloadButtonFactory = (opts: DownloadButtonOptions) => {
    let btn = document.createElement("div");
    btn.innerHTML = opts.text || "Download (HD)";
    btn.classList.add("dlBtn");
    btn.onclick = opts.onClick;
    return btn;
}