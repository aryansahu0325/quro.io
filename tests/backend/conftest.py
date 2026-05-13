import pytest
import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"
