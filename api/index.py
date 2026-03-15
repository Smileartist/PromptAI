import sys
import os

# Add the backend directory to the Python path
backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(backend_dir)

from app import app

# For Vercel, we need to handle the /api prefix if the routes aren't explicitly expecting it
class StripApiPrefix(object):
    def __init__(self, app):
        self.app = app
    def __call__(self, environ, start_response):
        path = environ.get('PATH_INFO', '')
        if path.startswith('/api'):
            environ['PATH_INFO'] = path[4:]
        return self.app(environ, start_response)

app.wsgi_app = StripApiPrefix(app.wsgi_app)
