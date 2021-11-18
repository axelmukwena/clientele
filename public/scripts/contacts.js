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

function handleShowClients(id, firstname, clients) {
  const title = document.querySelector('.contact-clients-title');
  title.innerHTML = `${firstname} has ${clients.length} clients`;

  const tableData = clients.map((client) => (
    `<tr>
      <td>${client.name}</td>
      <td>${client.code}</td>
      <td>
        <a href='#'>
          <i class="bi bi-x-square-fill btn remove-contact p-0 m-0"></i>
        </a>
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

// Populate clients select option
function populateSelectClient(clients) {
  const defaultOption = '<option selected>Select clients</option>';
  const selectData = clients.map((client) => (
    `<option value="${client.id}">${client.name}</option>`
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

// Before submit, update hidden elements
function submitNewContact(e) {
  const nameInput = document.getElementById('client-name-form');
  const label = document.getElementById('client-name-form-label');
  const name = nameInput.value.trim();

  // Validate form input
  const validated = validation(name, label, nameInput);
  if (!validated) {
    return;
  }

  const submit = document.getElementById('submit-add-client');
  submit.click();
}
