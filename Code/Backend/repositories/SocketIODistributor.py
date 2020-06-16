from flask_socketio import SocketIO
from flask import Flask, jsonify, request
from flask_cors import CORS


class SocketIODistributor:
    socket = None

    def __init__(self, app=None):
        if app is not None:
            # Enkel SocketIO object updaten indien Flask app meegegeven wordt
            SocketIODistributor.socket = SocketIO(app, cors_allowed_origins="*")
