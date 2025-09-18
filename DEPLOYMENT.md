# Royalserve Deployment Guide

## 🚀 Quick Deploy

### Windows Users
1. Double-click `deploy.bat` to start both servers automatically
2. Access your application at: http://34.28.133.216:3000/

### Manual Deployment

#### Backend (Terminal 1)
```bash
cd backend
npm install
npm start
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

## 📍 Access Points

- **Frontend**: http://34.28.133.216:3000/
- **Backend API**: http://34.28.133.216:8888/api/
- **Login Credentials**: admin@admin.com / admin123

## 🔧 Configuration Fixed

✅ **Frontend Configuration**
- API endpoints point to http://34.28.133.216:8888/
- CORS configured for your IP addresses
- Vite dev server accepts external connections

✅ **Backend Configuration**
- Listens on all interfaces (0.0.0.0:8888)
- CORS allows frontend IP (34.28.133.216:3000)
- Environment variables properly set

## 🐛 Troubleshooting

### Login Issues
- Check browser console for debug logs
- Verify backend is running at http://34.28.133.216:8888/
- Test API endpoint: http://34.28.133.216:8888/api/login

### Connection Issues
- Ensure MongoDB is running
- Check firewall settings for ports 3000 and 8888
- Verify IP address is accessible from your network

### Build Issues
```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Environment Variables

### Frontend (.env)
```env
VITE_FILE_BASE_URL="http://34.28.133.216:8888/"
VITE_BACKEND_SERVER="http://34.28.133.216:8888/"
VITE_DEV_REMOTE="remote"
VITE_FRONTEND_URL="http://34.28.133.216:3000/"
```

### Backend (.env)
```env
DATABASE="mongodb://localhost:27017"
JWT_SECRET="your_private_jwt_secret_key"
NODE_ENV="production"
PUBLIC_SERVER_FILE="http://34.28.133.216:8888/"
PORT=8888
HOST="0.0.0.0"
```

## 🔐 Security Notes

- Change JWT_SECRET before production deployment
- Update database credentials for production
- Consider using HTTPS for production
- Configure proper firewall rules

## 📝 Production Checklist

- [ ] MongoDB is running and accessible
- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] Login works with admin@admin.com/admin123
- [ ] API calls succeed (check network tab)
- [ ] No CORS errors in console