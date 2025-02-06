window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.href = '/';
    }
});

function gotoHome(){
    window.location.href = '/';
}