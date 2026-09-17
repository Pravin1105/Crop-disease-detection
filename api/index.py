import sys
import os
import json
import traceback

base_dir = os.path.dirname(__file__)
candidates = [
    os.path.join(base_dir, "..", "backend"),
    os.path.join(base_dir, "backend"),
    os.path.join(os.getcwd(), "backend")
]
for path in candidates:
    abs_path = os.path.abspath(path)
    if os.path.isdir(abs_path) and abs_path not in sys.path:
        sys.path.insert(0, abs_path)

flask_app = None
init_error = None
init_traceback = None

try:
    from app import app as _flask_app
    flask_app = _flask_app
except Exception as e:
    init_error = str(e)
    init_traceback = traceback.format_exc()

def app(environ, start_response):
    # Rewrite PATH_INFO if X-Matched-Path header exists
    matched_path = environ.get("HTTP_X_MATCHED_PATH")
    if matched_path:
        environ["PATH_INFO"] = matched_path.split("?")[0]

    if flask_app is None:
        start_response("200 OK", [("Content-Type", "application/json")])
        data = {
            "status": "init_error",
            "error": init_error,
            "traceback": init_traceback.splitlines() if init_traceback else [],
            "sys_path": sys.path,
            "cwd": os.getcwd()
        }
        return [json.dumps(data, indent=2).encode("utf-8")]

    try:
        return flask_app(environ, start_response)
    except Exception as e:
        start_response("200 OK", [("Content-Type", "application/json")])
        data = {
            "status": "runtime_error",
            "error": str(e),
            "traceback": traceback.format_exc().splitlines(),
            "path_info": environ.get("PATH_INFO"),
            "x_matched_path": environ.get("HTTP_X_MATCHED_PATH")
        }
        return [json.dumps(data, indent=2).encode("utf-8")]

