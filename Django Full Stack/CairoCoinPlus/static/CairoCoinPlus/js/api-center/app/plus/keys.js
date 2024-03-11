function load_keys() {
    const elementsToHide = ['#home', '#usage', '#plan', '#docs', '#account'];
    elementsToHide.forEach(element => document.querySelector(element).style.display = 'none');
    document.getElementById('reload').style.display = 'flex';
    document.querySelector('#header_data').style.display = 'flex';

    document.querySelector('#keys').innerHTML = `
    <div class="modal" id="keyWindow">
        <div class="modal-content p-3">
            <div id="edit_content">
            </div>
        </div>
    </div>

    <div class="keys-view">
        <div id="keys_table_alert" style="display:none;"></div>
        <div class="key-table-label">
            <div class="pl-4 pr-4 pb-3 pt-3">
                <div style="font-size: 1.25rem; font-weight: bold;">API keys </div>
                <div class="info">Your secret API keys are listed below. Please do not share your API key with others,
                    or
                    expose it in the browser or other client-side code. In order to protect the security of your
                    account.
                </div>
            </div>
        </div>

        <div class="key-table-card">
            <div class="pl-4 pr-4 pb-4 pt-2">
                <div class="table-responsive">
                    <table class="table text-nowrap mb-0 align-middle">
                        <thead class="text-dark fs-4">
                            <tr>
                                <th class="border-bottom-0 border-top-0">
                                    <p class="mb-0" style="font-weight: 900;">NAME</p>
                                </th>
                                <th class="border-bottom-0 border-top-0">
                                    <p class="mb-0" style="font-weight: 900;">SECRET KEY</p>
                                </th>
                                <th class="border-bottom-0 border-top-0">
                                    <p class="mb-0" style="font-weight: 900;">CREATED</p>
                                </th>
                                <th class="border-bottom-0 border-top-0">
                                    <p class="mb-0" style="font-weight: 900;">LAST USED</p>
                                </th>
                                <th class="border-bottom-0 border-top-0">
                                    <p class="mb-0" style="font-weight: 900;">TOKEN LIMIT</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="keys_table">
                            <tr id="key_table_loader">
                                <td>
                                    <p class="mb-0">
                                        <div id="card_loader">
                                            <div class="card-image">
                                                <div class="block-loader pulsate"></div>
                                            </div>
                                        </div>
                                    </p>
                                </td>
                                <td>
                                    <p class="mb-0">
                                        <div id="card_loader">
                                            <div class="card-image">
                                                <div class="block-loader pulsate"></div>
                                            </div>
                                        </div>
                                    </p>
                                </td>
                                <td>
                                    <p class="mb-0">
                                        <div id="card_loader">
                                            <div class="card-image">
                                                <div class="block-loader pulsate"></div>
                                            </div>
                                        </div>
                                    </p>
                                </td>
                                <td>
                                    <p class="mb-0">
                                        <div id="card_loader">
                                            <div class="card-image">
                                                <div class="block-loader pulsate"></div>
                                            </div>
                                        </div>
                                    </p>
                                </td>
                                <td>
                                    <p class="mb-0">
                                        <div id="card_loader">
                                            <div class="card-image">
                                                <div class="block-loader pulsate"></div>
                                            </div>
                                        </div>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-4" style="width:200px;">
        <a href="#" class="btn btn-dark btn-block" onclick="showCreateKeyWindow()">+ Create new secret key</a>
    </div>
    </div>
    `;
    document.querySelector('#keys').style.display = 'block';
    getDate();
}



