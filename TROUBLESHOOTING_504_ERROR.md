# Troubleshooting 504 Gateway Timeout Error

## 🔴 Error: `POST http://localhost:5173/api/student/register 504 (Gateway Timeout)`

### What This Error Means:

- **504 Gateway Timeout** = The request reached the gateway, but the gateway couldn't get a response from the student service in time
- The Vite proxy is working (it's forwarding to gateway)
- But either:
  1. Gateway (port 8000) is not running
  2. Student Service (port 5000) is not running
  3. MongoDB connection is failing (student service won't start)
  4. Request is taking too long to process

---

## 🔍 Step-by-Step Diagnosis

### Step 1: Check if Services are Running

Open **3 separate terminal windows** and check:

#### Terminal 1: Check Gateway

```bash
# Navigate to gateway directory
cd api-gateway

# Check if it's running
# You should see: "🚀 API Gateway running on http://localhost:8000"
# If not, start it:
npm start
# or
node index.js
```

#### Terminal 2: Check Student Service

```bash
# Navigate to student service directory
cd server/student-service

# Check if it's running
# You should see: "Student Service running on port 5000"
# And: "MongoDB Successfully Connected ✅"
# If not, start it:
npm start
# or
node server.js
```

#### Terminal 3: Check Frontend

```bash
# Navigate to client directory
cd client

# Check if it's running
# You should see: "Local: http://localhost:5173"
# If not, start it:
npm run dev
```

---

### Step 2: Test Each Service Individually

#### Test 1: Test Gateway Directly

```bash
# Open browser or use curl
curl http://localhost:8000/api/ping

# Should return: "Gateway is live ✅"
# If not → Gateway is not running or not accessible
```

#### Test 2: Test Student Service Directly

```bash
# Try to connect to student service
curl http://localhost:5000/api/student/register

# Should return an error (expected - need POST with data)
# But if you get "Connection refused" → Student service is not running
```

#### Test 3: Check MongoDB Connection

Look at the student service terminal. You should see:

```
MongoDB Successfully Connected ✅
```

If you see:

```
DB not connected ❌ [error message]
```

Then MongoDB is not connected. Check:

1. Is MongoDB running?
2. Is `MONGO_URI` set in `.env` file?
3. Is the connection string correct?

---

### Step 3: Check Ports are Not in Use

#### Windows:

```bash
netstat -ano | findstr :8000
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

#### Mac/Linux:

```bash
lsof -i :8000
lsof -i :5000
lsof -i :5173
```

If ports are in use by other processes, you'll see output. Make sure the correct services are using them.

---

### Step 4: Check Console Logs

When you submit the form, check the logs in each terminal:

#### Gateway Terminal Should Show:

```
[Gateway] POST /api/student/register
[Gateway] Request body: { email: '...', ... }
[Gateway] Proxying POST /api/student/register to student-service
```

If you see:

```
[Gateway] Proxy error: connect ECONNREFUSED 127.0.0.1:5000
```

→ Student service is not running on port 5000

#### Student Service Terminal Should Show:

```
[Student-Service] POST /api/student/register
[Student-Service] Request body: { email: '...', ... }
[Register] Received request body: { ... }
[Register] Student registered successfully
```

If you don't see these logs → Request is not reaching student service

---

### Step 5: Check Environment Variables

#### Check Gateway `.env` (if exists):

```bash
cd api-gateway
# Check if there's a .env file
# Gateway might not need one, but check anyway
```

#### Check Student Service `.env`:

```bash
cd server/student-service
# Must have .env file with:
MONGO_URI=your_mongodb_connection_string
PORT=5000  # Optional, defaults to 5000
```

**Example `.env` file:**

```
MONGO_URI=mongodb://localhost:27017/your_database_name
PORT=5000
```

---

## 🛠️ Common Fixes

### Fix 1: Start All Services

Make sure all 3 services are running:

1. ✅ Gateway (port 8000)
2. ✅ Student Service (port 5000)
3. ✅ Frontend (port 5173)

### Fix 2: Check MongoDB Connection

```bash
# Test MongoDB connection
mongosh
# or
mongo

# If MongoDB is not running, start it:
# Windows (if installed as service):
net start MongoDB

# Mac (if installed via Homebrew):
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Fix 3: Restart Services

Sometimes services need to be restarted:

1. Stop all services (Ctrl+C in each terminal)
2. Start them again in order:
   - Gateway first
   - Student Service second
   - Frontend last

### Fix 4: Check Firewall/Antivirus

Sometimes firewalls block localhost connections:

- Temporarily disable firewall
- Add exceptions for Node.js
- Check antivirus settings

### Fix 5: Clear Browser Cache

Sometimes browser cache causes issues:

- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Try incognito/private mode

---

## 🎯 Quick Diagnostic Checklist

Run through this checklist:

- [ ] Gateway is running on port 8000
- [ ] Student Service is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] MongoDB is running and accessible
- [ ] `MONGO_URI` is set in student-service `.env`
- [ ] Student service shows "MongoDB Successfully Connected ✅"
- [ ] Gateway shows "🚀 API Gateway running on http://localhost:8000"
- [ ] No port conflicts (other services using same ports)
- [ ] All services started without errors
- [ ] Browser console shows request is being sent
- [ ] Gateway logs show request received
- [ ] Student service logs show request received

---

## 🔍 What to Look For in Logs

### ✅ Good Logs (Everything Working):

**Gateway:**

```
🚀 API Gateway running on http://localhost:8000
[Gateway] POST /api/student/register
[Gateway] Request body: { email: 'test@test.com', ... }
[Gateway] Proxying POST /api/student/register to student-service
[Gateway] Response from student-service: 201
```

**Student Service:**

```
MongoDB Successfully Connected ✅
Student Service running on port 5000
[Student-Service] POST /api/student/register
[Student-Service] Request body: { email: 'test@test.com', ... }
[Register] Received request body: { ... }
[Register] Student registered successfully
```

### ❌ Bad Logs (Problems):

**Gateway Error:**

```
[Gateway] Proxy error: connect ECONNREFUSED 127.0.0.1:5000
```

→ Student service is not running

**Student Service Error:**

```
DB not connected ❌ [error message]
```

→ MongoDB connection failed

**No Logs at All:**
→ Request is not reaching the service (check Vite proxy, network, etc.)

---

## 🚨 Emergency Fixes

### If Nothing Works:

1. **Kill all Node processes:**

   ```bash
   # Windows
   taskkill /f /im node.exe

   # Mac/Linux
   pkill node
   ```

2. **Restart everything:**

   - Close all terminals
   - Restart your computer (sometimes helps)
   - Start services again

3. **Check if ports are actually available:**

   ```bash
   # Try starting services on different ports temporarily
   # Change PORT in .env files
   ```

4. **Use absolute URLs in frontend:**

   ```javascript
   // Instead of relative URL:
   axios.post("/api/student/register", data);

   // Use absolute URL:
   axios.post("http://localhost:8000/api/student/register", data);
   ```

   (This bypasses Vite proxy to test if gateway works)

---

## 📞 Still Not Working?

If you've tried everything and it's still not working:

1. **Check the exact error message** in browser console
2. **Check all terminal logs** (Gateway, Student Service, Frontend)
3. **Check MongoDB is running** and accessible
4. **Verify all ports** are correct (8000, 5000, 5173)
5. **Check environment variables** are set correctly
6. **Try testing each service individually** with curl or Postman

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ All services start without errors
2. ✅ MongoDB connects successfully
3. ✅ Gateway logs show requests being received
4. ✅ Student service logs show requests being received
5. ✅ Browser shows success response (200 or 201)
6. ✅ Data is saved in MongoDB
7. ✅ Frontend shows success message

---

Good luck! 🚀
