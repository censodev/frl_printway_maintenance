const capitalize = text => {
    const arr = text.split("").map((item, index) => {
        if (index === 0) return item;
        if (item === "_") return " ";
        else return item.toLowerCase();
    })
    return arr.join("")
}
export default capitalize;