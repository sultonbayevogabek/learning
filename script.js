const listGroup = document.querySelector('.list-group')
const createUserForm = document.querySelector('#create-form')
const firstNameInput = createUserForm.querySelector('#first_name')
const lastNameInput = createUserForm.querySelector('#last_name')
const emailInput = createUserForm.querySelector('#email')
const birthdateInput = createUserForm.querySelector('#birthdate')
const usernameInput = createUserForm.querySelector('#username')
const phoneInput = createUserForm.querySelector('#phone')
const message = createUserForm.querySelector('.message')

const editUserForm = document.querySelector('#edit-form')
const idInputE = editUserForm.querySelector('#id')
const firstNameInputE = editUserForm.querySelector('#first_name_e')
const lastNameInputE = editUserForm.querySelector('#last_name_e')
const emailInputE = editUserForm.querySelector('#email_e')
const birthdateInputE = editUserForm.querySelector('#birthdate_e')
const usernameInputE = editUserForm.querySelector('#username_e')
const phoneInputE = editUserForm.querySelector('#phone_e')

createUserForm.addEventListener('submit', async e => {
    e.preventDefault()

    let newUser = {
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        email: emailInput.value,
        birthdate: birthdateInput.value,
        username: usernameInput.value,
        phone_number: phoneInput.value
    }

    let response = await fetch('http://localhost:3000/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
    })
    response = await response.json()
    await getUserList()
    message.innerHTML = `<div class="alert text-center ${response.message === 'New user created' ? 'alert-success' : 'alert-warning'}">${ response.message }</div>`
})

editUserForm.addEventListener('submit', async e => {
    e.preventDefault()

    const editedData = {
        id: idInputE.value,
        first_name: firstNameInputE.value,
        last_name: lastNameInputE.value,
        email: emailInputE.value,
        birthdate: birthdateInputE.value,
        username: usernameInputE.value,
        phone_number: phoneInputE.value
    }

    let response = await fetch('http://localhost:3000/edit', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(editedData)
    })
    response = await response.json()
    if (response.message === 'User edited') {
        window.location.reload()
    }
})

async function getUserList() {
    let response = await fetch('http://localhost:3000/users', {
        method: 'GET'
    })
    response = await response.json()
    listGroup.innerHTML = ''
    response.users.forEach(item => {
        listGroup.innerHTML += `
            <li class="list-group-item d-flex justify-content-between">
                <div>
                    <p class="mb-1"><strong>Firstname: </strong><span>${item.first_name}</span></p>
                    <p class="mb-1"><strong>Lastname: </strong><span>${item.last_name}</span></p>
                    <p class="mb-1"><strong>Phone number: </strong><span>${item.phone_number}</span></p>
                    <p class="mb-1"><strong>Email: </strong><span>${item.email}</span></p>
                    <p class="mb-1"><strong>Birthdate: </strong><span>${item.birthdate}</span></p>
                </div>
                <div>
                    <button class="btn btn-warning" data-edit="${item.id}">Edit</button>
                    <button class="btn btn-danger" data-delete="${item.id}">Delete</button>
                </div>
            </li>
        `
    })
    deleteUser()
    editUser()
}

function deleteUser() {
    const deleteButtons = document.querySelectorAll('[data-delete]')
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async e => {
            const id = e.target.getAttribute('data-delete')
            let response = await fetch('http://localhost:3000/delete/' + id, {
                method: 'DELETE'
            })
            response = await response.json()

            if (response.message === 'User deleted') {
                window.location.reload()
            }
        })
    })
}

function editUser() {
    const editButtons = document.querySelectorAll('[data-edit]')
    editButtons.forEach(btn => {
        btn.addEventListener('click', async e => {
            const id = e.target.getAttribute('data-edit')
            let response = await fetch('http://localhost:3000/users/' + id)
            response = await response.json()

            idInputE.value = response.user.id
            firstNameInputE.value = response.user.first_name
            lastNameInputE.value = response.user.last_name
            emailInputE.value = response.user.email
            phoneInputE.value = response.user.phone_number
            birthdateInputE.value = response.user.birthdate
            usernameInputE.value = response.user.username
        })
    })
}

;(async _ => {
    await getUserList()
})()