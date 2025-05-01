# 🛡️ Vulnerable Web App with GitHub CI/CD – Attack Simulation & Prevention Guide

![GitHub repo size](https://img.shields.io/github/repo-size/ChadenBA/vulnerable_app)
![GitHub last commit](https://img.shields.io/github/last-commit/ChadenBA/vulnerable_app)
![GitHub issues](https://img.shields.io/github/issues/ChadenBA/vulnerable_app)
![GitHub license](https://img.shields.io/github/license/ChadenBA/vulnerable_app)

This project is a **hands-on tutorial** for simulating real-world security attacks on a web application using **GitHub CI/CD pipelines**, and learning how to detect and prevent them using modern tools and practices.

---

## 🚀 Project Overview

The goal is to create a deliberately vulnerable web app environment and demonstrate how common attacks are executed and mitigated. This includes:

- Exposing the app with **Ngrok**
- Simulating attacks such as **XSS**, **NoSQL injection**, and **DDoS**
- Monitoring traffic using **Wireshark**
- Scanning vulnerabilities with **OWASP ZAP** and **Snyk**
- Automating the process with **GitHub Actions**

---

## 🧰 Tools & Technologies

- **GitHub Actions** – CI/CD automation
- **Ngrok** – Secure tunnels to localhost
- **OWASP ZAP** – Web vulnerability scanner
- **Wireshark** – Network protocol analyzer
- **Snyk** – Open source security scanner
- **Node.js / Express** – Simple backend for demo

---

## ⚙️ Setup Instructions

### 1. Clone the repository

   ```bash
   git clone https://github.com/ChadenBA/vulnerable_app.git
    cd vulnerable_app
 ```

2. Install dependencies

```bash
npm install
 ```
3. Start the application
```bash
node app.js
 ```


## Expose the App Using Ngrok
```bash

ngrok http 3000
 ```
