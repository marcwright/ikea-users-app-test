import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [nameInputField, setNameInputField] = useState('')
  const hostUrl = import.meta.env.PROD ? window.location.href : 'http://localhost:8080/';

  const fetchUsers = async () => {
    const response = await fetch(`${hostUrl}api/users`);
    const usersToJson = await response.json();
    console.log(usersToJson);
    setUsers(usersToJson);
  }

  const createUser = async (event) => {
    console.log(event)
    event.preventDefault()
    const response = await fetch(`${hostUrl}api/users`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: event.target.name.value,
        isAdmin: event.target.isAdmin.value
      })
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);   
  }

  const updateUser = async (e) => {
    const response = await fetch(`${hostUrl}api/users/${e.target.dataset.id}`, {
      method: "PUT",
      headers: {
          "Content-type": "application/json",
      },
      body: JSON.stringify({ isAdmin: e.target.checked }),
      });
    await response.json();
    await fetchUsers();
  };


  useEffect(() => {
    fetchUsers();
  }, [])

  const deleteUser = async (e) => {
    await fetch(`${hostUrl}api/users/${e.target.dataset.id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    })
 
    await fetchUsers();
  }

  return (
    <>
      <h1>New User</h1>
      <form onSubmit={createUser}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="isAdmin">Is Admin</label>
        <input type="checkbox" name="isAdmin"/>
        <input type="submit" />
      </form>

      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Is Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
              <tr key={user.id}>
                <td>{user?.name}</td>
                <td>    
                  <input
                    data-id={user.id}
                    type="checkbox"
                    checked={user.isAdmin}
                    onChange={updateUser}
                /></td>
                <td>
                  <button data-id={user.id} onClick={deleteUser}>Delete</button>
                </td>
              </tr>)
            )}
        </tbody>
      </table>
    </>    
  );
}

export default App
