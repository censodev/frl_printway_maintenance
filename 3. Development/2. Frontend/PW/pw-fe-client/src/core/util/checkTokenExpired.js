export default function checkTokenExpired(error) {
    if (error) {
        if (error.response.data.status === 401 && error.response.data.title === 'Unauthorized') {
            localStorage.clear();
            window.location.href = '/login';
        }
    }
}