async function getDate() {
    try {
        const response = await fetch(`/Plus/keys`);
        const data = await response.json();
        endReload();
        if (data.length !== 0) {
            for (let key of data) {
                const timeCreated = new Date(key.time_created);
                const lastUsed = key.last_used ? formatDate(new Date(key.last_used)) : '--';
                const truncatedKey = 'CC- . . . ' + key.key.slice(-4); // Display first 4 and last 4 characters
                const keyRow = document.createElement('tr');
                keyRow.id = 'user_key';
                keyRow.innerHTML = `
                <td>
                    <p class="mb-0">${key.name}</p>
                </td>
                <td>
                    <a class="mb-0" style="cursor: pointer;"
                        onclick="toggleFullKey(this, '${key.key}')">${truncatedKey}</a>
                    <a class="edit-icon" onclick="copyToClipboard('${key.key}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                            id="copy">
                            <path fill="#008800"
                                d="M4.00029246,4.08524952 L4,10.5 C4,11.8254834 5.03153594,12.9100387 6.33562431,12.9946823 L6.5,13 L10.9143985,13.000703 C10.7082819,13.5829319 10.1528467,14 9.5,14 L6,14 C4.34314575,14 3,12.6568542 3,11 L3,5.5 C3,4.84678131 3.41754351,4.29108512 4.00029246,4.08524952 Z M11.5,2 C12.3284271,2 13,2.67157288 13,3.5 L13,10.5 C13,11.3284271 12.3284271,12 11.5,12 L6.5,12 C5.67157288,12 5,11.3284271 5,10.5 L5,3.5 C5,2.67157288 5.67157288,2 6.5,2 L11.5,2 Z M11.5,3 L6.5,3 C6.22385763,3 6,3.22385763 6,3.5 L6,10.5 C6,10.7761424 6.22385763,11 6.5,11 L11.5,11 C11.7761424,11 12,10.7761424 12,10.5 L12,3.5 C12,3.22385763 11.7761424,3 11.5,3 Z">
                            </path>
                        </svg>
                        <div class="tooltiptext" id="copy_Key_message_${key.key}">Copy key</div>
                    </a>
                </td>
                <td>
                    <p class="mb-0">${formatDate(timeCreated)}</p>
                </td>
                <td>
                    <p class="mb-0">${lastUsed}</p>
                </td>
                <td>
                    <p class="mb-0">${key.token_limit}</p>
                </td>
                <td style="">
                    <a class="edit-icon mb-0 mr-1"
                        onclick="showEditKeyWindow('${key.key}','${key.name}','${key.token_limit}')"
                        style='font-size: 20px;'><i class='bx bx-edit' style='color:rgba(0,0,0,0.76)'></i>
                        <div class="tooltiptext">Edit key</div>
                    </a>
                    <a class="edit-icon mb-0" onclick="showRemoveKeyWindow('${key.key}','${key.name}')"
                        style='font-size: 20px;'><i class='bx bxs-x-circle' style='color:rgba(180,0,0)'></i>
                        <div class="tooltiptext">Remove key</div>
                    </a>
                </td>
            `;
                document.querySelector('#keys_table').appendChild(keyRow);
            }
        } else {
            const keyRow = document.createElement('tr');
            keyRow.id = 'user_key';
            keyRow.innerHTML = `
            <td>
                <p class="mb-0">You don't have any secret key</p>
            </td
            <td>
                <p class="mb-0"></p>
            </td>
            <td>
                <p class="mb-0"></p>
            </td>
            <td>
                <p class="mb-0"></p>
            </td>
            `;
            document.querySelector('#keys_table').appendChild(keyDiv);
        }
        document.getElementById('key_table_loader').style.display = 'none';
    } catch (error) {
        console.error('Error fetching keys data:', error);
    }
};


/**
 * Formats the given date into a string using the specified options.
 *
 * @param {Object} date - The date to be formatted
 * @return {string} The formatted date string
 */
function formatDate(date) {
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Toggles the display between a full key and a truncated key, and copies the full key to the clipboard if displayed.
 *
 * @param {Element} element - the HTML element to toggle the key display on
 * @param {string} fullKey - the full key to display and potentially copy to the clipboard
 * @return {void} 
 */
function toggleFullKey(element, fullKey) {
    if (element.textContent !== fullKey) {
        // If currently displaying truncated key, switch to full key and copy it to clipboard
        element.textContent = fullKey;
        copyToClipboard(fullKey);
    } else {
        // If currently displaying full key, revert to truncated key
        const truncatedKey = 'CC- . . . ' + fullKey.slice(-4); // Display truncated key
        element.textContent = truncatedKey;
    }
}

/**
 * Copies the given text to the clipboard and updates the content of a specific div element.
 *
 * @param {string} text - The text to be copied to the clipboard
 * @return {void} 
 */
function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px'; // Move the textarea off-screen
    document.body.appendChild(textarea);

    // Select and copy the text from the textarea
    textarea.select();
    document.execCommand('copy');

    // Remove the temporary textarea
    document.body.removeChild(textarea);
    // Get the reference to the div
    const Div = document.getElementById(`copy_Key_message_${text}`);

    // Change the content for 5 seconds
    Div.innerHTML = 'Copied';

    // After 2 seconds, revert back to the original content
    setTimeout(() => {
        Div.innerHTML = 'Copy key';
    }, 2000);
}

/**
 * Function to show the create key window with input fields and buttons.
 */
