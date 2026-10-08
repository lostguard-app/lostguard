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

const caseDetailsPanel =
  document.getElementById("caseDetailsPanel");

const caseDetailsId =
  document.getElementById("caseDetailsId");

const caseDetailsDevice =
  document.getElementById("caseDetailsDevice");

const caseDetailsStatus =
  document.getElementById("caseDetailsStatus");

const caseDetailsReported =
  document.getElementById("caseDetailsReported");

const closeCaseDetailsBtn =
  document.getElementById("closeCaseDetailsBtn");

const reportLostBtn = document.getElementById("reportLostBtn");
const foundPhoneBtn = document.getElementById("foundPhoneBtn");
const lostDevicePanel = document.getElementById("lostDevicePanel");
const lostDeviceList = document.getElementById("lostDeviceList");
const cancelLostBtn = document.getElementById("cancelLostBtn");


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

  loadDevices();

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

    showStatus(
      "Password must contain at least 6 characters."
    );

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

    if (event === "SIGNED_OUT") {

      showLogin();

    }

  }
);


// =============================
// I FOUND A PHONE
// =============================

foundPhoneBtn.addEventListener("click", () => {

  showStatus(
    "Finder feature is coming next."
  );

});


// =============================
// ADD DEVICE FORM
// =============================

addDeviceBtn.addEventListener("click", () => {

  addDeviceForm.classList.remove("hidden");

  addDeviceBtn.style.display = "none";

});


cancelDeviceBtn.addEventListener("click", () => {

  addDeviceForm.classList.add("hidden");

  addDeviceBtn.style.display = "block";

});


// =============================
// SAVE DEVICE
// =============================

saveDeviceBtn.addEventListener(
  "click",
  async (event) => {

    event.preventDefault();
    event.stopPropagation();


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
          "Unable to save device: " +
          error.message
        );

        return;

      }


      showStatus(
        "Device added successfully!"
      );


      document.getElementById("deviceName").value = "";
      document.getElementById("manufacturer").value = "";
      document.getElementById("model").value = "";
      document.getElementById("imei1").value = "";
      document.getElementById("imei2").value = "";
      document.getElementById("serialNumber").value = "";
      document.getElementById("phoneNumber").value = "";


      addDeviceForm.classList.add("hidden");
      addDeviceBtn.style.display = "block";


      // Reload devices immediately
      await loadDevices();


    } finally {

      saveDeviceBtn.disabled = false;
      saveDeviceBtn.textContent = "Save Device";

    }

  }
);


// =============================
// RECOVERY CASE DETAILS
// =============================

