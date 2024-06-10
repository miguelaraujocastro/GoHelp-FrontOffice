$('.modal').on('hidden.bs.modal', function () {
    $('.modal-backdrop').remove();
});

document.addEventListener('DOMContentLoaded', function () {
    function setupFormConfirmation(formId, submitButtonId) {
        var modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        var submitButton = document.getElementById(submitButtonId);
        var form = document.getElementById(formId);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            modal.show();

            document.getElementById('confirmSubmitButton').addEventListener('click', function () {
                form.submit();
            });
        });
    }

    setupFormConfirmation('contactForm', 'confirmSubmitButton');

    setupFormConfirmation('pedidoTrabalhoForm', 'confirmSubmitButton');
});



document.addEventListener('DOMContentLoaded', function () {
    function setupFormConfirmationEventos(formId, submitButtonId) {
        var modal = new bootstrap.Modal(document.getElementById('confirmationModalPedidosEvento'));
        var submitButton = document.getElementById(submitButtonId);
        var form = document.getElementById(formId);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            modal.show();

            document.getElementById('confirmSubmitButtonPedidoEvento').addEventListener('click', function () {
                form.submit();
            });
        });
    }

    setupFormConfirmationEventos('pedidoEventoForm', 'confirmSubmitButtonPedidoEvento');
});


document.addEventListener('DOMContentLoaded', function () {
    function setupFormConfirmationDoacao(formId, submitButtonId) {
        var modal = new bootstrap.Modal(document.getElementById('confirmationModalDoacaoMonetaria'));
        var submitButton = document.getElementById(submitButtonId);
        var form = document.getElementById(formId);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            modal.show();

            document.getElementById('confirmSubmitButtonDoacaoMonetaria').addEventListener('click', function () {
                form.submit();
            });
        });
    }

    setupFormConfirmationDoacao('doacaoMonetariaForm', 'confirmSubmitButtonDoacaoMonetaria');
});