/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

// Toasting/flashing notifications set
function handleNotification(classType, message) {
  const container = document.getElementById('toast-flash');
  container.className = `toast align-items-center text-white bg-${classType} border-0`;

  const body = document.getElementById('toast-body');
  body.innerHTML = message;

  // eslint-disable-next-line no-undef
  const toast = new bootstrap.Toast(
    document.querySelector('.toast'),
    { autohide: false },
  );

  toast.show();
}

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

// Unlink contact from client
function unlinkContact(name, clientID, contactID) {
  const data = { contactID, clientID };

  $.ajax({
    url: '/clients/unlink',
    data,
    method: 'POST',
  }).then((response) => {
    handleNotification(response.class, response.message);
    if (response.success) {
      // Remove unlinked client from showContactsClients table
      const unlinked = document.getElementById(`linked-${contactID}`);
      unlinked.parentNode.removeChild(unlinked);

      // Reduce client count of contact
      const contactCountElement = document.getElementById(`client-contact-count-${clientID}`);
      let count = contactCountElement.innerHTML;
      count = parseInt(count, 10) - 1;
      contactCountElement.innerHTML = count;

      const title = document.querySelector('.client-contacts-title');
      title.innerHTML = `${name} has ${count} contacts(s)`;
    }
  });
}

// Helper to show the list of contacts when a client is click
function handleShowContacts(clientID, name, contacts) {
  const title = document.querySelector('.client-contacts-title');
  const table = document.querySelector('.contacts-table');

  // Toggle table vissibility based on clients count
  if (contacts.length > 0) {
    title.innerHTML = `${name} has ${contacts.length} contact(s)`;
    table.style.display = 'table';
  } else {
    title.innerHTML = 'No contact(s) found.';
    table.style.display = 'none';
    return;
  }

  // Dynamically generating tables, contacts for a client
  const tableData = contacts.map((contact) => (
    `<tr id="linked-${contact._id}">
      <td>${contact.surname}</td>
      <td>${contact.firstname}</td>
      <td>${contact.email}</td>
      <td>
        <button onclick="unlinkContact( '${name}', '${clientID}', '${contact._id}')" type="button" class="btn" style="padding: 0;">
            <i class="bi bi-x-square-fill remove-client p-0 m-0"></i>
          </button>
      </td>
    </tr>`
  )).join('');
  const tableBody = document.querySelector('.client-contacts-tbody');
  tableBody.innerHTML = tableData;
}

// Called when you click on a client
function showClientsContacts(id) {
  // Get all the contacts associated with the client
  const data = { id };
  $.ajax({
    url: '/client',
    data,
    method: 'POST',
  }).then((response) => {
    if (response.success) {
      const { contacts } = response.client;
      const { name } = response.client;
      handleShowContacts(id, name, contacts);
    }
  });

  // Highlight selected card
  const activeClient = document.querySelector('.active-client');
  if (activeClient) {
    activeClient.className = 'card shadow-sm';
  }
  document.getElementById(id).className = 'active-client card shadow-sm';

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
function removeTempAddedContact(id) {
  const client = document.getElementById(id);
  client.parentNode.removeChild(client);
}

// get the value of the selected option and append a contact
function selectContact() {
  const select = document.querySelector('.select-contacts');
  const { value } = select.options[select.selectedIndex];

  if (!value) return;

  const contact = JSON.parse(value);

  // Check if client already added (temp)
  const element = document.getElementById(`contact-${contact._id}`);
  if (element) {
    handleNotification('warning', `${contact.email} already added!`);
    return;
  }

  const addedContact = `<div id='contact-${contact._id}' class='card added-contact'>
  <div class="d-flex justify-content-between">
        <small class='added-contact-item'>
          <span style='padding-right: 20px;'>${contact.surname} ${contact.firstname}</span>
          <span>${contact.email}</span>
        </small>
        <small class='added-contact-item'>
          <i onclick="removeTempAddedContact('contact-${contact._id}')" class="bi bi-x-square-fill btn remove-client p-0 m-0"></i>
        </small>
      </div>
      <input type="text" value='${contact._id}' name="contacts[]" hidden>
    </div>`;

  const addedContacts = document.querySelector('.added-contacts');
  addedContacts.innerHTML += addedContact;
}

// Populate clients select option
function populateSelectContact(contacts) {
  const defaultOption = '<option value="">Select contacts</option>';
  const selectData = contacts.map((contact) => (
    `<option id="option-${contact._id}" value='${JSON.stringify(contact)}'>
      ${contact.surname} ${contact.firstname}&nbsp;&nbsp;-&nbsp;&nbsp;${contact.email}
    </option>`
  )).join('');
  const select = document.querySelector('.select-contacts');
  select.innerHTML = defaultOption + selectData;
}

// Creating new client
function showAddClientForm() {
  // Get populate clients
  $.ajax({
    url: '/populate/contacts',
  }).then((response) => {
    if (response.success) {
      const { contacts } = response;
      // Populate contacts select option
      populateSelectContact(contacts);
    }
  });

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
function submitNewClient() {
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

  // Get added contacts
  const contacts = [];
  const newClientForm = document.getElementById('new-client-form');
  const addedContacts = newClientForm.elements['contacts[]'];
  if (addedContacts) {
    for (let i = 0; i < addedContacts.length; i += 1) {
      contacts.push(addedContacts[i].value);
    }
  }

  const data = {
    name, code, contacts,
  };

  $.ajax({
    url: '/clients/create',
    data,
    method: 'POST',
  }).then((response) => {
    handleNotification(response.class, response.message);

    // Append new contact to tbody
    if (response.success) {
      const { client } = response;
      const cleintHtml = `<div id='${client._id}' onclick="showClientsContacts('${client._id}', '${client.name}')" class="card shadow-sm">
        <strong>${client.name}</strong>
        <hr/>
        <small>Code: ${client.code}</small>
        <small>Contacts:
          <span id="client-contact-count-${client._id}">${client.contacts.length}</span>
        </small>
        </div>`;
      const clientListBody = document.querySelector('.client-list-body');
      clientListBody.innerHTML += cleintHtml;

      // Remove all the entries
      newClientForm.reset();

      const addedContactsContainer = document.querySelector('.added-contacts');
      addedContactsContainer.innerHTML = '';
    }
  });
}
