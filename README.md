# 🎬 YouTube Clone – Frontend

A **full‑featured YouTube Clone frontend** built with **React + Vite**, focusing on **real‑world frontend architecture**, **state management**, and **smooth user experience**.
This frontend consumes a **custom backend API (deployed on Render)** and implements most of the core features you’d expect from a modern video‑streaming platform.

> ⚠️ This is one of my **best and most complete projects so far**, built to demonstrate **production‑level frontend skills** rather than just UI cloning.

---

## ✨ Highlights

* ⚛️ **React 19 + Vite** for fast development and optimized builds
* 🧠 **Redux Toolkit + Redux Persist** for scalable state management
* 🔐 **Authentication with cookie‑based sessions & refresh tokens**
* 🎨 **Tailwind CSS + shadcn/ui (Radix UI)** for clean, accessible UI
* 🔁 **Axios interceptors** for automatic token refresh
* 🦴 Skeleton loaders & smooth loading states
* 📱 Fully responsive layout

---

## 🛠 Tech Stack

### Frontend

* **React 19**
* **Vite**
* **React Router DOM**
* **Redux Toolkit**
* **Redux Persist**
* **Axios**
* **Tailwind CSS**
* **shadcn/ui (Radix UI)**
* **Formik + Yup** (forms & validation)
* **Lucide Icons**
* **Sonner** (toast notifications)

### Backend

* Custom **Node.js + Express + MongoDB** API
* Deployed on **Render**

---

## 📁 Project Structure

```txt
src/
├── assets/        # Static assets
├── components/    # Reusable UI components
├── features/      # Redux slices (video, user, playlist, etc.)
├── hooks/         # Custom React hooks
├── lib/           # Utility helpers
├── pages/         # Route‑level pages
├── routes/        # App routing & protected routes
├── store/         # Redux store configuration
├── App.jsx
├── main.jsx
```

> The project follows a **feature‑based architecture**, keeping business logic, API calls, and state management cleanly separated.

---

## 🔐 Authentication Flow

* Cookie‑based authentication (`withCredentials: true`)
* Refresh token handled via **Axios response interceptor**
* Automatic retry on `401 Unauthorized`
* Redirects to login on session expiration

```js
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      await api.post('/users/refresh_token')
      return api(error.config)
    }
  }
)
```

---

## 🧠 State Management

The app uses **Redux Toolkit** with dedicated slices for:

* `user` – auth, profile, channel, watch history
* `video` – fetch, upload, update, delete videos
* `playlist` – create, update, manage playlists
* `comment` – paginated comments with infinite loading
* `like` – likes for videos, comments & posts
* `post` – community posts (CRUD)
* `subscription` – channel subscriptions

### Persisted State

* Only `currentUser` is persisted using **Redux Persist**
* Prevents unnecessary stale data issues

---

## 🧭 Routing & Access Control

* **React Router v7**
* Protected routes using a custom `PrivateRoute`
* Login prompt shown via **Dialog instead of silent redirect**

```jsx
<Route
  path="/"
  element={
    <PrivateRoute>
      <Layout />
    </PrivateRoute>
  }
>
```

---

## 🎥 Core Features

### Videos

* Upload videos (with thumbnails)
* Edit & delete uploaded videos
* Watch page with metadata
* Like / unlike videos

### Playlists

* Create & delete playlists
* Add / remove videos
* Dedicated playlist pages

### Community Posts

* Create, edit & delete posts
* Like posts
* Global posts feed

### Comments

* Paginated video comments
* Add, edit & delete comments
* Like comments

### User & Channel

* User authentication
* Channel pages (`/:username`)
* Subscribe / unsubscribe
* Watch history
* Liked videos page

---

## 📡 API Integration

All API calls are handled via a centralized **Axios instance**:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URI,
  withCredentials: true,
});
```

> This frontend is fully integrated with the **deployed backend on Render**.

---

## 🧪 Developer Experience

* ESLint configured
* Clean folder separation
* Reusable UI components
* Consistent async state handling

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start dev server
npm run dev
```

Create a `.env` file:

```env
VITE_API_BASE_URI=your_backend_url_here
```

---

## 🎯 Why This Project Matters

This project was built to:

* Practice **real‑world frontend architecture**
* Understand **complex state flows**
* Handle **auth + refresh tokens correctly**
* Build a **scalable React application**, not just UI pages

---

## 🙌 Credits

Backend inspiration and learning foundation from **Hitesh Choudhary**
**Chai aur Code – YouTube Channel**

All implementation, architecture decisions, and frontend logic are done by me.

---

## 📌 Future Improvements

* Search suggestions
* Infinite scroll optimization
* Better video player controls
* Performance & accessibility improvements

---

## 👤 Author

**Rajendra Behera**
Full stack web developer

* Backend: [https://github.com/BRajendra10/yotube-backend](https://github.com/BRajendra10/yotube-backend)
* GitHub: [https://github.com/BRajendra10](https://github.com/BRajendra10)
* LinkedIn: [https://www.linkedin.com/in/behera-rajendra/](https://www.linkedin.com/in/behera-rajendra/)

---

⭐ If you find this project interesting, feel free to star the repo!
