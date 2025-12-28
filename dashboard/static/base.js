document.addEventListener('DOMContentLoaded', function () {
    dashboardRedirect();
});

function dashboardRedirect() {
    document.getElementById('header-container').onclick = () => {
        window.location.href = "/";
    };
}