#!/usr/bin/env bash
# Arma la web en inglés (ReplyFromSanta.com) para su propio Static Site en Render:
#   Build Command:  bash build-en.sh
#   Publish Directory: dist-en
# Las páginas en inglés viven en en/ y usan los mismos css/, js/ y assets/ que la web en español.
set -euo pipefail
rm -rf dist-en
mkdir -p dist-en
cp -R css js assets dist-en/
cp en/*.html dist-en/
# El panel es el mismo para los dos sitios (mismo backend); en este dominio abre mostrando las órdenes en inglés.
cp admin.html dist-en/
echo "dist-en listo: $(ls dist-en/*.html | wc -l) páginas"
