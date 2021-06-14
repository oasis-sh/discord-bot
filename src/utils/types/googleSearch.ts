interface ItemData {
    title: string;
    link: string;
    snippet: string;
    formattedUrl: string;
}

export default interface GoogleSearchResponse {
    items?: ItemData[];
}
