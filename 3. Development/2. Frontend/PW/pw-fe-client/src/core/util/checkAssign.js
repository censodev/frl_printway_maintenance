const checkAssign = nestedRowsSelected => {
    if(nestedRowsSelected.length === 1) return true;
    else {
        const listIdProductType = nestedRowsSelected.map(x => x.productTypeId)
        const arrRemoveDuplicate = [...new Set(listIdProductType)]
        return arrRemoveDuplicate.length === 1
    }
}
export default checkAssign