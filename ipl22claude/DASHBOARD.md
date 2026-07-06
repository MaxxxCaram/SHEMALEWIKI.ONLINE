# 📊 Hermes Dashboard - Control Center

Tu dashboard personal de Hermes. **Acceso permanente, sin permisos requeridos.**

---

## 🚀 Iniciar Dashboard

### Opción 1: PowerShell (Windows)
```powershell
powershell -ExecutionPolicy Bypass -File scripts/start-dashboard.ps1
```

### Opción 2: Bash (Mac/Linux)
```bash
bash scripts/start-dashboard.sh
```

### Opción 3: Node directo
```bash
npm install  # Primera vez
node scripts/hermes-dashboard.js
```

---

## 🌐 Acceder al Dashboard

Una vez iniciado, abre en tu navegador:

```
http://localhost:3333
```

**¡Listo!** Dashboard disponible 24/7 sin permisos.

---

## 📈 Qué Ves en el Dashboard

### 1. **Stats Cards** (Arriba)
- 📋 Total de logs guardados
- 📊 Daily reports generados (12 PM)
- ✅ Watchdog runs (6 AM)
- 📚 Wayback recoveries (domingo)

### 2. **Configuration Status**
- 🔗 Qué integraciones están activas
- 🔑 Qué variables de entorno están configuradas

### 3. **Latest Daily Report**
El último reporte de KPIs en tiempo real:
- Total de perfiles
- Perfiles con/sin fotos
- Nuevos perfiles (24h, 7d)
- Build/Deploy success rates

### 4. **Recent Logs**
Lista completa de logs con timestamps.
Haz clic para ver detalles.

---

## ⚙️ Características

✅ **Auto-refresh**: Se actualiza cada 30 segundos  
✅ **Sin autenticación**: Acceso directo local  
✅ **Dark mode**: Tema optimizado para nocturno  
✅ **Responsive**: Funciona en mobile  
✅ **Log viewer**: Abre cualquier log en modal  

---

## 📱 Vista Mobile

El dashboard es 100% responsive. Accede desde tu teléfono si estás en la misma red.

```
http://[tu-ip]:3333
```

---

## 🔒 Seguridad

- ✅ Solo localhost (puerto 3333)
- ✅ NO expone datos sensibles (solo presencia de vars)
- ✅ Protección contra path traversal
- ✅ Lee-solo (no modifica archivos)

---

## 🛠️ Troubleshooting

### "Puerto 3333 ya en uso"
```bash
# Cambiar puerto en hermes-dashboard.js
# const PORT = 3333;  →  const PORT = 3334;
```

### "Módulos no encontrados"
```bash
npm install express
```

### "Dashboard en blanco"
1. Verifica que exista `~/.hermes/logs/`
2. Ejecuta: `bash scripts/hermes-checklist.sh`
3. Recarga el dashboard

---

## 📞 ¿Problemas?

- Dashboard: `scripts/hermes-dashboard.js`
- Logs: `~/.hermes/logs/`
- Config: `SOUL.md`

---

**Última actualización: 2026-07-06**
