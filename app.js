import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.supabase = supabase;

const status = document.getElementById("status");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

status.textContent = "LostGuard connected";

registerBtn.addEventListener("click", async () => {

  const email = prompt("Enter your email:");
  if (!email) return;

  const password = prompt("Create a password (minimum 6 characters):");
  if (!password) return;

  status.textContent = "Creating your account...";

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    console.error(error);
    status.textContent = "Registration failed: " + error.message;
    return;
  }

  console.log(data);

  status.textContent =
    "Registration successful. Check your email to verify your account.";
});


loginBtn.addEventListener("click", async () => {

  const email = prompt("Enter your email:");
  if (!email) return;

  const password = prompt("Enter your password:");
  if (!password) return;

  status.textContent = "Logging in...";

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.error(error);
    status.textContent = "Login failed: " + error.message;
    return;
  }

  console.log(data);

  status.textContent = "Login successful! Welcome to LostGuard.";
});
