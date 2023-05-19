$('form').on('submit', async function (e) {
  e.preventDefault();
  const newUser = {
    email: $('#email').val(),
    fullname: $('#fullname').val(),
    password: $('#password').val(),
    repeatPassword: $('#repeatPassword').val(),
  };
  const polipop = new Polipop('updateSection', {
    layout: 'popups',
    insert: 'before',
    pool: 5,
    life: 5000,
    progressbar: true,
  });
  try {
    await axios.post('/auth/signup', newUser);
    window.location.href = 'http://localhost:3000/login';
  } catch (error) {
    polipop.add({
      type: 'error',
      title: 'Error',
      content: error.response.data.message,
    });
  }
});
