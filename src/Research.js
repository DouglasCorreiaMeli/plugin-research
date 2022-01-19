var platform = {
    site_id: wc_mercadopago_params.site_id,
    platform_id: wc_mercadopago_params.platform_id,
    platform_version: wc_mercadopago_params.platform_version,
    plugin_version: wc_mercadopago_params.plugin_version,
    endpoint: 'https://homol_mpmodules-caronte.furyapps.io/insights',
    cust_id: 1
};

const Research = (client_id) => {
    platform.cust_id = client_id;
    const data = JSON.parse(sessionStorage.getItem('plugin-research'));
    if (data) {
        const Research = document.createElement('div');
        Research.className = 'mp-plugin-research'
        Research.setAttribute('id', 'plugin-research');

        const question = createQuestion(data);
        Research.appendChild(question);

        const reasons = createReason(data);
        Research.appendChild(reasons);

        let accordion = createAcordionSection();
        Research.appendChild(accordion);
        return Research;
    }
}
export default Research;

function createAcordionSection() {
    let accordion = document.createElement('div');
    accordion.setAttribute('id', 'acc');
    accordion.className = 'mp-research-accordion';
    let text = getAccordionLang(platform.site_id).split('!');

    let paragraph = document.createElement('p');
    paragraph.innerHTML = text[0];
    paragraph.className = 'mp-research-text';
    accordion.appendChild(paragraph);

    let textArea = document.createElement('textarea');
    textArea.className = 'mp-research-text-area';
    textArea.setAttribute('placeholder', text[1]);
    textArea.setAttribute('id', 'comments');
    accordion.appendChild(textArea);

    let btn = document.createElement('btn');
    btn.setAttribute('type', 'button');
    btn.addEventListener('click', sendData);
    btn.innerHTML = 'Enviar';
    btn.className = 'mp-research-button';
    accordion.appendChild(btn);
    return accordion;

    function getAccordionLang(site_id) {
        const AccLang = {
            'MLB': 'Por qual motivo você escolheu essa classificação? (Opcional)! conta pra gente',
            'MLA': '¿Por qué eligió esta clasificación? (Opcional)! dinos',
            'MLM': '¿Por qué eligió esta clasificación? (Opcional)! dinos',
            'MLC': '¿Por qué eligió esta clasificación? (Opcional)! dinos',
            'MLU': '¿Por qué eligió esta clasificación? (Opcional)! dinos',
            default: 'Why did you choose this rating? (Optional)! tell us'
        }
        return AccLang[site_id] || AccLang.default
    }
}

function createReason(data) {
    const reasons = document.createElement('div');
    reasons.className = 'mp-research-reasons';
    data.reasons.forEach(reason => {
        let label = document.createElement('label');
        let input = document.createElement('input');
        input.addEventListener("click", function () {
            var acc = document.getElementById('acc');
            acc.style = 'max-height: 300px;';
        });
        input.setAttribute('type', 'radio');
        input.setAttribute('value', reason.reason_en);
        input.setAttribute('name', 'rate');
        let span = document.createElement('span');
        span.innerHTML = getReasonLang(platform.site_id, reason);
        let helperDiv = document.createElement('div');
        let img = document.createElement('img');
        switch (reason.reason_en) {
            case 'very easy':
                helperDiv.className = 'mp-research-good';
                img.setAttribute('src', 'https://hml-caronte-fe.s3.amazonaws.com/very_easy.svg');
                break;
            case 'easy':
                helperDiv.className = 'mp-research-good';
                img.setAttribute('src', 'https://hml-caronte-fe.s3.amazonaws.com/easy.svg');
                break;
            case 'neutral':
                helperDiv.className = 'mp-research-neutral';
                img.setAttribute('src', 'https://hml-caronte-fe.s3.amazonaws.com/neutral.svg');
                break;
            case 'hard':
                helperDiv.className = 'mp-research-bad';
                img.setAttribute('src', 'https://hml-caronte-fe.s3.amazonaws.com/hard.svg');
                break;
            case 'very hard':
                helperDiv.className = 'mp-research-bad';
                img.setAttribute('src', 'https://hml-caronte-fe.s3.amazonaws.com/very_hard.svg');
                break;
            default:
                img = null;
                helperDiv.className = 'mp-default';
                break;
        }
        if (img) span.appendChild(img);
        label.appendChild(input);
        label.appendChild(span);
        helperDiv.appendChild(label);
        reasons.appendChild(helperDiv);
    });
    return reasons;

    function getReasonLang(site_id, reason) {
        const ReasonLang = {
            'MLB': reason.reason_pt,
            'MLA': reason.reason_es,
            'MLM': reason.reason_es,
            'MLC': reason.reason_es,
            'MLU': reason.reason_es,
            default: reason.reason_en
        }
        return ReasonLang[site_id] || ReasonLang.default
    }
}

