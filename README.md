# Raaibar 🚀

> **A Privacy-Focused, Cloud-Native Real-Time Messaging Application.**
> > *M.Tech Research Project | Built with the MERN Stack & React Native*

## 📖 Overview

**Raaibar** (Garhwali for "Messenger") is a cross-platform mobile chat application developed as part of my M.Tech research on **Secure Communication Architectures**.

The project demonstrates the evolution from a monolithic local setup to a distributed cloud architecture. It currently focuses on real-time latency optimization using **WebSockets** and is transitioning into its research phase to implement and compare **End-to-End Encryption (E2EE)** algorithms for mobile environments.

## 🛠️ Tech Stack

| Component | Technology |
| --- | --- |
| **Frontend** | React Native (TypeScript) |
| **Backend** | Node.js, Express.js |
| **Real-Time** | Socket.io (WebSockets) |
| **Database** | MongoDB Atlas (Cloud Cluster) |
| **Deployment** | Render (PaaS) |
| **Storage** | Async Storage (Local caching) |
| **Dev Environment** | Fedora Linux Workstation |

---

## ✨ Key Features (Implemented)

### ☁️ Cloud-Native Architecture

* **Distributed System:** migrated from localhost (`adb reverse`) to a fully deployed cloud backend.
* **Live Database:** Persistent data storage using **MongoDB Atlas**, accessible from any network.
* **Auto-Deployment:** CI/CD integration where pushes to `main` automatically trigger server rebuilds on Render.

### ⚡ Real-Time Communication

* **Socket.io Integration:** Replaced inefficient "Short Polling" (2-second intervals) with persistent **WebSocket** connections.
* **Instant Messaging:** Bi-directional event-based communication for zero-latency message delivery.
* **Room-Based Routing:** Secure message routing where users join private "rooms" identified by their username.

### 🔐 Authentication & Security

* **Secure Handshake:** JSON-based login verification against the cloud database.
* **Persistent Session:** Auto-login functionality using `AsyncStorage` to maintain user sessions across app restarts.
* **Friend System:** Full request/accept workflow to ensure users only chat with approved contacts.

### 📱 User Experience

* **Cross-Platform UI:** Responsive design that works on Android (Physical & Emulator).
* **Chat History:** Fetches previous conversations from MongoDB upon loading a chat.
* **Visual Feedback:** Custom navigation headers and loading states.

---

## 🏗️ System Architecture
![WhatsApp Image 2026-01-02 at 5 02 16 AM](https://github.com/user-attachments/assets/83d69125-8f5f-444e-9619-5796fe69af0c)



The system follows a **3-Tier Architecture**:

1. **Client:** React Native App (Handles UI, Socket Client, Local Storage).
2. **Server:** Node.js/Express (Handles API Routes, Socket Server, Auth Logic).
3. **Data:** MongoDB Atlas (Stores Users, Messages, Relationships).

---

## 🚀 Future Roadmap & Research Goals

This project is currently in **Phase 2 (Optimization)**. The upcoming phases focus on the core M.Tech research topics.

### 🔹 Phase 3: UI/UX Refinement (In Progress)

* [ ] **Avatars:** Visual user identification with initial-based coloring.
* [ ] **Typing Indicators:** Real-time feedback ("Rahul is typing...").
* [ ] **Date Separators:** Grouping messages by "Today", "Yesterday".
* [ ] **Read Receipts:** Blue ticks for message status.

### 🔹 Phase 4: Advanced Security (Research Core)

* [ ] **End-to-End Encryption (E2EE):** Implementing Client-Side Encryption so the server *cannot* read messages.
* [ ] **Algorithm Comparison:** Benchmarking **AES-256** vs **ChaCha20** vs **Signal Protocol** for performance on mobile devices.
* [ ] **Performance Metrics:** Measuring battery drain and CPU usage during encryption tasks.

### 🔹 Phase 5: Production

* [ ] **Email/OTP Authentication:** replacing simple username/password.
* [ ] **Play Store Deployment:** Publishing the beta version for peer testing.

---

Here is the updated **"How to Run Locally"** section for your README.

Since both your backend and frontend are now in the single `mayyank1/Raaibar` repository, we just need to instruct people to clone it once and then open two terminals (one for each folder).

---

## 💻 How to Run Locally

### Prerequisites

* Node.js & npm
* React Native Environment (Android Studio/SDK)
* MongoDB Atlas Connection String

### 1. Clone the Repository

Download the full project (Frontend + Backend) to your machine.

```bash
git clone https://github.com/mayyank1/Raaibar.git
cd Raaibar

```

### 2. Backend Setup (Terminal 1)

Navigate to the backend folder to start the server.

```bash
# Enter the backend directory 
cd backend 

# Install dependencies
npm install

# Start the Node.js Server
node index.js
# Server should run on port 3000

```

### 3. Frontend Setup (Terminal 2)

Open a **new terminal window**, go to the project root, and launch the mobile app.

```bash
# Enter the frontend directory
cd RaaibarApp

# Install dependencies
npm install

# Start the Metro Bundler
npx react-native start

# (In a separate terminal or split pane) Run on Android Emulator/Device
npx react-native run-android

```

---

## 👨‍💻 Author

**Mayank Gaur** *M.Tech Scholar (Computer Science)* *Govind Ballabh Pant Institute of Engineering & Technology, Pauri*

---

*This project is for educational and research purposes.*
