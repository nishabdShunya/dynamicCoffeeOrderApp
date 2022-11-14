const form = document.querySelector('#coffee-form');
const inputName = document.querySelector('#username');
const inputMail = document.querySelector('#email');
const submit = document.querySelector('#submit');
const orders = document.querySelector('#orders');

form.addEventListener('submit', addOrder);

function addOrder(event) {
    event.preventDefault();
    if (inputName.value && inputMail.value) {
        // Creating an order object
        const orderObj = {
            username: inputName.value,
            email: inputMail.value
        }

        // Adding order to local storage
        localStorage.setItem(`${orderObj.email}`, JSON.stringify(orderObj));

        // Calling a function to add order on to the screen
        displayOnScreen(orderObj);

        // Clearing the fields
        inputName.value = '';
        inputMail.value = '';
    } else {
        alert('Please enter all the input fields.');
    }
}

function displayOnScreen(orderObj) {
    const orderItem = ` <li id="${orderObj.email}">
                                <p>${orderObj.username} | ${orderObj.email}</p>
                                <div>
                                    <button onclick="cancelOrder('${orderObj.email}')">CANCEL</button>
                                    <button onclick="editOrder('${orderObj.username}', '${orderObj.email}')">MODIFY</button>
                                </div>
                            </li>`;
    orders.innerHTML += orderItem;
}

function cancelOrder(email) {
    localStorage.removeItem(email);
    removeFromScreen(email);
}

function removeFromScreen(email) {
    const orderCancelled = document.getElementById(email);
    orders.removeChild(orderCancelled);
}

function editOrder(username, email) {
    cancelOrder(email);
    inputName.value = username;
    inputMail.value = email;
}

// Doing this thing so that data does not go away from the screen on refreshing the webpage
window.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    Object.keys(localStorage).forEach((key) => {
        displayOnScreen(JSON.parse(localStorage[key]));
    })
})