function showCreateKeyWindow() {
    var windowContent = document.getElementById('edit_content');
    windowContent.innerHTML = `
    <h4 style="font-weight: 900;">Create new secret key</h4>
    <div class="p-3">
        <div>
            <a style="font-weight: 700;">Name</a>
            <a style="color:#00000075; margin-left: 4px;">Optional</a>
        </div>
        <input type="text" class="inputForm" id="createdKeyName" onkeydown="handleKeyDown(event)" name="createdKeyName">

        <div class="mt-3">
            <a style="font-weight: 700;">Token limit</a>
            <a style="color:#00000075; margin-left: 4px;">Leaving it empty sets it to 100 automatically</a>
        </div>
        <input type="text" class="inputForm" id="createdKeyLimit" name="createdKeyLimit" inputmode="numeric"
            pattern="\d+" title="Please enter a positive integer" onkeydown="handleKeyDown(event)"
            oninput="this.value = this.value.replace(/[^0-9]/g, '');">

        <div class="row mt-4 mr-1" style="justify-content: end;">
            <div class="mr-3">
                <a href="#" class="btn btn-outline-dark btn-block" onclick="closeKeyWindow()">Cancel</a>
            </div>
            <div>
                <a href="#" class="btn btn-dark btn-block" onclick="createKeySave()" id="saveButton">Save</a>
            </div>
        </div>
    </div>
    `;
    var keyWindow = document.getElementById('keyWindow');
    keyWindow.style.display = 'block';

    var input = document.getElementById('createdKeyName');
    input.focus();
}

/**
 * Show a new key window with the given key and name.
 *
 * @param {type} key - the secret key to display
 * @param {type} name - the name associated with the secret key
 * @return {type} void
 */
function showNewKeyWindow(key, name) {
    var windowContent = document.getElementById('edit_content');
    windowContent.innerHTML = `
    <h4 style="font-weight: 900; display: inline;">Your new secret key </h4><a>${name}</a>
    <p style="color:#00000075; margin-top: 0px;">Please save this secret key somewhere safe and accessible</p>
    <div class="p-1">
        <input type="text" class="inputForm pr-1 mr-2" style="width: 80%; display: inline;" value="${key}" disabled>
        <a class="edit-icon" onclick="copyToClipboard('${key}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 16 16" id="copy">
                <path fill="#008800"
                    d="M4.00029246,4.08524952 L4,10.5 C4,11.8254834 5.03153594,12.9100387 6.33562431,12.9946823 L6.5,13 L10.9143985,13.000703 C10.7082819,13.5829319 10.1528467,14 9.5,14 L6,14 C4.34314575,14 3,12.6568542 3,11 L3,5.5 C3,4.84678131 3.41754351,4.29108512 4.00029246,4.08524952 Z M11.5,2 C12.3284271,2 13,2.67157288 13,3.5 L13,10.5 C13,11.3284271 12.3284271,12 11.5,12 L6.5,12 C5.67157288,12 5,11.3284271 5,10.5 L5,3.5 C5,2.67157288 5.67157288,2 6.5,2 L11.5,2 Z M11.5,3 L6.5,3 C6.22385763,3 6,3.22385763 6,3.5 L6,10.5 C6,10.7761424 6.22385763,11 6.5,11 L11.5,11 C11.7761424,11 12,10.7761424 12,10.5 L12,3.5 C12,3.22385763 11.7761424,3 11.5,3 Z">
                </path>
            </svg>
            <div class="tooltiptext" id="copy_Key_message_${key}">Copy key</div>
        </a>

        <div class="row mt-4 mr-1" style="justify-content: end;">
            <div>
                <a href="#" class="btn btn-dark btn-block" onclick="closeKeyWindow()">Done</a>
            </div>
        </div>
    </div>
    `;
    var keyWindow = document.getElementById('keyWindow');
    keyWindow.style.display = 'block';
}

/**
 * Show the edit key window with the given key, name, and limit.
 *
 * @param {string} key - The key to be edited
 * @param {string} name - The name of the key
 * @param {number} limit - The token limit
 */