async function openCaseDetails(caseId) {

  caseDetailsPanel.classList.remove("hidden");

  caseDetailsId.textContent = "Loading...";
  caseDetailsDevice.textContent = "Loading...";
  caseDetailsStatus.textContent = "Loading...";
  caseDetailsReported.textContent = "Loading...";


  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();


  if (!user) {

    showStatus("Please login again.");

    return;

  }


  // =============================
  // LOAD RECOVERY CASE
  // =============================

  const {
    data,
    error
  } = await supabase
    .from("recovery_cases")
    .select(`
      id,
      case_id,
      status,
      reported_at,
      devices (
        device_name,
        manufacturer,
        model
      )
    `)
    .eq("case_id", caseId)
    .eq("owner_id", user.id)
    .single();


  if (error) {

    console.error(error);

    caseDetailsId.textContent = "Unable to load case";
    caseDetailsDevice.textContent = "";
    caseDetailsStatus.textContent = "";
    caseDetailsReported.textContent = "";

    return;

  }


  // =============================
  // CASE INFORMATION
  // =============================

  caseDetailsId.textContent = data.case_id;

  const device = data.devices;

  caseDetailsDevice.textContent =
    [
      device?.device_name,
      device?.manufacturer,
      device?.model
    ]
      .filter(Boolean)
      .join(" • ") || "Unknown device";


  caseDetailsStatus.textContent =
    data.status;


  caseDetailsReported.textContent =
    new Date(data.reported_at).toLocaleString();


  // =============================
  // LOAD RECOVERY TIMELINE
  // =============================

  const {
    data: events,
    error: eventsError
  } = await supabase
    .from("recovery_case_events")
    .select(`
      id,
      event_type,
      title,
      description,
      created_at
    `)
    .eq("case_id", data.id)
    .order("created_at", {
      ascending: false
    });


  if (eventsError) {

    console.error(eventsError);

    return;

  }


  // =============================
  // TIMELINE CONTAINER
  // =============================

  let timelineContainer =
    document.getElementById("recoveryTimeline");


  if (!timelineContainer) {

    timelineContainer =
      document.createElement("div");

    timelineContainer.id =
      "recoveryTimeline";

    timelineContainer.style.marginTop =
      "20px";

    caseDetailsPanel.appendChild(
      timelineContainer
    );

  }


  // =============================
  // NO EVENTS
  // =============================

  if (!events || events.length === 0) {

    timelineContainer.innerHTML = `
      <div style="
        padding:16px;
        border-radius:12px;
        background:#f8fafc;
        color:#64748b;
        font-size:14px;
      ">
        No recovery timeline events yet.
      </div>
    `;

    return;

  }


  // =============================
  // RENDER TIMELINE
  // =============================

  timelineContainer.innerHTML = `
    <h3 style="
      margin:0 0 14px 0;
      font-size:18px;
    ">
      Recovery Timeline
    </h3>

    <div style="
      display:flex;
      flex-direction:column;
      gap:12px;
    ">

      ${events.map(event => {

        let icon = "🔵";

        if (event.event_type === "lost_reported") {
          icon = "🔴";
        }

        if (event.event_type === "location_update") {
          icon = "📍";
        }

        if (event.event_type === "finder_contact") {
          icon = "💬";
        }

        if (event.event_type === "device_found") {
          icon = "🟠";
        }

        if (event.event_type === "device_recovered") {
          icon = "🟢";
        }

        if (event.event_type === "case_closed") {
          icon = "✅";
        }

        return `
          <div style="
            display:flex;
            gap:12px;
            padding:14px;
            border:1px solid #e2e8f0;
            border-radius:12px;
            background:#ffffff;
          ">

            <div style="
              font-size:22px;
              min-width:30px;
            ">
              ${icon}
            </div>

            <div style="flex:1;">

              <div style="
                font-weight:600;
                color:#0f172a;
                margin-bottom:4px;
              ">
                ${escapeHtml(event.title)}
              </div>

              ${
                event.description
                  ? `
                    <div style="
                      font-size:13px;
                      color:#64748b;
                      margin-bottom:6px;
                    ">
                      ${escapeHtml(event.description)}
                    </div>
                  `
                  : ""
              }

              <div style="
                font-size:12px;
                color:#94a3b8;
              ">
                ${new Date(
                  event.created_at
                ).toLocaleString()}
              </div>

            </div>

          </div>
        `;

      }).join("")}

    </div>
  `;

}


// =============================
// CLOSE CASE DETAILS
// =============================

closeCaseDetailsBtn.addEventListener("click", () => {

  caseDetailsPanel.classList.add("hidden");

});
  

// =============================
// LOAD MY DEVICES
// =============================

