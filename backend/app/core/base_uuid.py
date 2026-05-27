import uuid
from sqlalchemy import Column, String

def generate_uuid():
    return str(uuid.uuid4())