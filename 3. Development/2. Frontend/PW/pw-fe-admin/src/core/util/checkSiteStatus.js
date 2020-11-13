import React from "react";

export default function checkSiteStatus(data) {
    let result = null;
    if (!data.sync && !data.active && !data.deleted) {
        result =' (pending)'
    } else if (data.sync && data.active && !data.deleted) {
        result = ' (active)'
    } else if (data.sync && !data.active && !data.deleted) {
        result = ' (inactive)'
    } else if (data.sync && !data.active && data.deleted) {
        result = ' (removed)'
    }

    return result;
}
