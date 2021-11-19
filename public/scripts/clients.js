/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

// when you click the close/x on the side bar
function closeClientSideBar() {
  // Adjust clientList panel
  const clientList = document.querySelector('.client-list');
  clientList.style.width = '100%';

  // Make sure clientAdd is not showing/Active
  const clientAdd = document.querySelector('.client-add');
  clientAdd.style.width = '0%';
  clientAdd.style.display = 'none';

  // Make sure clienContacts is not showing/Active
  const clientContacts = document.querySelector('.client-contacts');
  clientContacts.style.width = '0%';
  clientContacts.style.display = 'none';
}

// Helper to show the list of contacts when a client is click
function handleShowContacts(clientID, name, contacts) {
  const title = document.querySelector('.client-contacts-title');
  const table = document.querySelector('.contacts-table');

  // Toggle table vissibility based on clients count
  if (contacts.length > 0) {
    title.innerHTML = `${name} has ${contacts.length} contacts`;
    table.style.display = 'table';
  } else {
    title.innerHTML = 'No contacts found.';
    table.style.display = 'none';
    return;
  }

  // Dynamically generating tables, contacts for a client
  const tableData = contacts.map((contact) => (
    `<tr">
      <td>${contact.surname}</td>
      <td>${contact.firstname}</td>
      <td>${contact.email}</td>
      <td>
        <form action="/clients/unlink" method="POST">
          <input type="text" value="${clientID}" name="clientID" hidden>
          <input type="text" value="${contact._id}" name="contactID" hidden>
          <button type="submit" class="btn" style="padding: 0;">
            <a href="/clients/unlink" style="color: black;">
              <i class="bi bi-x-square-fill remove-contact p-0 m-0"></i>
            </a>
          </button>
        </form>
      </td>
    </tr>`
  )).join('');
  const tableBody = document.querySelector('.contact-table-tbody');
  tableBody.innerHTML = tableData;
}

// Called when you click on a client
function showClientsContacts(id, name, contacts) {
  contacts = JSON.parse(contacts);

  // Highlight selected card
  const activeClient = document.querySelector('.active-client');
  if (activeClient) {
    activeClient.className = 'card shadow-sm';
  }
  document.getElementById(id).className = 'active-client card shadow-sm';

  handleShowContacts(id, name, contacts);

  // Adjust clientList panel
  const clientList = document.querySelector('.client-list');
  clientList.style.width = '60%';

  // Make sure clientAdd is not showing/Active
  const clientAdd = document.querySelector('.client-add');
  clientAdd.style.width = '0%';
  clientAdd.style.display = 'none';

  // Enable clientContacts view
  const clientContacts = document.querySelector('.client-contacts');
  clientContacts.style.width = '38%';
  clientContacts.style.display = 'block';
}

// Remove client from added list
function removeAddedContact(id) {
  const client = document.getElementById(id);
  client.parentNode.removeChild(client);
}

// get the value of the selected option and append a contact
function selectContact() {
  const select = document.querySelector('.select-contacts');
  const { value } = select.options[select.selectedIndex];

  if (value) {
    const contact = JSON.parse(value);
    const addedContact = `<div id='contact-${contact._id}' class='card added-contact'>
  <div class="d-flex justify-content-between">
        <small class='added-contact-item'>
          <span style='padding-right: 20px;'>${contact.surname} ${contact.firstname}</span>
          <span>${contact.email}</span>
        </small>
        <small class='added-contact-item'>
          <i onclick="removeAddedContact('contact-${contact._id}')" class="bi bi-x-square-fill btn remove-client p-0 m-0"></i>
        </small>
      </div>
      <input type="text" value='${contact._id}' name="contacts[]" hidden>
    </div>`;

    const addedContacts = document.querySelector('.added-contacts');
    addedContacts.innerHTML += addedContact;
  }
}

// Populate clients select option
function populateSelectContact(contacts) {
  const defaultOption = '<option value="">Select contacts</option>';
  const selectData = contacts.map((contact) => (
    `<option id="option-${contact._id}" value='${JSON.stringify(contact)}'>${contact.surname} ${contact.firstname}</option>`
  )).join('');
  const select = document.querySelector('.select-contacts');
  select.innerHTML = defaultOption + selectData;
}

function showAddClientForm(contacts) {
  // Populate contacts select option
  contacts = JSON.parse(contacts);
  populateSelectContact(contacts);

  // Adjust clientList panel
  const clientList = document.querySelector('.client-list');
  clientList.style.width = '60%';

  // Make sure clienContacts is not showing/Active
  const clientContacts = document.querySelector('.client-contacts');
  clientContacts.style.width = '0%';
  clientContacts.style.display = 'none';

  // Enable clientAdd view
  const clientAdd = document.querySelector('.client-add');
  clientAdd.style.width = '38%';
  clientAdd.style.display = 'block';
}

function createCode(name) {
  // Split by spaces
  const itemsOld = name.split(/\s+/);
  const items = [];
  for (let i = 0; i < itemsOld.length; i += 1) {
    if (itemsOld[i].length > 0) {
      items.push(itemsOld[i]);
    }
  }

  // Depending on the length of the name,
  // parse to get 3 Characters
  // The name input should be 3 characters or more
  let code;
  if (items.length > 2) {
    code = items[0][0] + items[1][0] + items[2][0];
    return code;
  } if (items.length === 2) {
    if (items[1].length > 1) {
      code = items[0][0] + items[1][0] + items[1][1];
    } else if (items[0].length > 1) {
      code = items[0][0] + items[0][1] + items[1][0];
    }
    return code;
  } if (items[0].length > 2) {
    code = items[0][0] + items[0][1] + items[0][2];
    return code;
  }
  return name;
}

function validation(name, label, nameInput) {
  // Empty field validation
  if (name.length === 0) {
    label.innerHTML = 'Name cannot be empty.';
    label.className = 'form-label-error';
    nameInput.className = 'form-control error';
    return false;
  }

  // Alphanumeric validation
  const pattern = /[^a-zA-Z0-9 ]/gi;
  if (pattern.test(name)) {
    label.innerHTML = 'Characters not allowed';
    label.className = 'form-label-error';
    nameInput.className = 'form-control error';
    return false;
  }

  // Not enough characters validation
  if (name.length < 3) {
    label.innerHTML = 'Name should have 3 or more characters';
    label.className = 'form-label-error';
    nameInput.className = 'form-control error';
    return false;
  }

  // Default, correct validation
  label.innerHTML = 'Enter client name';
  label.className = '';
  nameInput.className = 'form-control';
  return true;
}

// Called when you click submit to create new client
// Before submit, update hidden elements
function submitNewClient(e) {
  const nameInput = document.getElementById('client-name-form');
  const label = document.getElementById('client-name-form-label');
  const name = nameInput.value.trim();

  // Validate form input
  const validated = validation(name, label, nameInput);
  if (!validated) {
    return;
  }

  // Create a code based on the name
  const code = createCode(name).toUpperCase();

  // Update code value
  const codeElement = document.getElementById('client-code-form');
  codeElement.value = code;

  // Finally, submit
  const submit = document.getElementById('submit-add-client');
  submit.click();
}
