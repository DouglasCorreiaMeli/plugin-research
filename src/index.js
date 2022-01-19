import Research from './Research'

var parameters = {
    platform_id: wc_mercadopago_params.platform_id,
    public_key_element_id: wc_mercadopago_params.public_key_element_id
}

window.onload = function () {
    return fetch(`https://homol_mpmodules-caronte.furyapps.io/platforms/${parameters.platform_id}/research`, {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then(responseJson => {
        sessionStorage.setItem('plugin-research', JSON.stringify(responseJson.data));
        getCustID();

    });
}

function getCustID() {
    let pk = document.getElementById(parameters.public_key_element_id).value;
    let url = `https://api.mercadopago.com/plugins-credentials-wrapper/credentials?public_key=${pk}`
    fetch(url, { method: 'GET' }).then(response => {
        return response.json();
    }).then(responseData => {
        init(responseData.client_id);
    });
}

function init(client_id) {
    var admin = document.getElementById('mp-step-4');
    if (admin) {
        admin.append(Research(client_id));
        return;
    }
    var teste = document.getElementById('mainform');
    if (teste) {
        teste.append(Research(client_id));
        return;
    }
    document.body.append(Research(client_id));
}

