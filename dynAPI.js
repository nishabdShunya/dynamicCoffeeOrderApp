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

        // Adding order to server
        axios.post('https://crudcrud.com/api/95b1783b7d2b428caf6163fe07e614c5/orders', orderObj)
            .then((response) => {
                displayOnScreen(response.data);  // for displaying response on screen
            })
            .catch((error) => {
                document.body.innerHTML += `<h3 id="error">Error: Something Went Wrong (${error})</h3>`;  // for displaying error on screen
            })

        // Clearing the fields
        inputName.value = '';
        inputMail.value = '';
    } else {
        alert('Please enter all the input fields.');
    }
}

function displayOnScreen(responseObj) {
    const orderItem = ` <li id="${responseObj._id}">
                                <p>${responseObj.username} | ${responseObj.email}</p>
                                <div>
                                    <button onclick="cancelOrder('${responseObj._id}')">CANCEL</button>
                                    <button onclick="editOrder('${responseObj._id}', '${responseObj.username}', '${responseObj.email}')">MODIFY</button>
                                </div>
                            </li>`;
    orders.innerHTML += orderItem;
}

function cancelOrder(id) {
    axios.delete('https://crudcrud.com/api/95b1783b7d2b428caf6163fe07e614c5/orders/' + id)
        .then((response) => {
            removeFromScreen(id);
        })
        .catch((error) => {
            document.body.innerHTML += `<h3 id="error">Unable to cancel the order. (${error})</h3>`;
        })
}

function removeFromScreen(id) {
    const orderCancelled = document.getElementById(id);
    orders.removeChild(orderCancelled);
}

/* OLD Method for updating/editing the coffee order
function editOrder(id, username, email) {
    cancelOrder(id);
    inputName.value = username;
    inputMail.value = email;
}
*/

// AXIOS-PUT Method for updating/editing the coffee order
function editOrder(id, oldUsername, oldEmail) {
    axios.put('https://crudcrud.com/api/95b1783b7d2b428caf6163fe07e614c5/orders/' + id, {
        username: oldUsername,
        email: oldEmail
    })
        .then((putResponse) => {
            cancelOrder(id);
            axios.get('https://crudcrud.com/api/95b1783b7d2b428caf6163fe07e614c5/orders/' + id)
                .then((getResponse) => {
                    inputName.value = getResponse.data.username;
                    inputMail.value = getResponse.data.email;
                })
                .catch((error) => {
                    document.body.innerHTML += `<h3 id="error">Error: Unable to get the data. (${error})</h3>`;
                })
        })
        .catch((error) => {
            document.body.innerHTML += `<h3 id="error">Error: Unable to update the data. (${error})</h3>`;
        })
}

// Doing this thing so that data does not go away from the screen on refreshing the webpage
window.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    axios.get('https://crudcrud.com/api/95b1783b7d2b428caf6163fe07e614c5/orders')
        .then((response) => {
            response.data.forEach(element => {
                displayOnScreen(element);
            });
        })
        .catch((error) => {
            document.body.innerHTML += `<h3 id="error">Error Loading the DOM (${error})</h3>`;
        })
})