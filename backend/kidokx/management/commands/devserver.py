# kidokx/management/commands/runserver.py
import os, signal, subprocess, sys
from django.core.management.commands.runserver import Command as RunserverCommand

class Command(RunserverCommand):
    help = "Run Django dev server and automatically start a Celery worker."

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("🚀 Starting Celery worker in background..."))
        # Start Celery inside your Pipenv env
        self.celery_proc = subprocess.Popen(
            ["pipenv", "run", "celery", "-A", "kidokx", "worker", "-l", "info"],
            stdout=sys.stdout,
            stderr=sys.stderr,
            preexec_fn=os.setsid,  # so we can kill the whole group on exit (Linux/macOS)
        )
        try:
            super().handle(*args, **options)  # run the real dev server
        finally:
            self.stdout.write(self.style.WARNING("🛑 Stopping Celery worker..."))
            try:
                os.killpg(os.getpgid(self.celery_proc.pid), signal.SIGTERM)
            except Exception:
                pass
