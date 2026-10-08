import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// =============================
// ELEMENTS
// =============================

const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");

const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const showRegisterBtn = document.getElementById("showRegisterBtn");
const showLoginBtn = document.getElementById("showLoginBtn");

const logoutBtn = document.getElementById("logoutBtn");

const status = document.getElementById("status");

const welcomeName = document.getElementById("welcomeName");
const welcomeEmail = document.getElementById("welcomeEmail");

const addDeviceBtn = document.getElementById("addDeviceBtn");
const addDeviceForm = document.getElementById("addDeviceForm");
const saveDeviceBtn = document.getElementById("saveDeviceBtn");
const cancelDeviceBtn = document.getElementById("cancelDeviceBtn");
const deviceList = document.getElementById("deviceList");

// =============================
// STATUS
// =============================

function showStatus(message) {
  status.textContent = message;
  status.style.display = "block";
}


// =============================
// SHOW LOGIN
// =============================

function showLogin() {

  authView.style.display = "flex";
  dashboardView.style.display = "none";

  loginView.classList.remove("hidden");
  registerView.classList.add("hidden");

  status.style.display = "none";
}


// =============================
// SHOW DASHBOARD
// =============================

function showDashboard(user) {

  authView.style.display = "none";
  dashboardView.style.display = "block";

  const name =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  welcomeName.textContent = name;
  welcomeEmail.textContent = user.email || "";

}


// =============================
// REGISTER / LOGIN SWITCH
// =============================

showRegisterBtn.addEventListener("click", () => {

  loginView.classList.add("hidden");
  registerView.classList.remove("hidden");

  status.style.display = "none";

});


showLoginBtn.addEventListener("click", () => {

  registerView.classList.add("hidden");
  loginView.classList.remove("hidden");

  status.style.display = "none";

});


// =============================
// REGISTER
// =============================

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

    const { error } =
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


// =============================
// LOGIN
// =============================

loginBtn.addEventListener("click", async () => {

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;


  if (!email || !password) {

    showStatus(
      "Please enter your email and password."
    );

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

      showStatus(error.message);

      return;
    }


    showDashboard(data.user);


  } finally {

    loginBtn.disabled = false;
    loginBtn.textContent = "Login";

  }

});


// =============================
// LOGOUT
// =============================

logoutBtn.addEventListener("click", async () => {

  logoutBtn.disabled = true;
  logoutBtn.textContent = "Logging out...";


  const { error } =
    await supabase.auth.signOut();


  logoutBtn.disabled = false;
  logoutBtn.textContent = "Logout";


  if (error) {

    console.error(error);

    return;
  }


  showLogin();

});


// =============================
// CHECK EXISTING SESSION
// =============================

async function checkSession() {

  const { data, error } =
    await supabase.auth.getSession();


  if (error) {

    console.error(error);

    showLogin();

    return;
  }


  if (data.session) {

    showDashboard(data.session.user);

  } else {

    showLogin();

  }

}


// =============================
// AUTH STATE CHANGES
// =============================

supabase.auth.onAuthStateChange(
  (event, session) => {

    console.log(
      "Auth event:",
      event
    );

    if (
      event === "SIGNED_OUT"
    ) {

      showLogin();

    }

  }
);


// =============================
// START
// =============================

checkSession();

// =============================
// ADD DEVICE
// =============================

addDeviceBtn.addEventListener("click", () => {

  addDeviceForm.classList.remove("hidden");

  addDeviceBtn.style.display = "none";

});


// =============================
// CANCEL ADD DEVICE
// =============================

cancelDeviceBtn.addEventListener("click", () => {

  addDeviceForm.classList.add("hidden");

  addDeviceBtn.style.display = "block";

});


// =============================
// SAVE DEVICE
// =============================

saveDeviceBtn.addEventListener("click", async (event) => {

  event.preventDefault();
  event.stopPropagation();

  console.log("SAVE DEVICE CLICKED");

  const deviceName =
    document.getElementById("deviceName").value.trim();

  const manufacturer =
    document.getElementById("manufacturer").value.trim();

  const model =
    document.getElementById("model").value.trim();

  const imei1 =
    document.getElementById("imei1").value.trim();

  const imei2 =
    document.getElementById("imei2").value.trim();

  const serialNumber =
    document.getElementById("serialNumber").value.trim();

  const phoneNumber =
    document.getElementById("phoneNumber").value.trim();


  if (!deviceName) {

    showStatus("Please enter a device name.");

    return;

  }


  if (!imei1) {

    showStatus("Please enter IMEI 1.");

    return;

  }


  saveDeviceBtn.disabled = true;
  saveDeviceBtn.textContent = "Saving...";


  try {

    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();


    if (!user) {

      showStatus("Please login again.");

      return;

    }


    const {
      error
    } = await supabase
      .from("devices")
      .insert({

        owner_id: user.id,

        device_name: deviceName,

        manufacturer: manufacturer,

        model: model,

        imei_1: imei1,

        imei_2: imei2 || null,

        serial_number: serialNumber || null,

        phone_number: phoneNumber || null

      });


    if (error) {

      console.error(error);

      showStatus(
        "Unable to save device: " + error.message
      );

      return;

    }


    showStatus("Device added successfully!");


    // Clear form

    document.getElementById("deviceName").value = "";
    document.getElementById("manufacturer").value = "";
    document.getElementById("model").value = "";
    document.getElementById("imei1").value = "";
    document.getElementById("imei2").value = "";
    document.getElementById("serialNumber").value = "";
    document.getElementById("phoneNumber").value = "";


    addDeviceForm.classList.add("hidden");

    addDeviceBtn.style.display = "block";


  } finally {

    saveDeviceBtn.disabled = false;
    saveDeviceBtn.textContent = "Save Device";

  }

});
