# 🚀 Hermes Dashboard Remoto - Instalación en VPS Hostinger

Cómo instalar el dashboard remoto en tu VPS para acceder desde tu PC.

---

## ⚡ Quick Start (3 pasos)

### 1️⃣ En tu PC: Detectar Hermes en VPS

```bash
# Conectar al VPS
ssh usuario@tu-vps.com

# Clonar o descargar el proyecto
git clone https://github.com/tu-repo/shemalewiki.git
cd shemalewiki

# Detectar dónde está Hermes
bash vps-setup/detect-hermes.sh
```

Esto encontrará automáticamente:
- ✅ Dónde están los logs (`~/.hermes/logs/`)
- ✅ Qué usuario ejecuta Hermes
- ✅ Ruta completa de instalación

### 2️⃣ Instalar Dashboard

```bash
bash vps-setup/install-dashboard-vps.sh
```

Crea automáticamente:
- ✅ `vps-dashboard.js` (servidor remoto)
- ✅ `.env.example` (template de configuración)

### 3️⃣ Configurar .env

```bash
# Crear .env con valores seguros
cat > .env << EOF
PORT=3334
HERMES_API_KEY=$(openssl rand -hex 16)
HERMES_LOGS_DIR=$(grep HERMES_LOGS_DIR vps-setup/.hermes-vps-config.sh | cut -d'"' -f2)
EOF

cat .env
```

**⚠️ IMPORTANTE**: Guarda tu `HERMES_API_KEY` en lugar seguro.

---

## 🎯 Iniciar Dashboard en VPS

### Opción 1: Terminal Directa

```bash
node vps-dashboard.js
```

Te mostrará:
```
✅ Dashboard running on http://YOUR_VPS_IP:3334?token=YOUR_API_KEY

⚠️  CHANGE YOUR API KEY in .env!
```

### Opción 2: Con PM2 (Persistente)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar dashboard
pm2 start vps-dashboard.js --name "hermes-dashboard"

# Auto-start en reboot
pm2 startup
pm2 save
```

Ver estado:
```bash
pm2 status
pm2 logs hermes-dashboard
```

### Opción 3: Con Systemd (Recomendado)

```bash
sudo tee /etc/systemd/system/hermes-dashboard.service > /dev/null <<EOF
[Unit]
Description=Hermes Dashboard
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/tu-usuario/shemalewiki
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node vps-dashboard.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Activar
sudo systemctl enable hermes-dashboard
sudo systemctl start hermes-dashboard
sudo systemctl status hermes-dashboard
```

---

## 🌐 Acceder Remotamente

### Desde tu PC (navegador)

#### Opción 1: IP del VPS
```
http://[IP-DEL-VPS]:3334?token=[TU-API-KEY]
```

Ejemplo:
```
http://123.45.67.89:3334?token=a1b2c3d4e5f6g7h8
```

#### Opción 2: Dominio HTTPS (recomendado)
```
https://shemalewiki.online:3334?token=[TU-API-KEY]
```

Requiere:
- ✅ Certificado SSL (Let's Encrypt)
- ✅ Nginx reverse proxy

---

## 🔒 Seguridad

### Nginx Reverse Proxy + Let's Encrypt

```bash
# Instalar Nginx y Certbot
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Crear config
sudo tee /etc/nginx/sites-available/hermes-dashboard > /dev/null <<'EOF'
server {
    server_name shemalewiki.online;
    
    location /hermes/ {
        proxy_pass http://localhost:3334/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    listen 80;
}
EOF

# Habilitar
sudo ln -s /etc/nginx/sites-available/hermes-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d shemalewiki.online
```

Ahora accede:
```
https://shemalewiki.online/hermes?token=YOUR_API_KEY
```

### API Key Segura

El token se genera con:
```bash
openssl rand -hex 16
```

Nunca hardcodees en URLs públicas. Mejor:
- Almacena en `~/.bashrc`: `export HERMES_TOKEN="..."`
- O usa variables de entorno

---

## 📊 Dashboard Features

Desde el navegador verás:
- ✅ Total de logs guardados
- ✅ Daily reports (KPIs)
- ✅ Watchdog runs (health checks)
- ✅ Wayback recoveries
- ✅ Último reporte completo
- ✅ Lista de todos los logs

---

## 🐛 Troubleshooting

### "Puerto 3334 en uso"
```bash
# Cambiar puerto en .env
echo "PORT=3335" >> .env

# O liberar puerto
sudo lsof -i :3334
sudo kill -9 [PID]
```

### "Logs directory no existe"
```bash
# Crear manualmente
mkdir -p ~/.hermes/logs

# Ejecutar detect-hermes.sh de nuevo
bash vps-setup/detect-hermes.sh
```

### "Token inválido"
```bash
# Verificar en .env
cat .env | grep HERMES_API_KEY

# URL debe tener: ?token=EXACTO_VALOR
```

### "Certificate error en HTTPS"
```bash
# Renovar SSL
sudo certbot renew --force-renewal

# O crear nuevo
sudo certbot certonly --standalone -d shemalewiki.online
```

---

## 📱 Acceso desde Mobile

Una vez en HTTPS:
```
https://shemalewiki.online/hermes?token=YOUR_API_KEY
```

El dashboard es 100% responsive.

---

## 🔄 Auto-Refresh

Dashboard se actualiza cada 30 segundos automáticamente.

---

## 📞 Soporte

Si no funciona:

1. **Verificar logs del dashboard**:
   ```bash
   pm2 logs hermes-dashboard
   # O si usas systemd:
   sudo journalctl -u hermes-dashboard -f
   ```

2. **Verificar conexión**:
   ```bash
   curl -s http://localhost:3334/health
   ```

3. **Verificar directorio de logs**:
   ```bash
   ls -la ~/.hermes/logs/
   ```

---

**¡Listo!** Ahora tienes acceso remoto a Hermes desde cualquier lugar. 🚀
