#!/bin/bash
# Script para deploy no Render

set -e  # Para em caso de erro

echo "Instalando dependências Python..."
pip install --upgrade pip
pip install -r flask_api/requirements.txt

echo "Build concluído!"