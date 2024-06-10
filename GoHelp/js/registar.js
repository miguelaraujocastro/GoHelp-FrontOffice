function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);

    let user_records = JSON.parse(localStorage.getItem("utilizadoresFrontOffice")) || [];
    if (user_records.some(user => user.email === data.email)) {
      var registoJaEfetuado = new bootstrap.Modal(document.getElementById('registoJaEfetuado'));
      registoJaEfetuado.show();
    } else {
        user_records.push({ name: data.name, email: data.email });
        localStorage.setItem("utilizadoresFrontOffice", JSON.stringify(user_records));
        var registoSucesso = new bootstrap.Modal(document.getElementById('registoSucesso'));
        registoSucesso.show();
    }
}

window.onload = function () {
    google.accounts.id.initialize({
      client_id: "233099860430-75g9d5ov3oome9tuv1205evl7k5pa0us.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDivRegistar"),
      { theme: "outline", 
      size: "large", 
      type: "icon",
      shape: "circle",
      text:"signin_with",
      class: 'custom-google-btn'
       }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }