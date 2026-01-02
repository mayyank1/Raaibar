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

* **Distributed System:** Migrated from localhost (`adb reverse`) to a fully deployed cloud backend.
* **Live Database:** Persistent data storage using **MongoDB Atlas**, accessible from any network.
* **Auto-Deployment:** CI/CD integration where pushes to `main` automatically trigger server rebuilds on Render.

### ⚡ Real-Time Communication

* **Socket.io Integration:** Replaced inefficient "Short Polling" (2-second intervals) with persistent **WebSocket** connections.
* **Instant Messaging:** Bi-directional event-based communication for zero-latency message delivery.
* **Room-Based Routing:** Secure message routing where users join private "rooms" identified by their username.

### 🎨 Enhanced Chat UI/UX

* **Smart Avatars:** Dynamic initial-based colored avatars for visual user distinction.
* **Typing Indicators:** Real-time feedback ("Rahul is typing...") for an immersive experience.
* **Read Receipts:** WhatsApp-style status indicators (Grey ticks → Blue ticks) confirming read status in real-time.
* **Date Separators:** Intelligent message grouping with headers for "Today", "Yesterday", and specific dates.
* **Custom Branding:** Professional App Icon and themed Splash Screen.

### 🔐 Authentication & Security

* **Secure Handshake:** JSON-based login verification against the cloud database.
* **Persistent Session:** Auto-login functionality using `AsyncStorage` to maintain user sessions across app restarts.
* **Friend System:** Full request/accept workflow to ensure users only chat with approved contacts.

---

## 🏗️ System Architecture
![System Architecture Diagram](https://github.com/user-attachments/assets/83d69125-8f5f-444e-9619-5796fe69af0c)

The system follows a **3-Tier Architecture**:

1. **Client:** React Native App (Handles UI, Socket Client, Local Storage).
2. **Server:** Node.js/Express (Handles API Routes, Socket Server, Auth Logic).
3. **Data:** MongoDB Atlas (Stores Users, Messages, Relationships).

---

## 🚀 Project Roadmap & Research Goals

This project has evolved through iterative phases, moving from a basic prototype to a research-grade application.

### ✅ Phase 1: Foundation (Completed)
* [x] **Monolithic Setup:** Initial development using localhost and `adb reverse` for Android.
* [x] **Basic Messaging:** REST API-based messaging using Short Polling (2-second intervals).
* [x] **Local Database:** Setup with local MongoDB instance.
* [x] **Core UI:** Basic Chat Screen and Home Screen implementation.

### ✅ Phase 2: Cloud & Connectivity (Completed)
* [x] **Cloud Migration:** Deployed backend to Render PaaS and database to MongoDB Atlas.
* [x] **Real-Time Upgrade:** Migrated from REST Polling to **Socket.io (WebSockets)** for zero latency.
* [x] **Authentication:** Implemented Signup/Login logic with Persistent Sessions (AsyncStorage).
* [x] **Friend System:** Added bi-directional friendship requests and approval logic.

### ✅ Phase 3: UI/UX Refinement (Completed)
* [x] **Avatars:** Visual user identification with initial-based coloring.
* [x] **Typing Indicators:** Real-time feedback ("Rahul is typing...").
* [x] **Date Separators:** Grouping messages by "Today", "Yesterday".
* [x] **Read Receipts:** Blue ticks for message status.
* [x] **Branding:** Custom App Icon & Splash Screen.

### 🔹 Phase 4: Advanced Security (Research Core)
* [ ] **End-to-End Encryption (E2EE):** Implementing Client-Side Encryption so the server *cannot* read messages.
* [ ] **Algorithm Comparison:** Benchmarking **AES-256** vs **ChaCha20** vs **Signal Protocol** for performance on mobile devices.
* [ ] **Performance Metrics:** Measuring battery drain and CPU usage during encryption tasks.

### 🔹 Phase 5: Production
* [ ] **Email/OTP Authentication:** Replacing simple username/password with secure 2-step verification.
* [ ] **Play Store Deployment:** Publishing the beta version for peer testing.

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