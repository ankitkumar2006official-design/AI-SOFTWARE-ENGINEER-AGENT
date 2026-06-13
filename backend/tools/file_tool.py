import os


def read_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        return str(e)


def write_file(path, content):
    try:
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
        return "File written successfully"
    except Exception as e:
        return str(e)