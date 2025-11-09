# 🚀 How to Start All Services

## ⚠️ Current Error: `ERR_EMPTY_RESPONSE` / `ERR_NETWORK`

This means the **Gateway (port 8000) is NOT running**. You need to start it!

---

## 📋 Step-by-Step: Start All Services

### ✅ Step 1: Start Gateway (REQUIRED)

Open **Terminal 1**:

```bash
cd api-gateway
npm start
```

**You should see:**

```
🚀 API Gateway running on http://localhost:8000
```

**If you see an error:**

- Port 8000 already in use? → Kill the process using that port
- Dependencies missing? → Run `npm install` first

---

### ✅ Step 2: Start Student Service (REQUIRED)

Open **Terminal 2**:

```bash
cd server/student-service
npm start
```

**You should see:**

```
MongoDB Successfully Connected ✅
Student Service running on port 5000
```

**If you see "DB not connected ❌":**

1. Make sure MongoDB is running
2. Check `.env` file has `MONGO_URI` set
3. Verify the MongoDB connection string is correct

---

### ✅ Step 3: Verify Frontend is Running

Your frontend should already be running on port 5173. If not:

```bash
cd client
npm run dev
```

---

## 🧪 Test if Services are Running

### Test Gateway:

Open browser and go to:

```
http://localhost:8000/api/ping
```

**Should see:** `Gateway is live ✅`

**If you get "Connection refused" or page won't load:**
→ Gateway is NOT running → Start it in Terminal 1

---

### Test Student Service:

Open browser and go to:

```
http://localhost:5000/api/student/register
```

**Should see:** An error page (expected - needs POST data)

**If you get "Connection refused":**
→ Student Service is NOT running → Start it in Terminal 2

---

## ✅ Quick Checklist

Before testing signup, verify:

- [ ] **Terminal 1:** Gateway is running → See "API Gateway running on http://localhost:8000"
- [ ] **Terminal 2:** Student Service is running → See "Student Service running on port 5000"
- [ ] **Terminal 2:** MongoDB is connected → See "MongoDB Successfully Connected ✅"
- [ ] **Test Gateway:** `http://localhost:8000/api/ping` works
- [ ] **Test Student Service:** `http://localhost:5000/api/student/register` doesn't give "Connection refused"

---

## 🔍 What You Should See in Logs

### When you submit the signup form:

**Terminal 1 (Gateway) should show:**

```
[Gateway] POST /api/student/register
[Gateway] Request body: { email: 'deepak@gmail.com', ... }
[Gateway] Proxying POST /api/student/register to student-service
[Gateway] Response from student-service: 201
```

**Terminal 2 (Student Service) should show:**

```
[Student-Service] POST /api/student/register
[Student-Service] Request body: { email: 'deepak@gmail.com', ... }
[Register] Received request body: { ... }
[Register] Student registered successfully
```

---

## ⚠️ Common Issues

### Issue 1: "Port 8000 already in use"

**Solution:**

```bash
# Windows: Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with the number)
taskkill /PID <PID> /F
```

### Issue 2: "MongoDB not connected"

**Solution:**

1. Start MongoDB:

   ```bash
   # Windows
   net start MongoDB

   # Mac
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. Check `.env` file in `server/student-service/`:
   ```
   MONGO_URI=mongodb://localhost:27017/your_database_name
   PORT=5000
   ```

### Issue 3: "Cannot find module"

**Solution:**

```bash
# Install dependencies
cd api-gateway
npm install

cd ../server/student-service
npm install
```

---

## 🎯 Order of Starting Services

**Recommended order:**

1. **First:** Start Gateway (Terminal 1)
2. **Second:** Start Student Service (Terminal 2)
3. **Third:** Start/Verify Frontend (Terminal 3)

**Why this order?**

- Gateway needs to be ready to receive requests
- Student Service needs MongoDB connected
- Frontend can start anytime (it just makes requests)

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Gateway terminal shows "API Gateway running on http://localhost:8000"
2. ✅ Student Service terminal shows "MongoDB Successfully Connected ✅" and "Student Service running on port 5000"
3. ✅ `http://localhost:8000/api/ping` returns "Gateway is live ✅"
4. ✅ When you submit signup form:
   - Gateway logs show the request
   - Student Service logs show the request
   - Browser shows success message
   - Data is saved in MongoDB

---

## 🆘 Still Getting Errors?

1. **Check all terminals** - Are services actually running?
2. **Check browser console** - What's the exact error?
3. **Check Gateway terminal** - Any error messages?
4. **Check Student Service terminal** - Any error messages?
5. **Test each service individually** - Use the test URLs above

---

## 📝 Quick Command Reference

```bash
# Terminal 1: Gateway
cd api-gateway
npm start

# Terminal 2: Student Service
cd server/student-service
npm start

# Terminal 3: Frontend (if needed)
cd client
npm run dev
```

---

**Remember:** You need **BOTH** Gateway and Student Service running for signup to work! 🚀
