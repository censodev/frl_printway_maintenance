export default function getQueryUrl(url, params) {
    let result = new URL(`${process.env.REACT_APP_CUSTOM_STATIC_API_URL}${url}`) || '';
    let search_params = result.searchParams;

    for (let [key, value] of Object.entries(params)) {
        search_params.append(key, value);
    }

    return result;
}