async function loadDevices() {

  deviceList.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⏳</div>
      <h3>Loading devices...</h3>
    </div>
  `;


  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();


  if (!user) {
    return;
  }


  const {
    data,
    error
  } = await supabase
    .from("devices")
    .select(`
      *,
      recovery_cases (
        case_id,
        status,
        reported_at
      )
    `)
    .eq("owner_id", user.id)
    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.error(error);

    deviceList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Unable to load devices</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;

    return;
  }


  if (!data || data.length === 0) {

    deviceList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📱</div>
        <h3>No devices registered yet</h3>
        <p>Register your phone to start protecting it.</p>
      </div>
    `;

    return;
  }


  deviceList.innerHTML = data.map(
    device => `

      <div
        style="
          border:1px solid #e5e9f0;
          border-radius:14px;
          padding:16px;
          margin-bottom:12px;
        "
      >

        <div
          style="
            display:flex;
            justify-content:space-between;
            gap:10px;
            align-items:flex-start;
          "
        >

          <div>

            <h3 style="margin-bottom:5px;">
              📱 ${escapeHtml(device.device_name)}
            </h3>

            <p
              style="
                color:#667085;
                font-size:13px;
              "
            >
              ${escapeHtml(device.manufacturer || "")}
              ${escapeHtml(device.model || "")}
            </p>

          </div>


          <span
            style="
              background:${getStatusBackground(device.status)};
              color:${getStatusColor(device.status)};
              padding:5px 10px;
              border-radius:20px;
              font-size:11px;
              font-weight:700;
              text-transform:capitalize;
              white-space:nowrap;
            "
          >
            ${getStatusIcon(device.status)}
            ${escapeHtml(device.status)}
          </span>

        </div>


        <div
          style="
            margin-top:12px;
            font-size:12px;
            color:#667085;
            line-height:1.7;
          "
        >

          <div>
            IMEI:
            ${maskImei(device.imei_1)}
          </div>


          ${
            device.phone_number
              ? `
                <div>
                  Phone:
                  ${escapeHtml(device.phone_number)}
                </div>
              `
              : ""
          }


          ${
            device.status === "lost" &&
            device.recovery_cases?.length
              ? `
                <div
                  style="
                    margin-top:8px;
                    padding:10px;
                    background:#fff1f2;
                    border-radius:10px;
                  "
                >

                  <button
                    type="button"
                    class="secondary-btn"
                    data-case-id="${escapeHtml(
                      device.recovery_cases[0].case_id
                    )}"
                    style="
                      margin-top:0;
                      width:auto;
                      padding:8px 12px;
                      font-size:12px;
                      color:#9f1239;
                    "
                  >
                    🔎 Recovery Case:
                    ${escapeHtml(
                      device.recovery_cases[0].case_id
                    )}
                  </button>

                </div>
              `
              : ""
          }

        </div>

      </div>

    `
  ).join("");


  // =============================
  // RECOVERY CASE BUTTONS
  // =============================

  document
    .querySelectorAll("[data-case-id]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const caseId =
          button.getAttribute("data-case-id");

        openCaseDetails(caseId);

      });

    });

}

// =============================
// REPORT LOST DEVICE
// =============================

reportLostBtn.addEventListener("click", async () => {
  console.log("REPORT LOST BUTTON CLICKED");

  lostDevicePanel.classList.remove("hidden");

  reportLostBtn.style.display = "none";

  await loadLostDeviceList();

});


cancelLostBtn.addEventListener("click", () => {

  lostDevicePanel.classList.add("hidden");

  reportLostBtn.style.display = "block";

});


// =============================
// LOAD DEVICES FOR LOST REPORT
// =============================

async function loadLostDeviceList() {

  lostDeviceList.innerHTML = `
    <p style="color:#667085;font-size:13px;">
      Loading devices...
    </p>
  `;


  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();


  if (!user) {

    lostDeviceList.innerHTML = `
      <p style="color:#b91c1c;">
        Please login again.
      </p>
    `;

    return;

  }


  const {
    data,
    error
  } = await supabase
    .from("devices")
    .select("id, device_name, manufacturer, model, status")
    .eq("owner_id", user.id)
    .order("created_at", {
      ascending: false
    });


  if (error) {

    console.error(error);

    lostDeviceList.innerHTML = `
      <p style="color:#b91c1c;">
        Unable to load devices.
      </p>
    `;

    return;

  }


  if (!data || data.length === 0) {

    lostDeviceList.innerHTML = `
      <p style="color:#667085;">
        No registered devices found.
      </p>
    `;

    return;

  }


  lostDeviceList.innerHTML = data.map(device => `

    <button
      type="button"
      class="secondary-btn"
      data-lost-device-id="${device.id}"
      style="
        text-align:left;
        margin-top:8px;
        padding:15px;
      "
    >

      📱
      <strong>
        ${escapeHtml(device.device_name)}
      </strong>

      <br>

      <span
        style="
          color:#667085;
          font-size:12px;
        "
      >
        ${escapeHtml(device.manufacturer || "")}
        ${escapeHtml(device.model || "")}
        · ${escapeHtml(device.status)}
      </span>

    </button>

  `).join("");

  document
  .querySelectorAll("[data-case-id]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const caseId =
        button.getAttribute("data-case-id");

      openCaseDetails(caseId);

    });

  });


  document
    .querySelectorAll("[data-lost-device-id]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const deviceId =
          button.getAttribute("data-lost-device-id");

        reportDeviceLost(deviceId);

      });

    });

}


