# 🚀 Deployment Guide - Social Batch Uploader

## 📦 Quick Start

### Option 1: Automated Deployment (Recommended)
```bash
# Run deployment script
DEPLOY.bat
```

### Option 2: Manual Deployment
```bash
# 1. Install dependencies
npm install

# 2. Build production
npm run build

# 3. Create screenshots folder
mkdir C:\VitaDairy\Screenshots

# 4. Configure environment
copy .env.production .env
# Edit .env with your settings

# 5. Start server
npm start
# Or with PM2: pm2 start npm --name "social-uploader" -- start
```

---

## 🔧 Server Requirements

- **OS**: Windows Server 2019/2022 or Windows 10/11 Pro
- **CPU**: 4 cores minimum
- **RAM**: 8GB minimum (16GB recommended)
- **Disk**: SSD 256GB+
- **Node.js**: v20.11.0+
- **Network**: 100Mbps+

---

## ⚙️ Configuration

### 1. Edit `.env` File

```env
# Screenshot Storage
SCREENSHOT_STORAGE_PATH=C:\VitaDairy\Screenshots
SCREENSHOT_PUBLIC_URL=\\\\YOUR-SERVER-NAME\\VitaDairy\\Screenshots

# Server
PORT=3000
NODE_ENV=production
```

**Replace `YOUR-SERVER-NAME`** with your actual server name!

### 2. Share Screenshots Folder

1. Right-click `C:\VitaDairy\Screenshots`
2. Properties → Sharing → Share
3. Add "Everyone" with Read/Write permissions
4. Note the network path: `\\\\SERVER-NAME\\VitaDairy\\Screenshots`

### 3. Open Firewall

```bash
# Windows Firewall → Inbound Rules → New Rule
# Port: 3000
# Allow connection
```

---

## 🎯 Starting the Server

### With PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start npm --name "social-uploader" -- start

# Save configuration
pm2 save

# Setup auto-start on boot
pm2 startup

# View status
pm2 status

# View logs
pm2 logs social-uploader
```

### Without PM2
```bash
npm start
```

---

## 🌐 Access

### From Server
```
http://localhost:3000
```

### From Other Computers
```
http://SERVER-IP:3000
# Example: http://192.168.1.100:3000
```

---

## ✅ Verification

### 1. Check Server Running
```bash
# With PM2
pm2 status

# Check port
netstat -ano | findstr :3000
```

### 2. Test Upload
1. Open browser → `http://localhost:3000`
2. Upload test Excel file
3. Verify screenshots saved to `C:\VitaDairy\Screenshots`
4. Verify Excel URLs work

### 3. Test Network Access
From another computer:
```bash
# Ping server
ping SERVER-IP

# Access web
http://SERVER-IP:3000
```

---

## 🛠️ Troubleshooting

### Server Won't Start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F
```

### Screenshots Not Saving
```bash
# Check folder permissions
icacls C:\VitaDairy\Screenshots

# Check .env configuration
type .env
```

### Can't Access from Other Computers
```bash
# Check firewall
netsh advfirewall firewall show rule name="Port 3000"

# Check server IP
ipconfig
```

---

## 📊 Monitoring

### Daily
- Check server status: `pm2 status`
- Check disk space
- Review logs: `pm2 logs social-uploader --lines 100`

### Weekly
- Backup screenshots folder
- Clear old screenshots (optional)
- Review error logs

### Monthly
- Update dependencies: `npm update`
- Restart server: `pm2 restart social-uploader`

---

## 🔒 Security

### Network Access
- Restrict to internal IP range only
- Or use VPN for remote access

### Backup
```bash
# Daily backup
robocopy C:\VitaDairy\Screenshots D:\Backup\Screenshots /MIR
```

---

## 📞 Support

For issues, check:
1. PM2 logs: `pm2 logs social-uploader`
2. Windows Event Viewer
3. Screenshots folder permissions

---

## 🎉 Success!

Your server is now ready for end users!

**Access URL**: `http://YOUR-SERVER-IP:3000`
