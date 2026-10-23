#!/usr/bin/env python3
"""Recalcula los hashes CSP de los <script> en línea de site/index.html y los
escribe en la cabecera Content-Security-Policy de site/_headers.

Ejecútalo cada vez que cambies cualquier <script> de index.html:
    python3 tools/csp-hash.py
"""
import base64, hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "site/index.html").read_text(encoding="utf-8")
headers_path = ROOT / "site/_headers"

hashes = []
for attrs, body in re.findall(r"<script([^>]*)>(.*?)</script>", html, re.S):
    if "application/ld+json" in attrs:  # datos, no se ejecuta
        continue
    digest = base64.b64encode(hashlib.sha256(body.encode("utf-8")).digest()).decode()
    hashes.append(f"'sha256-{digest}'")

headers = headers_path.read_text(encoding="utf-8")
new = re.sub(r"script-src [^;]*;", "script-src " + " ".join(hashes) + ";", headers)
headers_path.write_text(new, encoding="utf-8")
print("script-src", " ".join(hashes))
