from flask import Flask, render_template, request, jsonify, Response, json
from face import init as init_faces, check_photo
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './photos/'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__, static_url_path='/static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024
app.debug = True


@app.route("/")
def home():
    return render_template("photo.html")


@app.route('/face', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        f.save(secure_filename(f.filename))
        faces = init_faces()
        if (faces > 0):
            app.logger.info('Recognition started: ' +
                            str(faces)+' faces learned')
            name = check_photo(f.filename)
            if (name):
                app.logger.info(
                    'Recognition finished: it is ' + name + ' face!')
                return jsonify({'username': name})
            else:
                return jsonify({'username': 0})


@app.route('/add_face', methods=['POST'])
def upload_face():
    if request.method == 'POST':
        f = request.files['file']
        f.save(secure_filename(f.filename))
        return jsonify({'success': False})


if __name__ == "__main__":
    app.run(debug=True)
