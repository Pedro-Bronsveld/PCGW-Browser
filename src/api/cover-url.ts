export const coverToThumbnailUrl = (imageUrl: string) => {
    const thumbnailUrl = new URL(imageUrl);
    thumbnailUrl.hostname = thumbnailUrl.hostname.replace(/^images\./, "thumbnails.");
    thumbnailUrl.pathname += `/180px-${thumbnailUrl.pathname.substring(thumbnailUrl.pathname.lastIndexOf("/") + 1)}`;
    return thumbnailUrl.toString();
}
