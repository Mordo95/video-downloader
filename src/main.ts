import Injector from '@/Injector';
import YoutubeDownloader from '@/downloaders/YoutubeDownloader';
import FacebookDownloader from './downloaders/FacebookDownloader';
import RedditDownloader from '@/downloaders/RedditDownloader';
import TwitterDownloader from './downloaders/TwitterDownloader';

Injector.register(YoutubeDownloader);
Injector.register(FacebookDownloader);
Injector.register(RedditDownloader);
Injector.register(TwitterDownloader);

document.addEventListener('DOMContentLoaded', () => {
    Injector.inject(window.location.href);
}, false);