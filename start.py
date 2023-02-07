import os
import subprocess

BASEDIR = os.path.abspath(os.path.dirname(__file__))


def main():
    if os.path.exists(os.path.join(BASEDIR, "backend", "app.db")):
        subprocess.run("/.venv/Scripts/flask.exe")

    subprocess.run('".venv/Scripts/flask.exe" --app ./backend/app.py run --host=0.0.0.0', shell=True)
    subprocess.run('cd "./frontend"\nnpm run start')


if __name__ == "__main__":
    main()