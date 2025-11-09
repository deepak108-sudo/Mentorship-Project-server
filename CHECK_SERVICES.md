# Quick Service Check Script

## 🔍 Run These Commands to Check Your Services

### 1. Check if Gateway is Running (Port 8000)

```bash
# Windows
curl http://localhost:8000/api/ping

# Or open in browser:
# http://localhost:8000/api/ping
```

**Expected:** `Gateway is live ✅`

### 2. Check if Student Service is Running (Port 5000)

```bash
# Windows
curl http://localhost:5000/api/student/register

# Should return an error (expected - needs POST data)
# But if you get "Connection refused" → Service is not running
```

### 3. Check What's Running on Each Port

```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :8000
lsof -i :5000
lsof -i :5173
```

---

## 🚀 How to Start Services (If Not Running)

### Terminal 1: Start Gateway

```bash
cd api-gateway
npm start
# or
node index.js
```

**Look for:**

```
🚀 API Gateway running on http://localhost:8000
```

### Terminal 2: Start Student Service

```bash
cd server/student-service
npm start
# or
node server.js
```

**Look for:**

```
MongoDB Successfully Connected ✅
Student Service running on port 5000
```

### Terminal 3: Start Frontend (If Not Running)

```bash
cd client
npm run dev
```

**Look for:**

```
Local: http://localhost:5173
```

---

## ⚠️ Common Issues

### Issue 1: "MongoDB not connected"

**Solution:** Make sure MongoDB is running and `MONGO_URI` is set in `.env`

### Issue 2: "Port already in use"

**Solution:** Kill the process using that port, or change the port in config

### Issue 3: "Cannot find module"

**Solution:** Run `npm install` in that directory

---

## ✅ Success Checklist

Before testing signup, make sure:

- [ ] Gateway is running (port 8000) - Check: `curl http://localhost:8000/api/ping`
- [ ] Student Service is running (port 5000) - Check terminal logs
- [ ] MongoDB is connected - Check student service logs for "MongoDB Successfully Connected ✅"
- [ ] Frontend is running (port 5173) - Check browser
- [ ] All services started without errors

---

## 🧪 Test the Flow

1. Open browser console (F12)
2. Submit signup form
3. Check console for logs
4. Check Gateway terminal for logs
5. Check Student Service terminal for logs

You should see logs at each step!
