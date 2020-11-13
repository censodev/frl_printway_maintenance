export default function allPossibleCases(arr) {
    if (arr.length === 1) {
        return arr[0];
    } else {
        let result = [];
        let allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
        for (let i = 0; i < allCasesOfRest.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {
                result.push(`${arr[0][j]}|||${allCasesOfRest[i]}`);
            }
        }
        return result;
    }
}
