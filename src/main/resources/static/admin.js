//Navigation bar
const url3 = 'http://localhost:8080/api/user'
let loggedUserHeaderElem = document.querySelector('#navBarAdmin')

fetch(url3)
    .then(res => res.json())
    .then(data => {
        loggedUserHeaderElem.innerHTML = `<span class="align-middle font-weight-bold mr-1">${data.name}  </span></b> 
                <span class="align-middle mr-1"> with roles:  </span> 
                <span>  ${data.roles.map(role => role.name === 'ROLE_USER' ? 'USER' : 'ADMIN')}</span>`;
    })
//Table
const renderUsers = (users) => {
    output = '',
        users.forEach(user => {
            output += ` 
              <tr> 
                    <td>${user.id}</td> 
                    <td>${user.name}</td> 
                    <td>${user.surname}</td> 
                    <td>${user.age}</td> 
                    <td>${user.email}</td> 
                    <td>${user.roles.map(role => role.name === 'ROLE_USER' ? 'USER' : 'ADMIN')}</td> 
                    <td>${user.password}</td> 
              <td> 
                   <button type="button" class="btn btn-info" id="edit-user" data-action="edit" 
                    data-id="${user.id}" data-toggle="modal" data-target="modal" data-userid="${user.id}" >Edit</button> 
               </td> 
               <td> 
                   <button type="button" class="btn btn-danger" id="delete-user" data-action="delete" 
                   data-id="${user.id}" data-target="modal">Delete</button> 
                    </td> 
              </tr>`
        })
    info.innerHTML = output;
}
let users = [];
const updateUser = (user) => {
    const foundIndex = users.findIndex(x => x.id == user.id);
    users[foundIndex] = user;
    renderUsers(users);
    console.log('users');
}
const removeUser = (id) => {
    users = users.filter(user => user.id != id);
    console.log(users)
    renderUsers(users);
}

// GET ALL users
const info = document.querySelector('#allUsers');
const url = 'http://localhost:8080/api/admin'

fetch(url, {mode: 'cors'})
    .then(res => res.json())
    .then(data => {
        users = data;
        renderUsers(data)
    })

// ADD user

const addUserForm = document.querySelector('#addUser')
const addName = document.getElementById('name1')
const addSurname = document.getElementById('surname1')
const addAge = document.getElementById('age1')
const addEmail = document.getElementById('email1')
const addPassword = document.getElementById('password1')
const addRoles = document.getElementById('roles1')

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(url, {
        method: 'POST',
       // redirect: 'manual',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: addName.value,
            surname: addSurname.value,
            age: addAge.value,
            email: addEmail.value,
            password: addPassword.value,
            roles: [
                addRoles.value
            ]
        })
    })
        .then(res => res.json())
        .then(data => {
            users = data;
            renderUsers(users);
        })
        .then(res =>{
            document.getElementById('add_new_user').click()
        })
})

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}


// EDIT user
on(document, 'click', '#edit-user', e => {
    const userInfo = e.target.parentNode.parentNode
    document.getElementById('id2').value = userInfo.children[0].innerHTML
    document.getElementById('name2').value = userInfo.children[1].innerHTML
    document.getElementById('surname2').value = userInfo.children[2].innerHTML
    document.getElementById('age2').value = userInfo.children[3].innerHTML
    document.getElementById('email2').value = userInfo.children[4].innerHTML
    document.getElementById('roles2').value = userInfo.children[5].innerHTML
    document.getElementById('password2').value = userInfo.children[6].innerHTML

    $("#modalEdit").modal("show")
})

const editUserForm = document.querySelector('#modalEdit')
editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: document.getElementById('id2').value,
            name: document.getElementById('name2').value,
            surname: document.getElementById('surname2').value,
            age: document.getElementById('age2').value,
            email: document.getElementById('email2').value,
            password: document.getElementById('password2').value,
            roles: [
                document.getElementById('roles2').value
            ]
        })
    })
        .then(res => res.json()).then(data => updateUser(data))
        .catch((e) => console.error(e))

    $("#modalEdit").modal("hide")
})

// DELETE user
let currentUserId = null;
const deleteUserForm = document.querySelector('#modalDelete')
deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fetch('http://localhost:8080/api/admin/' + currentUserId, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            removeUser(currentUserId);
            deleteUserForm.removeEventListener('submit', () => {
            });
            $("#modalDelete").modal("hide")
        })
})

on(document, 'click', '#delete-user', e => {
    const fila2 = e.target.parentNode.parentNode
    currentUserId = fila2.children[0].innerHTML

    document.getElementById('id3').value = fila2.children[0].innerHTML
    document.getElementById('name3').value = fila2.children[1].innerHTML
    document.getElementById('surname3').value = fila2.children[2].innerHTML
    document.getElementById('age3').value = fila2.children[3].innerHTML
    document.getElementById('email3').value = fila2.children[4].innerHTML
    document.getElementById('roles3').value = fila2.children[5].innerHTML

    $("#modalDelete").modal("show")
})