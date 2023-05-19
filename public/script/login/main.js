$('form').on('submit', async function (e) {
  e.preventDefault();
  const userInfo = {
    email: $('#email').val(),
    password: $('#password').val(),
  };
  const polipop = new Polipop('updateSection', {
    layout: 'popups',
    insert: 'before',
    pool: 5,
    life: 5000,
    progressbar: true,
  });
  try {
    const response = await axios.post('/auth/login', userInfo);
    const { access_token } = response.data;
    localStorage.setItem('jwtToken', access_token);
    window.location.href = 'http://localhost:3000/profile';
  } catch (error) {
    polipop.add({
      type: 'error',
      title: 'Error',
      content: error.response.data.message,
    });
  }
});
