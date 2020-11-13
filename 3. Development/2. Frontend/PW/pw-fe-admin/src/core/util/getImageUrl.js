import React from 'react';
import img from '../../assets/placeholder-thumb.png';

export default function getImageUrl(url) {

    let result = img;

    if (url) {
        if (url.indexOf("https://") > -1) {
            result = url;
        } else {
            result = `${process.env.REACT_APP_CUSTOM_STATIC_API_URL}pgc-service/api/upload/image-source/${url}/thumb`
        }
    }

    return result;
}