function createQuestion(data) {

    const question = document.createElement('h2');
    question.className = 'mp-research-title';
    question.innerHTML = getQuestionLang(platform.site_id)
    return question;

    function getQuestionLang(site_id) {
        const QuestionLang = {
            'MLB': data.question_pt,
            'MLA': data.question_es,
            'MLM': data.question_es,
            'MLC': data.question_es,
            'MLU': data.question_es,
            default: data.question_en
        }
        return QuestionLang[site_id] || QuestionLang.default
    }
}



function getPayload() {
    let cust_id = platform.cust_id; 
    let research = JSON.parse(sessionStorage.getItem('plugin-research'));
    let comments = document.getElementById('comments').value;
    let reason = document.querySelector('input[name="rate"]:checked').value;
    let question_en = research.question_en;
    let question_es = research.question_es;
    let question_pt = research.question_pt;
    let research_code = research.code;
    let type;
    if (reason.includes('easy')) {
        type = 'positive';
    } else {
        type = 'negative';
    }
    return {
        comments: comments,
        reason: reason,
        platform_id: platform.platform_id,
        platform_version: platform.platform_version,
        plugin_version: platform.plugin_version,
        cust_id: cust_id,
        question_en: question_en,
        question_pt: question_pt,
        question_es: question_es,
        research_code: research_code,
        type: type
    };
}


function replaceResearchForThanks() {
    let research = document.getElementById('plugin-research');
    research.innerHTML = '';
    let thanksDiv = document.createElement('div');
    let thanksTitle = document.createElement('h2');
    thanksTitle.className = 'mp-research-title';
    let text = getTanksLang(platform.site_id).split('!');
    thanksTitle.innerHTML = text[0] + '!';
    thanksDiv.appendChild(thanksTitle);
    let thanksSpan = document.createElement('span');
    thanksSpan.className = 'mp-research-span';
    thanksSpan.innerHTML = text[1];
    thanksDiv.appendChild(thanksTitle);
    thanksDiv.appendChild(thanksSpan);
    research.appendChild(thanksDiv);
    sessionStorage.removeItem('plugin-research');


    function getTanksLang(site_id) {
        const TanksLang = {
            'MLB': 'Agradecemos a sua resposta! Ela vai nos ajudar a melhorar cada vez mais sua experiência.',
            'MLA': '¡Agradecemos su respuesta! Nos ayudará a mejorar aún más su experiencia.',
            'MLM': '¡Agradecemos su respuesta! Nos ayudará a mejorar aún más su experiencia.',
            'MLC': '¡Agradecemos su respuesta! Nos ayudará a mejorar aún más su experiencia.',
            'MLU': '¡Agradecemos su respuesta! Nos ayudará a mejorar aún más su experiencia.',
            default: 'We appreciate your reply! It will help us to improve your experience even more.'
        }
        return TanksLang[site_id] || TanksLang.default
    }
}

function sendData() {
    let payload = getPayload();
    sendHttpsRequest('POST', platform.endpoint, payload).then(responseData => {
        return responseData;
    }).finally(() => {
        replaceResearchForThanks();
    });
};

function sendHttpsRequest(method, url, data) {
    return fetch(url, {
        method: method,
        body: data ? JSON.stringify(data) : null,
        headers: data ? { 'Content-Type': 'application/json' } : {}
    }).then(response => {
        return response.json();
    });
}