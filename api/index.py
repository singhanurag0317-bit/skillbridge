import sys
import os

# Add the root and backend directories to the Python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, 'backend'))

from backend.main import app

# This entry point is used by Vercel Serverless Functions
# It exposes the FastAPI 'app' instance to the Vercel runtime.
