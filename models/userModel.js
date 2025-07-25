const path = require('path')
const fs = require('fs')
const userDBPath = path.join(process.cwd(), 'data', 'users.json');

function readUsers() {
    try {
        const data = fs.readFileSync(userDBPath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error("Erro ao ler users.json", error);
        return []
    }
}
function writeUsers(users) {
    try {
        fs.writeFileSync(userDBPath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (err) {
        console.error("Erro ao salvar no users.json:", err);
    }
}

function findUserByEmail(email) {
    const users = readUsers();
    return users.find(user => user.email === email);
}

function createUser({name, email, password}) {
    const users = readUsers();
    const userId = Date.now().toString();
    const newUser = {userId, name, email, password };
    users.push(newUser);
    writeUsers(users);
    return newUser;
}
function saveUsers(updatedUsers) {
    const users = readUsers();
    const index = users.findIndex(user => user.userId === updatedUsers.userId);

    if(index !== -1){
        users[index] = updatedUsers;
        writeUsers(users);
    } else {
        console.error("Erro ao salvar no users.json:", err);
        
    }
}

function deletedUser(userId) {
    const users = readUsers();
    const updatedUsers = users.filter(user => user.userId !== userId);
    
    writeUsers(updatedUsers);
}
module.exports = {
    readUsers,
    writeUsers,
    saveUsers,
    findUserByEmail,
    createUser,
    deletedUser
}