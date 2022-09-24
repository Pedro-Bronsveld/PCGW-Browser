export const setUrlQueryParams = (url: URL, params: URLSearchParams): URL => {
    const urlObj = url;
    params.forEach((value, key) => urlObj.searchParams.set(key, value));
    return urlObj;
}
