import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.supabase = supabase;


// ─────────────────────────────
// Elements
// ─────────────────────────────

const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const showRegisterBtn = document.getElementById("showRegisterBtn");
const showLoginBtn = document.getElementById("showLoginBtn");

const status = document.getElementById("status");


// ─────────────────────────────
// Status message
// ─────────────────────────────

function showStatus(message) {
  status.textContent = message;
  status.style.display = "block";
}


// ─────────────────────────────
// Switch to Register
// ─────────────────────────────

showRegisterBtn.addEventListener("click", () => {

  loginView.classList.add("hidden");
  registerView.classList.remove("hidden");

  status.style.display = "none";
});


// ─────────────────────────────
// Switch to Login
// ─────────────────────────────

showLoginBtn.addEventListener("click", () => {

  registerView.classList.add("hidden");
  loginView.classList.remove("hidden");

  status.style.display = "none";
});


// ─────────────────────────────
// Register
// ─────────────────────────────

registerBtn.addEventListener("click", async () => {

  const name =
    document.getElementById("registerName").value.trim();

  const email =
    document.getElementById("registerEmail").value.trim();

  const password =
    document.getElementById("registerPassword").value;


  if (!name || !email || !password) {
    showStatus("Please fill in all fields.");
    return;
  }


  if (password.length < 6) {
    showStatus("Password must contain at least 6 characters.");
    return;
  }


  registerBtn.disabled = true;
  registerBtn.textContent = "Creating account...";


  try {

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });


    if (error) {
      console.error(error);
      showStatus(error.message);
      return;
    }


    showStatus(
      "Account created successfully. Please check your email to verify your account."
    );

    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";


  } finally {

    registerBtn.disabled = false;
    registerBtn.textContent = "Create Account";

  }

});


// ─────────────────────────────
// Login
// ─────────────────────────────

loginBtn.addEventListener("click", async () => {

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;


  if (!email || !password) {
    showStatus("Please enter your email and password.");
    return;
  }


  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in...";


  try {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });


    if (error) {
      console.error(error);
      showStatus(error.message);
      return;
    }


    console.log("Logged in:", data);

    showStatus(
      "Login successful. Welcome to LostGuard!"
    );


  } finally {

    loginBtn.disabled = false;
    loginBtn.textContent = "Login";

  }

});


// ─────────────────────────────
// Check existing session
// ─────────────────────────────

async function checkSession() {

  const { data, error } =
    await supabase.auth.getSession();


  if (error) {
    console.error(error);
    return;
  }


  if (data.session) {

    console.log(
      "Existing session:",
      data.session.user.email
    );

  }

}


checkSession();


// ─────────────────────────────
// Auth state listener
// ─────────────────────────────

supabase.auth.onAuthStateChange(
  (event, session) => {

    console.log(
      "Auth event:",
      event
    );

    if (session) {

      console.log(
        "Authenticated user:",
        session.user.email
      );

    }

  }
);
