const inputPassword = document.getElementById('password');

const show = document.getElementById('show');
const hide = document.getElementById('hide');

show.addEventListener('click', () => {
    inputPassword.type = 'text';
    show.classList.add('noShow');
    hide.classList.remove('noShow');
});

hide.addEventListener('click', () => {
    inputPassword.type = 'password';
    hide.classList.add('noShow');
    show.classList.remove('noShow');
});
