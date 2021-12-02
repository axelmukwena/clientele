/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

/* -------------------------- Notification -------------------------- */

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

/* -------------------------- User Interaction -------------------------- */

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

/* -------------------------- Contact's Clients -------------------------- */

// Unlink client from contact
function unlinkClient(firstname, contactID, clientID) {
  const data = { contactID, clientID };

  $.ajax({
    url: '/contacts/unlink',
    data,
    method: 'POST',
  }).then((response) => {
    handleNotification(response.class, response.message);
    if (response.success) {
      // Remove unlinked client from showContactsClients table
      const unlinked = document.getElementById(`linked-${clientID}`);
      unlinked.parentNode.removeChild(unlinked);

      // Reduce client count of contact
      const clientCountElement = document.getElementById(`contact-client-count-${contactID}`);
      let count = clientCountElement.innerHTML;
      count = parseInt(count, 10) - 1;
      clientCountElement.innerHTML = count;

      const title = document.querySelector('.contact-clients-title');
      title.innerHTML = `${firstname} has ${count} client(s)`;
    }
  });
}

// Helper to show the list of clients when a contact is clicked
function handleShowClients(contactID, firstname, clients) {
  const title = document.querySelector('.contact-clients-title');
  const table = document.querySelector('.clients-table');

  // Toggle table vissibility based on clients count
  if (clients.length > 0) {
    title.innerHTML = `${firstname} has ${clients.length} client(s)`;
    table.style.display = 'table';
  } else {
    title.innerHTML = 'No client(s) found.';
    table.style.display = 'none';
  }

  // Table to populate cleints belonging to selected contact
  const tableData = clients.map((client) => (
    `<tr id="linked-${client._id}">
      <td>${client.name}</td>
      <td>${client.code}</td>
      <td>
        <button onclick="unlinkClient( '${firstname}', '${contactID}', '${client._id}')" type="button" class="btn" style="padding: 0;">
            <i class="bi bi-x-square-fill remove-client p-0 m-0"></i>
          </button>
      </td>
    </tr>`
  )).join('');
  const tableBody = document.querySelector('.contact-clients-tbody');
  tableBody.innerHTML = tableData;
}

// Called when you click on a contact
function showContactsClients(id) {
  // Get all the clients associated with the contact
  const data = { id };
  $.ajax({
    url: '/contact',
    data,
    method: 'POST',
  }).then((response) => {
    if (response.success) {
      const { clients } = response.contact;
      const { firstname } = response.contact;
      handleShowClients(id, firstname, clients);
    }
  });

  // Highlight selected row
  const activeContact = document.querySelector('.active-contact');
  if (activeContact) {
    activeContact.className = '';
  }
  document.getElementById(id).className = 'active-contact';

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

/* -------------------------- New Contact -------------------------- */

// Remove client from temporarily added list
function removeTempAddedClient(id) {
  const client = document.getElementById(id);
  client.parentNode.removeChild(client);
}

// get the value of the selected option and append a client
function selectClient() {
  const select = document.querySelector('.select-clients');
  const { value } = select.options[select.selectedIndex];

  if (!value) return;

  const client = JSON.parse(value);

  // Check if client already added (temp)
  const element = document.getElementById(`client-${client._id}`);
  if (element) {
    handleNotification('warning', `${client.code} already added!`);
    return;
  }

  const addedClient = `<div id='client-${client._id}' class='card added-client'>
    <div class="d-flex justify-content-between">
        <small class='added-client-item'>
          <span style='padding-right: 20px;'>${client.name}</span>
          <span>Code: ${client.code}</span>
        </small>
        <small class='added-client-item'>
          <i onclick="removeTempAddedClient('client-${client._id}')" class="bi bi-x-square-fill btn remove-client p-0 m-0"></i>
        </small>
      </div>
      <input type="text" value='${client._id}' name="clients[]" hidden>
    </div>`;

  const addedClients = document.querySelector('.added-clients');
  addedClients.innerHTML += addedClient;
}

// Populate clients select option
function populateSelectClient(clients) {
  const defaultOption = '<option value="">Select clients</option>';
  const selectData = clients.map((client) => (
    `<option id="option-${client._id}" value='${JSON.stringify(client)}'>${client.name}&nbsp;&nbsp;-&nbsp;&nbsp;${client.code}</option>`
  )).join('');
  const select = document.querySelector('.select-clients');
  select.innerHTML = defaultOption + selectData;
}

// Creating a new contact
function showAddContactForm() {
  // Get populate clients
  $.ajax({
    url: '/populate/clients',
  }).then((response) => {
    if (response.success) {
      const { clients } = response;
      // Populate clients select option
      populateSelectClient(clients);
    }
  });

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

/* -------------------------- New Contact Submit -------------------------- */

// Validate email format
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
function submitNewContact() {
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

  // Get added clients
  const clients = [];
  const newContactForm = document.getElementById('new-contact-form');
  const addedClients = newContactForm.elements['clients[]'];
  if (addedClients) {
    for (let i = 0; i < addedClients.length; i += 1) {
      clients.push(addedClients[i].value);
    }
  }

  const data = {
    firstname: firstName, surname, email, clients,
  };

  $.ajax({
    url: '/contacts/create',
    data,
    method: 'POST',
  }).then((response) => {
    handleNotification(response.class, response.message);

    // Append new contact to tbody
    if (response.success) {
      const { contact } = response;
      const contactHtml = `<tr id='${contact._id}' onclick="showContactsClients('${contact._id}')" style="cursor: pointer;">
            <td>${contact.surname}</td>
            <td>${contact.firstname}</td>
            <td>${contact.email}</td>
            <td id="contact-client-count-${contact._id}" style='text-align: center;'>${contact.clients.length}</td>
          </tr>`;
      const tableBody = document.querySelector('.contact-tbody');
      tableBody.innerHTML += contactHtml;

      // Remove all the entries
      newContactForm.reset();

      const addedClientsContainer = document.querySelector('.added-clients');
      addedClientsContainer.innerHTML = '';
    }
  });
}
