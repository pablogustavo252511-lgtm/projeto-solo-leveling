async function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  try {
    const result = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        senha: form.get("senha")
      })
    });
    setSession(result.token, result.user);
    window.location.href = "dashboard.html";
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  try {
    await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({
        nome: form.get("nome"),
        email: form.get("email"),
        senha: form.get("senha")
      })
    });
    clearSession();
    window.location.href = "login.html?registered=1";
  } catch (error) {
    showMessage(error.message, "error");
  }
}

if (document.querySelector("[data-login-form]")) {
  document.querySelector("[data-login-form]").addEventListener("submit", handleLogin);
}

if (document.querySelector("[data-register-form]")) {
  document.querySelector("[data-register-form]").addEventListener("submit", handleRegister);
}

if (document.querySelector("[data-login-form]")) {
  const params = new URLSearchParams(window.location.search);
  if (params.get("registered") === "1") {
    showMessage("Conta criada. Agora faca login para entrar no sistema.", "success");
  }
}
