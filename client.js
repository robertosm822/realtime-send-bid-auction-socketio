const socket = io();
//TRAZER VALOR PADRAO DO ULTIMO LANCE E ACIONAR PISCA
socket.on('bid_value', function (msg) {
    $('#firstBid').html(msg);
    blinkShowAnimate();
});
function blink_text() {
    $('.blink').fadeOut(500);
    $('.blink').fadeIn(500);
}
function blinkShowAnimate() {
    let blinkValue = setInterval(blink_text, 1000);
    setTimeout(() => {
        clearInterval(blinkValue);
    }, 5000);
}
function sendBid() {
    socket.on('bid_value', function (msg) {
        $('#lances').prepend(
            `<tr>
                        <td style="background-color: silver;">[${socket.id}]</td>
                        <td>${showDateSendBid()}</td>
                        <td>R$ ${msg}</td>
                    </tr>`
        );
    });
}
function sendBidNow(value) {
    socket.emit('bid_value', value);
}

function showYouBid(value) {
    //exibir o seu lance atual
    $('#lances').prepend(
        `<tr>
                <td style="background-color: #a9a9ff;">[${socket.id}]</td>
                <td>${showDateSendBid()}</td>
                <td>R$ ${value}</td>
            </tr>`
    );
    $('input[name="sendMsg"]').val('');
}
function sendBidByClick() {
    if ($('input[name="sendMsg"]').val() != "") {

        //validar se lance nao eh menor que ultimo lance
        if (parseFloat($('input[name="sendMsg"]').val()) > parseFloat($('input[name="lanceMinimo"]').val())) {
            updateMinBid($('input[name="sendMsg"]').val());
            sendBidNow($('input[name="sendMsg"]').val());
            showYouBid($('input[name="sendMsg"]').val());
            $('#error-bid').html('');
            blinkShowAnimate();
        } else {
            $('#error-bid').html(`
                        <div class="alert alert-danger">
                            Ops!!! Seu lance deve ser maior que o Último lance.
                        </div>
                    `);
        }
    }

}
function updateMinBid(value) {
    if (value > $('input[name="lanceMinimo"]').val()) {
        $('input[name="lanceMinimo"]').val(value);
        $('span#firstBid').html(value);
    }
}


//tratando exibicao de data atual
function showDateSendBid() {
    const today = new Date();
    let day = today.getDate() + "";
    let month = (today.getMonth() + 1) + "";
    let year = today.getFullYear() + "";
    let hour = today.getHours() + "";
    let minutes = today.getMinutes() + "";
    let seconds = today.getSeconds() + "";

    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    minutes = checkZero(minutes);
    seconds = checkZero(seconds);

    return day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
}

function checkZero(data) {
    if (data.length == 1) {
        data = "0" + data;
    }
    return data;
}
$(function () {
    sendBid();

    $('input[name="sendMsg"]').keydown(function (key) {
        if (key.keyCode === 13 && $(this).val() != "") {
            if (parseFloat($('input[name="sendMsg"]').val()) > parseFloat($('input[name="lanceMinimo"]').val())) {
                updateMinBid($(this).val());
                //enviar para o servidor o lance
                sendBidNow($(this).val());
                //exibir o seu lance atual
                showYouBid($(this).val())
                $('#error-bid').html('');
                blinkShowAnimate();
            } else {
                $('#error-bid').html(`
                            <div class="alert alert-danger">
                                Ops!!! Seu lance deve ser maior que o Último lance.
                            </div>
                        `);
            }
        }
    });
});