import Research from './Research'

window.onload = function () {
    return fetch('http://localhost:8080/platforms/BO2HNR2IC4P001KBGPT0/research', {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then(responseJson => {
        sessionStorage.setItem('plugin-research', JSON.stringify(responseJson.data));
        document.body.append(Research());
    });
}
