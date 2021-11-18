/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

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

function showClientsContacts(id, name, contactsID) {
  console.log(name, contactsID.split(','));

  // Highlight selected row
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

function showAddClientForm() {
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

  const submit = document.getElementById('submit-add-client');
  submit.click();
}
