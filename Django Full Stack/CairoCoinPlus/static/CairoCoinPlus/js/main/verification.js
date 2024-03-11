// Function to update countdown
function updateCountdown() {
    var hours = Math.floor(countdown / 3600);
    var minutes = Math.floor((countdown % 3600) / 60);
    var seconds = countdown % 60;

    var formattedTime = '';

    if (hours > 0) {
        formattedTime = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    } else if (minutes > 0) {
        formattedTime = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    } else {
        formattedTime = ('0' + seconds).slice(-2);
    }

    countdownElement.innerText = 'Wait ' + formattedTime + ' for new code';
    countdownElement.style.color = '#4b4c4d'; // Set color to black if countdown is still active

    if (countdown > 0) {
        resendLink.style.color = 'gray';
        resendText.style.color = '#4b4c4d';
        resendLink.style.pointerEvents = 'none';
    } else {
        resendLink.style.color = '#0077b5';
        resendText.style.color = 'Black';
        resendLink.style.pointerEvents = 'auto';
    }

    setTimeout(function () {
        countdown--;

        if (countdown >= 0) {
            updateCountdown();
        } else {
            countdownElement.innerText = '';
        }
    }, 1000);
}

// Check if countdown is active
if (countdownActive) {
    var countdown = timeWait;
    console.log(countdown);

    var resendLink = document.getElementById('resendLink');
    var resendText = document.getElementById('resendText');
    var countdownElement = document.getElementById('countdown');
    updateCountdown();
}

// Add your other JavaScript functions and event listeners here
function setSubmissionSource(source) {
    document.getElementById('submissionSource').value = source;
}

document.getElementById('resendLink').addEventListener('click', function (event) {
    if (countdownActive && countdown > 0) {
        event.preventDefault();
    }
    // Trigger the form submission
    document.getElementById('verificationForm').submit();
});

function restrictToNumeric(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

function moveToNextInput(currentInput) {
    var maxLength = parseInt(currentInput.maxLength, 10);
    var currentLength = currentInput.value.length;

    if (currentLength === maxLength) {
        var nextInput = currentInput.nextElementSibling;
        if (nextInput && nextInput.tagName.toLowerCase() === 'input') {
            nextInput.focus();
        }
    }
}

function handlePaste(event) {
    // Prevent the default paste behavior
    event.preventDefault();

    // Get the pasted text from the clipboard
    var clipboardData = event.clipboardData || window.clipboardData;
    var pastedText = clipboardData.getData('text');

    // Validate the pasted text (you may want to add additional validation)
    if (/^\d{6}$/.test(pastedText)) {
        // Update each input field with a digit from the pasted text
        var inputFields = document.querySelectorAll('.digit-input');
        for (var i = 0; i < Math.min(inputFields.length, pastedText.length); i++) {
            inputFields[i].value = pastedText[i];
        }
    }
}
