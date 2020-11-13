export default function capitalizeRole(role) {
    let result = '';
    if (role) {
        result = role.substr(5).charAt(0).toUpperCase() + role.substr(5).slice(1).toLowerCase();
    }
    return result;
}
