const controller = require('../controllers/movieController');

module.exports =  (app)=>{
    app.route('/movies')
        .get(controller.list_movies)
        .post(controller.create_movie)

    app.route('/movies/:id')
        .get(controller.read_movie)
        .put(controller.update_movie)
        .delete(controller.delete_movie);

    app.route('/querydb')
        .get(controller.querydb)
}