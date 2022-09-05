interface FeedItem {
    id: string;
    caption: string;
    media_url: string;
    permalink: string;
    media_type: string;
}

interface InstagramConfig {
    url: string;
    $container?: HTMLElement;
    maxItems?: number | boolean;
}

// noinspection JSUnusedGlobalSymbols
export default class Instagram {
    $container: HTMLElement;
    maxItems: number | boolean;
    items: FeedItem[];
    linkCssClass: string;
    lazyload: boolean;

    constructor(config: InstagramConfig | string) {
        const instagram = this;
        const request = new XMLHttpRequest();

        if (typeof config === 'string') {
            config = {url: config};
        }

        instagram.$container = config.$container || document.getElementById('instagram');
        instagram.maxItems = config.maxItems !== undefined ? config.maxItems : 6

        instagram.linkCssClass = 'instagram-link';
        instagram.lazyload = true;

        instagram.items = [];

        request.open('GET', config.url, true);
        request.onload = function () {
            instagram.items = JSON.parse(this.response).data;
            instagram.render();
        };

        request.send();
    }

    render(container?: HTMLElement) {
        const instagram = this;
        container = container || instagram.$container;

        for (let i = 0; i < instagram.items.length; i++) {
            if (!instagram.maxItems || i < instagram.maxItems) {
                container.innerHTML += instagram.renderItem(instagram.items[i], i + 1);
            }
        }
    }

    renderItem(item: FeedItem, position: number) {
        const instagram = this;
        return `<div class="instagram-item instagram-${position}"><a href="${item.permalink}" rel="noopener" class="${instagram.linkCssClass}" target="_blank">${instagram.renderMedia(item)}</a></div>`;
    }

    renderMedia(item: FeedItem) {
        const src = this.lazyload ? 'class="lazyload" data-src' : 'src';

        return item.media_type === 'VIDEO' ?
            `<video ${src}="${item.media_url}" autoplay loop muted playsinline></video>` :
            `<img ${src}="${item.media_url}" alt="${item.caption}">`;
    }
}