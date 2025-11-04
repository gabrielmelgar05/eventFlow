#!/usr/bin/env bash
set -e
source .venv/bin/activate
export PYTHONPATH=.
uvicorn app.app:app --host 0.0.0.0 --port 8000 --reload
