import subprocess


def run_terminal_command(command):
    try:
        result = subprocess.check_output(
            command,
            shell=True,
            text=True
        )

        return result

    except Exception as e:
        return str(e)