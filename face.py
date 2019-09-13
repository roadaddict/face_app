import cv2
import face_recognition
import numpy as np
from PIL import Image, ImageDraw


def init():
    global known_face_encodings, known_face_names
    alex_image = face_recognition.load_image_file("alex2.jpg")
    alex_image_encoding = face_recognition.face_encodings(alex_image)[0]

    # Put more photos here
    # alex_image = face_recognition.load_image_file("alex2.jpg")
    # alex_image_encoding = face_recognition.face_encodings(alex_image)[0]

    known_face_encodings = [
        alex_image_encoding
        #   List all encodings here
        #   alex_image_encoding
    ]
    known_face_names = [
        "Alexander"
        #   List all names here
        #   "Alexander"
    ]
    return len(known_face_encodings)


def check_photo(img_name):
    unknown_image = face_recognition.load_image_file(img_name)

    face_locations = face_recognition.face_locations(unknown_image)
    face_encodings = face_recognition.face_encodings(
        unknown_image, face_locations)

    # Loop through each face found in the unknown image
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(
            known_face_encodings, face_encoding)
        name = "Unknown"

        face_distances = face_recognition.face_distance(
            known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]
            return name


def add_face(img_name):
    # add new face for recognition
    return 'not implemented'
