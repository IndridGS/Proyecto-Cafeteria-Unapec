exports.renderHomePage = (req, res) => {
    res.render('layout', {
        title: 'Inicio',
        content: 'Bienvenido al Sistema de Cafetería UNAPEC'
    });
};
