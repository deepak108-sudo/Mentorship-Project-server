# 🚨 Quick Fix for 504 Gateway Timeout

## The Problem

Your request is timing out because **one or both backend services are not running**.

## ✅ Immediate Solution

### Step 1: Open 3 Terminal Windows

You need **3 separate terminal windows** open:

---

### Terminal 1: Start Gateway

```bash
cd api-gateway
npm start
```

**Look for this message:**

```
🚀 API Gateway running on http://localhost:8000
```

**If you see an error**, check:

- Is port 8000 already in use?
- Are dependencies installed? (`npm install`)

---

### Terminal 2: Start Student Service

```bash
cd server/student-service
npm start
```

**Look for these messages:**

```
MongoDB Successfully Connected ✅
Student Service running on port 5000
```

**If you see "DB not connected ❌"**, check:

1. Is MongoDB running?
2. Is `MONGO_URI` set in `.env` file?
3. Check the `.env` file in `server/student-service/`

**Example `.env` file:**

```
MONGO_URI=mongodb://localhost:27017/your_database_name
PORT=5000
```

---

### Terminal 3: Frontend (Already Running)

Your frontend should already be running. If not:

```bash
cd client
npm run dev
```

---

## 🧪 Test if Services are Running

### Test 1: Test Gateway

Open browser and go to:

```
http://localhost:8000/api/ping
```

**Should see:** `Gateway is live ✅`

**If you get "Connection refused":** Gateway is not running → Go to Terminal 1 and start it

---

### Test 2: Test Student Service

Open browser and go to:

```
http://localhost:5000/api/student/register
```

**Should see:** An error (expected - needs POST data)

**If you get "Connection refused":** Student Service is not running → Go to Terminal 2 and start it

---

## 🔍 Check the Logs

When you submit the signup form, check each terminal:

### Gateway Terminal Should Show:

```
[Gateway] POST /api/student/register
[Gateway] Request body: { email: '...', ... }
[Gateway] Proxying POST /api/student/register to student-service
```

**If you see:**

```
[Gateway] Proxy error: connect ECONNREFUSED 127.0.0.1:5000
```

→ **Student Service is NOT running!** Start it in Terminal 2.

---

### Student Service Terminal Should Show:

```
[Student-Service] POST /api/student/register
[Student-Service] Request body: { email: '...', ... }
[Register] Received request body: { ... }
[Register] Student registered successfully
```

**If you don't see these logs:**
→ Request is not reaching student service. Check if it's running!

---

## ⚠️ Common Issues

### Issue 1: MongoDB Not Running

**Symptom:** Student service shows "DB not connected ❌"

**Fix:**

```bash
# Start MongoDB
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

---

### Issue 2: Port Already in Use

**Symptom:** "Port 8000/5000 is already in use"

**Fix:**

```bash
# Find what's using the port (Windows):
netstat -ano | findstr :8000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number from above):
taskkill /PID <PID> /F
```

---

### Issue 3: Missing .env File

**Symptom:** "Cannot read property 'MONGO_URI' of undefined"

**Fix:**

1. Create `.env` file in `server/student-service/`
2. Add:
   ```
   MONGO_URI=mongodb://localhost:27017/your_database_name
   PORT=5000
   ```
3. Restart student service

---

## 🎯 Quick Checklist

Before testing signup again:

- [ ] Terminal 1: Gateway is running (port 8000)
- [ ] Terminal 2: Student Service is running (port 5000)
- [ ] Terminal 2: MongoDB is connected ("MongoDB Successfully Connected ✅")
- [ ] Terminal 3: Frontend is running (port 5173)
- [ ] Test: `http://localhost:8000/api/ping` works
- [ ] Test: `http://localhost:5000/api/student/register` doesn't give "Connection refused"

---

## ✅ Success!

You'll know it's working when:

1. ✅ All 3 services are running
2. ✅ MongoDB is connected
3. ✅ Gateway logs show requests
4. ✅ Student service logs show requests
5. ✅ Browser shows success (200/201 status)
6. ✅ Data is saved in MongoDB

---

## 🆘 Still Not Working?

1. **Check all terminal logs** - Look for error messages
2. **Check browser console** - Look for error details
3. **Verify MongoDB is running** - Try connecting with `mongosh`
4. **Check .env file** - Make sure `MONGO_URI` is correct
5. **Restart all services** - Stop (Ctrl+C) and start again

---

## 📝 Next Steps

1. **Start Gateway** (Terminal 1)
2. **Start Student Service** (Terminal 2)
3. **Verify both are running** (Test URLs above)
4. **Submit signup form again**
5. **Check logs in both terminals**

Good luck! 🚀