// =============================
// MARK DEVICE AS LOST
// =============================

async function reportDeviceLost(deviceId) {

  const confirmed =
    confirm(
      "Are you sure you want to report this device as LOST?"
    );

  if (!confirmed) {
    return;
  }


  // =============================
  // GET CURRENT USER
  // =============================

  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();


  if (!user) {

    showStatus("Please login again.");

    return;

  }


  // =============================
  // MARK DEVICE AS LOST
  // =============================

  const {
    error: deviceError
  } = await supabase
    .from("devices")
    .update({
      status: "lost"
    })
    .eq("id", deviceId)
    .eq("owner_id", user.id);


  if (deviceError) {

    console.error(deviceError);

    showStatus(
      "Unable to report device: " +
      deviceError.message
    );

    return;

  }


  // =============================
  // CREATE RECOVERY CASE
  // =============================

  const {
    data: recoveryCase,
    error: caseError
  } = await supabase
    .from("recovery_cases")
    .insert({
      device_id: deviceId,
      owner_id: user.id
    })
    .select("id, case_id")
    .single();


  if (caseError) {

    console.error(caseError);

    showStatus(
      "Device marked lost, but recovery case could not be created: " +
      caseError.message
    );

    await loadDevices();

    return;

  }


  // =============================
  // CREATE FIRST TIMELINE EVENT
  // =============================

  const {
    error: eventError
  } = await supabase
    .from("recovery_case_events")
    .insert({

      case_id: recoveryCase.id,

      event_type: "lost_reported",

      title: "Device reported lost",

      description:
        "The device owner reported this device as lost."

    });


  if (eventError) {

    console.error(eventError);

    showStatus(
      "Recovery case created, but timeline event could not be created."
    );

  } else {

    showStatus(
      "Device reported as lost. Recovery Case: " +
      recoveryCase.case_id
    );

  }


  // =============================
  // CLOSE PANEL
  // =============================

  lostDevicePanel.classList.add("hidden");

  reportLostBtn.style.display = "block";


  // =============================
  // REFRESH DEVICES
  // =============================

  await loadDevices();

}


// =============================
// DEVICE STATUS UI
// =============================

function getStatusBackground(status) {

  switch (status) {

    case "lost":
      return "#fee2e2";

    case "found":
      return "#ffedd5";

    case "recovered":
      return "#dbeafe";

    case "registered":
    default:
      return "#dcfce7";

  }

}


function getStatusColor(status) {

  switch (status) {

    case "lost":
      return "#b91c1c";

    case "found":
      return "#c2410c";

    case "recovered":
      return "#1d4ed8";

    case "registered":
    default:
      return "#15803d";

  }

}


function getStatusIcon(status) {

  switch (status) {

    case "lost":
      return "🔴";

    case "found":
      return "🟠";

    case "recovered":
      return "🔵";

    case "registered":
    default:
      return "🟢";

  }

}

// =============================
// SECURITY HELPERS
// =============================

function escapeHtml(value) {

  if (!value) {

    return "";

  }


  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function maskImei(imei) {

  if (!imei) {

    return "Not provided";

  }


  const value = String(imei);


  if (value.length <= 4) {

    return "••••";

  }


  return "••••••••" + value.slice(-4);

}


// =============================
// START APPLICATION
// =============================

checkSession();
