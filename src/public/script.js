function showPassword(elemId, iconId) {
    let password = document.getElementById(elemId);
    let icon = document.getElementById(iconId);
    password.setAttribute("type", password.getAttribute("type") === "password"? "text": "password");
    icon.innerHTML = (password.getAttribute("type") === "password"? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16px"><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg>': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="16px"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/></svg>')
}

const searchTable = () => {
  let td, txtValue, noResults = true;
  let input = document.getElementById("search");
  let filter = input.value.toUpperCase();
  let table = document.getElementById("table");
  let tr = table.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        noResults = false;
      } else {
        tr[i].style.display = "none";
      }
    }       
  }

  const noResultRow = document.getElementById("no-results");
  if (noResults) {
    if (!noResultRow) {
      const noResultsRow = document.createElement("tr");
      noResultsRow.setAttribute("id", "no-results");
      noResultsRow.innerHTML = `<td colspan="4" style="text-align: center;">No results found</td>`;
      table.appendChild(noResultsRow);
    }
  } else {
    noResultRow.remove();
  }
}

const regex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const nameRegex = /^[a-zA-Z]/;
let error_msg = document.getElementById("error");

  $(document).ready(() => {
    $('#login-form').submit(async (e) => {
      e.preventDefault(); 
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let text;

      if (email == "" || email == null || !regex.test(String(email).toLowerCase())) {
        text = "Email should be valid";
      } else if (password == "" || password == null || password.length < 8) {
        text = "Password should contain at least 8 characters";
      } else {
        try {
          let req = await fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              email,
              password
            })
          });

          let res = await req.json();
          if (!res.success) {
            error_msg.classList.add("border", "border-danger");
            error_msg.innerText = res.message;
          } else {
            location.href = "/";
          }
        } catch (error) {
          console.error("Error occurred while logging in: ", error);
          error_msg.classList.add("border", "border-danger");
          error_msg.innerText = "An error occurred. Please try again.";
        }
      }

      if (text) {
        error_msg.classList.add("border", "border-danger");
        error_msg.innerText = text;
      }
    });

    $('#signup-form').submit(async (e) => {
      e.preventDefault();
      let firstname = document.getElementById("firstname").value;
      let lastname = document.getElementById("lastname").value;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let password2 = document.getElementById("password2").value;
      let text;

      if (!nameRegex.test(firstname) || firstname == null || !nameRegex.test(lastname) || lastname == null ) {
        text = "First Name or Last Name not found";
      } else if (email == "" || email == null || !regex.test(String(email).toLowerCase())) {
        text = "Email should be valid";
      } else if (password == "" || password == null || password.length < 8) {
        text = "Password should contain at least 8 characters";
      } else if (password2 == "" || password2 == null || password2 != password) {
        text = "Both passwords doesn't match";
      } else {
        try {
          let req = await fetch("/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              firstname,
              lastname,
              email,
              password
            })
          });

          let res = await req.json();
          if (!res.success) {
            error_msg.classList.add("border", "border-danger");
            error_msg.innerText = res.message;
          } else {
            location.href = "/login";
          }
        } catch (error) {
          console.error("Error occurred while signup: ", error);
          error_msg.classList.add("border", "border-danger");
          error_msg.innerText = "An error occurred. Please try again.";
        }
      }

      if (text) {
        error_msg.classList.add("border", "border-danger");
        error_msg.innerText = text;
      }
    });

    $('#admin-form').submit(async (e) => {
      e.preventDefault(); 
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let text;

      if (email == "" || email == null || !regex.test(String(email).toLowerCase())) {
        text = "Email should be valid";
      } else if (password == "" || password == null || password.length < 8) {
        text = "Password should contain at least 8 characters";
      } else {
        try {
          let req = await fetch("/adminpanel/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              email,
              password
            })
          });

          let res = await req.json();
          if (!res.success) {
            error_msg.classList.add("border", "border-danger");
            error_msg.innerText = res.message;
          } else {
            location.href = "/adminpanel";
          }
        } catch (error) {
          console.error("Error occurred while logging in: ", error);
          error_msg.classList.add("border", "border-danger");
          error_msg.innerText = "An error occurred. Please try again.";
        }
      }

      if (text) {
        error_msg.classList.add("border", "border-danger");
        error_msg.innerText = text;
      }
    });
  });


const editButton = async (email) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit User",
      html: `
        <div>
          <label for="email" class="form-label">Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <input id="email" class="swal2-input" value="${email}">
        </div>
        <div>
          <label for="email" class="form-label">Password</label>
          <input id="password" class="swal2-input" type="password">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonColor: 'Crimson',
      preConfirm: () => {
        const newemail = document.getElementById("email").value
        const password = document.getElementById("password").value
        let res = {email, newemail, password};
        if (newemail == "" || newemail == null || !regex.test(String(newemail).toLowerCase())) {
          res.newemail = "";
        } 
        if (password == "" || password == null || password.length < 8) {
          res.password = "";
        }
        return {email, newemail, password};
      }
    });
    if (formValues) {
      if (formValues.newemail == "" || formValues.password == "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please enter a valid email and password!",
        });
      } else {
        let req = await fetch("/adminpanel/edituser", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            email: formValues.email,
            newemail: formValues.newemail,
            password: formValues.password
          })
        });

        let res = await req.json();
        if (!res.success) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Hurray...",
            text: "Added user successfully!",
          });
           setTimeout(() => {
             location.reload();
           }, 1000)
        }
      }
    } 
}


const addUserButton = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add User",
      html: `
        <div>
          <label for="firstname" class="form-label">First Name</label>
          <input id="firstname" class="swal2-input" value="">
        </div>
        <div>
          <label for="lastname" class="form-label">Last Name</label>
          <input id="lastname" class="swal2-input" value="">
        </div>
        <div>
          <label for="email" class="form-label">Email &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <input id="email" class="swal2-input" value="">
        </div>
        <div>
          <label for="email" class="form-label">Password &nbsp;</label>
          <input id="password" class="swal2-input" type="password">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonColor: 'Crimson',
      preConfirm: () => {
        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        let res = {email, password, firstname, lastname};
        if (email == "" || email == null || !regex.test(String(email).toLowerCase())) {
          res.email = "";
        } 
        if (password == "" || password == null || password.length < 8) {
          res.password = "";
        } 
        if (!nameRegex.test(firstname) || firstname == null || !nameRegex.test(lastname) || lastname == null ) {
          res.firstname = "";
          res.lastname = "";
        }
        return res;
      }
    });
    if (formValues) {
      if (formValues.user == ""|| formValues.password == "" || formValues.firstname == "" || formValues.lastname == "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill all the fields!",
        });
      } else {
        let req = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            firstname: formValues.firstname,
            lastname: formValues.lastname,
            email: formValues.email,
            password: formValues.password
          })
        });

        let res = await req.json();
        if (!res.success) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Hurray...",
            text: "Added user successfully!",
          });
          setTimeout(() => {
            location.reload();
          }, 1000)
        }
      }
      
    }
  }

const deleteButton = async (email) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      let req = await fetch("/adminpanel/deleteuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          email
        })
      });

      let res = await req.json();
      if (res.success) {
        Swal.fire({
          title: "Deleted!",
          text: "User removed successfully.",
          icon: "success"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.message,
        });
      }
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  });
}