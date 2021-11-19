/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

function closeContactSideBar() {
  // Adjust contactList panel
  const contactList = document.querySelector('.contact-list');
  contactList.style.width = '100%';

  // Make sure contactAdd is not showing/Active
  const contactAdd = document.querySelector('.contact-add');
  contactAdd.style.width = '0%';
  contactAdd.style.display = 'none';

  // Make sure contactClients is not showing/Active
  const contactClients = document.querySelector('.contact-clients');
  contactClients.style.width = '0%';
  contactClients.style.display = 'none';
}

// Helper to show list of clients on contact's click
function handleShowClients(contactID, firstname, clients) {
  const title = document.querySelector('.contact-clients-title');
  const table = document.querySelector('.clients-table');

  if (clients.length > 0) {
    title.innerHTML = `${firstname} has ${clients.length} clients`;
    table.style.display = 'table';
  } else {
    title.innerHTML = 'No clients found.';
    table.style.display = 'none';
  }

  const tableData = clients.map((client) => (
    `<tr>
      <td>${client.name}</td>
      <td>${client.code}</td>
      <td>
        <form action="/contacts/unlink" method="POST">
          <input type="text" value="${contactID}" name="contactID" hidden>
          <input type="text" value="${client._id}" name="clientID" hidden>
          <button onclick="loading(event)" type="submit" class="btn" style="padding: 0;">
            <a href="/clients/unlink" style="color: black;">
              <i class="bi bi-x-square-fill remove-client p-0 m-0"></i>
            </a>
          </button>
        </form>
      </td>
    </tr>`
  )).join('');
  const tableBody = document.querySelector('.client-table-tbody');
  tableBody.innerHTML = tableData;
}

function showContactsClients(id, firstname, clients) {
  clients = JSON.parse(clients);

  // Highlight selected row
  const activeContact = document.querySelector('.active-contact');
  if (activeContact) {
    activeContact.className = '';
  }
  document.getElementById(id).className = 'active-contact';

  handleShowClients(id, firstname, clients);

  // Adjust contactList panel
  const contactList = document.querySelector('.contact-list');
  contactList.style.width = '60%';

  // Make sure contactAdd is not showing/Active
  const contactAdd = document.querySelector('.contact-add');
  contactAdd.style.width = '0%';
  contactAdd.style.display = 'none';

  // Make sure contactClients is not showing/Active
  const contactClients = document.querySelector('.contact-clients');
  contactClients.style.width = '38%';
  contactClients.style.display = 'block';
}

// Remove client from added list
function removeAddedClient(id) {
  const client = document.getElementById(id);
  client.parentNode.removeChild(client);
}

// get the value of the selected option and add a client below
function selectClient() {
  const select = document.querySelector('.select-clients');
  const { value } = select.options[select.selectedIndex];

  if (value) {
    const client = JSON.parse(value);
    const addedClient = `<div id='client-${client._id}' class='card added-client'>
  <div class="d-flex justify-content-between">
        <small class='added-client-item'>
          <span style='padding-right: 20px;'>${client.name}</span>
          <span>Code: ${client.code}</span>
        </small>
        <small class='added-client-item'>
          <i onclick="removeAddedClient('client-${client._id}')" class="bi bi-x-square-fill btn remove-client p-0 m-0"></i>
        </small>
      </div>
      <input type="text" value='${client._id}' name="clients[]" hidden>
    </div>`;

    const addedClients = document.querySelector('.added-clients');
    addedClients.innerHTML += addedClient;
  }
}

// Populate clients select option
function populateSelectClient(clients) {
  const defaultOption = '<option value="">Select clients</option>';
  const selectData = clients.map((client) => (
    `<option id="option-${client._id}" value='${JSON.stringify(client)}'>${client.name}</option>`
  )).join('');
  const select = document.querySelector('.select-clients');
  select.innerHTML = defaultOption + selectData;
}

function showAddContactForm(clients) {
  // Populate clients select option
  clients = JSON.parse(clients);
  populateSelectClient(clients);

  // Adjust contactList panel
  const contactList = document.querySelector('.contact-list');
  contactList.style.width = '60%';

  // Make sure contactClients is not showing/Active
  const contactClients = document.querySelector('.contact-clients');
  contactClients.style.width = '0%';
  contactClients.style.display = 'none';

  // Make sure contactAdd is not showing/Active
  const contactAdd = document.querySelector('.contact-add');
  contactAdd.style.width = '38%';
  contactAdd.style.display = 'block';
}

function emailValidation(email, label, input) {
  // Empty field validation
  if (email.length === 0) {
    label.innerHTML = 'Email cannot be empty.';
    label.className = 'form-label-error';
    input.className = 'form-control error';
    return false;
  }

  // Email pattern validation
  const pattern = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
  if (!pattern.test(email)) {
    label.innerHTML = 'Email incorrect format';
    label.className = 'form-label-error';
    input.className = 'form-control error';
    return false;
  }

  // Default, correct validation
  label.innerHTML = 'Email';
  label.className = '';
  input.className = 'form-control';
  return true;
}

function nameValidation(key, name, label, input) {
  // Empty field validation
  if (name.length === 0) {
    label.innerHTML = `${key} cannot be empty.`;
    label.className = 'form-label-error';
    input.className = 'form-control error';
    return false;
  }

  // Default, correct validation
  label.innerHTML = key;
  label.className = '';
  input.className = 'form-control';
  return true;
}

// Before submit, update hidden elements
function submitNewContact(e) {
  // Validate firstname form input
  const firstNameInput = document.getElementById('contact-firstname-form');
  const firstNameLabel = document.getElementById('contact-firstname-form-label');
  const firstName = firstNameInput.value.trim();
  firstNameInput.value = firstName;

  let validated = nameValidation('Firstname', firstName, firstNameLabel, firstNameInput);
  if (!validated) {
    return;
  }

  // Validate surname form input
  const surnameInput = document.getElementById('contact-surname-form');
  const surnameLabel = document.getElementById('contact-surname-form-label');
  const surname = surnameInput.value.trim();
  surnameInput.value = surname;

  validated = nameValidation('Surnname', surname, surnameLabel, surnameInput);
  if (!validated) {
    return;
  }

  // Validate email form input
  const emailInput = document.getElementById('contact-email-form');
  const emailLabel = document.getElementById('contact-email-form-label');
  const email = emailInput.value.trim();
  emailInput.value = email;

  validated = emailValidation(email, emailLabel, emailInput);
  if (!validated) {
    return;
  }

  const submit = document.getElementById('submit-add-contact');
  submit.click();
}
