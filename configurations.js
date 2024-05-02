const mode = 1;

const host_local = "http://localhost:8080";
const host_remote = "https://database-demo-latest-1.onrender.com";

function getHost() {
  return mode == 0 ? host_local : host_remote;
  //return host_local
}

function isLoggedIn() {
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}

function saveTheToken(token) {
  localStorage.setItem("token", token);
  updateTheNavigationBar();
}

function removeTheToken() {
  localStorage.removeItem("token");
  updateTheNavigationBar();
}

function getTheToken() {
  return localStorage.getItem("token");
}

let configuration = {
  isLoggedIn: () => isLoggedIn(),
  host: () => getHost(),
  token: () => getTheToken(),
};

async function login() {
  let email = document.getElementById("email-login").value;
  let password = document.getElementById("password-login").value;
  let username = email.substring(0, email.indexOf("@"));
  let customer = { username: username, email: email, password: password };
  console.log(customer);
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  };
  try {
    let response = await fetch(getHost() + "/login", request);
    if (response.status == 200) {
      alert("The login was successful!");
      const token = await response.text();
      saveTheToken(token);
      location.href = "index.html";
    } else {
      console.log(`response status:${response.status}`);
      removeTheToken();
      alert("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong!");
  }
}

async function signup() {
  let email = document.getElementById("email-signup").value;
  let password = document.getElementById("password-signup").value;
  let username = email.substring(0, email.indexOf("@"));
  let customer = { username: username, email: email, password: password };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  };
  try {
    let response = await fetch(getHost() + "/signup", request);
    if (response.status == 200) {
      alert("The registration was successful!");
      location.href = "login.html";
    } else {
      console.log(`response status:${response.status}`);
      alert("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong!");
  }
}

async function logout() {
  removeTheToken();
}

async function getLoggedInUsername() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    const tokenPayload = token.split(".")[1];
    const decodedToken = JSON.parse(atob(tokenPayload));
    return decodedToken.username;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

async function getAll() {
  let response = await fetch(host_local + "/flowers", {});
  let result = await response.json();
  return result;
}