function showEditKeyWindow(key, name, limit) {
    var windowContent = document.getElementById('edit_content');
    var keyPart = 'CC- . . . ' + key.slice(-4);
    windowContent.innerHTML = `
    <h4 style="font-weight: 900; display: inline;">Edit secret key </h4><a>${keyPart}</a>
    <p style="color:#00000075; margin-top: 0px;">Leaving an input empty will keep it's original value</p>
    <div class="p-3">
        <div>
            <a style="font-weight: 700;">Name</a>
        </div>
        <input type="text" class="inputForm" id="keyNewName" name="keyNewName" value="${name}"
            onkeydown="handleKeyDown(event)">

        <div class="mt-3">
            <a style="font-weight: 700;">Token limit</a>
        </div>
        <input type="text" class="inputForm" id="keyNewLimit" name="keyNewLimit" value="${limit}" inputmode="numeric"
            pattern="\d+" title="Please enter a positive integer" onkeydown="handleKeyDown(event)"
            oninput="this.value = this.value.replace(/[^0-9]/g, '');">

        <div class="row mt-4 mr-1" style="justify-content: end;">
            <div class="mr-3">
                <a href="#" class="btn btn-outline-dark btn-block" onclick="closeKeyWindow()">Cancel</a>
            </div>
            <div>
                <a href="#" class="btn btn-dark btn-block" onclick="editKeySave('${key}')" id="saveButton">Save</a>
            </div>
        </div>
    </div>
    `;
    var keyWindow = document.getElementById('keyWindow');
    keyWindow.style.display = 'block';

    var input = document.getElementById('keyNewName');
    input.focus();
    input.select();
}

function showRemoveKeyWindow(key, name) {
    var windowContent = document.getElementById('edit_content');
    var keyPart = 'CC- . . . ' + key.slice(-4);
    windowContent.innerHTML = `
    <h4 style="font-weight: 900;">Remove secret key </h4>
    <div class="p-3">
        <div>
            This API key will immediately stop. API requests made using this key will be rejected, which could cause any
            systems still depending on it to break. Once removed, you'll no longer be able to view or modify this API
            key.
        </div>
        <input type="text" class="inputForm" value="${name} | ${keyPart}" disabled>

        <div class="row mt-4 mr-1" style="justify-content: end;">
            <div class="mr-3">
                <a href="#" class="btn btn-outline-dark btn-block" onclick="closeKeyWindow()">Cancel</a>
            </div>
            <div>
                <a href="#" class="btn btn-dark btn-block" onclick="removeKeySave('${key}')">Remove</a>
            </div>
        </div>
    </div>
    `;
    var keyWindow = document.getElementById('keyWindow');
    keyWindow.style.display = 'block';
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
        document.getElementById('saveButton').click(); // Programmatically click the Save button
    }
}

function closeKeyWindow() {
    var keyWindow = document.getElementById('keyWindow');
    keyWindow.style.display = 'none';
}

function editKeySave(key) {
    const newName = document.getElementById('keyNewName').value;
    const newLimit = document.getElementById('keyNewLimit').value;
    fetch('/Plus/keys', {
        method: 'PUT',
        body: JSON.stringify({
            key: key,
            name: newName,
            limit: newLimit,
        }),
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.error) {
                keysTableAlert(result.error, true);
                getDate();
            } else {
                keysTableAlert('Secret key updated successfully');
                getDate();
            }
        });
    afterSubmitWindow();
}

function removeKeySave(key) {
    fetch('/Plus/keys', {
        method: 'DELETE',
        body: JSON.stringify({
            key: key,
        }),
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.error) {
                keysTableAlert(result.error, true);
                getDate();
            } else {
                keysTableAlert('secret key removed successfully');
                getDate();
            }
        });
    afterSubmitWindow();
}

function createKeySave() {
    const keyName = document.getElementById('createdKeyName').value;
    const keyLimit = document.getElementById('createdKeyLimit').value;
    fetch('/Plus/keys', {
        method: 'POST',
        body: JSON.stringify({
            name: keyName,
            limit: keyLimit,
        }),
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.error) {
                keysTableAlert(result.error, true);
                getDate();
            } else {
                showNewKeyWindow(result.key, keyName);
                keysTableAlert('New secret key created successfully');
                getDate();
            }
        });
    afterSubmitWindow();
}

function afterSubmitWindow() {
    var alertDiv = document.getElementById('keys_table_alert');
    alertDiv.style.display = 'none';

    var table = document.querySelector('#keys_table');
    var keyElements = document.querySelectorAll('#user_key');
    var keysArray = Array.from(keyElements);

    keysArray.forEach(function (key) {
        table.removeChild(key);
    });

    closeKeyWindow();
    document.getElementById('key_table_loader').style.display = 'contents';
}

function keysTableAlert(report, error = false) {
    const alertDiv = document.getElementById('keys_table_alert');
    alertDiv.className = error ? 'key-table-alert-error' : 'key-table-alert-success';
    alertDiv.innerHTML = `<div class="py-1 px-3">${report}</div>`;
    alertDiv.style.display = 'block';

    setTimeout(() => {
        alertDiv.className += ' keys-alert-close';
    }, 5000);
    // After 5 seconds, revert back to the original content
    setTimeout(() => {
        alertDiv.className = '';
        alertDiv.innerHTML = '';
    }, 6500);
}
