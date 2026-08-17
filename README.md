# Pokémon Explorer 🎮

A modern and responsive **Pokémon Explorer** built with **React, TypeScript, and Vite**, using the **PokéAPI** to fetch and display Pokémon data.

The application provides an interactive experience for exploring Pokémon, searching by name, filtering by type, viewing detailed information, and loading Pokémon progressively.

---

## ✨ Features

* 🔎 **Search Pokémon**

  * Search for Pokémon by name.
  * Handles invalid Pokémon searches gracefully.

* 🃏 **Pokémon Cards**

  * Displays Pokémon image, name, ID, and types.
  * Type-based visual styling.

* 📄 **Load More**

  * Pokémon are loaded progressively instead of fetching the entire dataset at once.

* 🔍 **Pokémon Details**

  * View detailed Pokémon information.
  * Includes:

    * Pokémon image
    * Name
    * ID
    * Types
    * Height
    * Weight
    * Abilities
    * Base statistics
    * Move information

* 🎯 **Type Filtering**

  * Filter Pokémon based on their type.

* 📱 **Responsive Design**

  * Optimized for:

    * Desktop
    * Tablet
    * Mobile

* ⏳ **Loading States**

  * Provides a polished loading experience while API data is being fetched.

* ❌ **Error Handling**

  * Handles API failures, network errors, and invalid Pokémon searches.

* 🔄 **Retry Support**

  * Allows users to retry failed API requests.

* 🕳️ **Empty States**

  * Displays a helpful message when no Pokémon match the search or filter.

* ✨ **Interactive UI**

  * Smooth hover effects and transitions for a better user experience.

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **HTML5**
* **CSS3**

### API

* **PokéAPI**

### Development Tools

* **Git**
* **GitHub**
* **Vercel**
* **ESLint**

---

## 🌐 API Used

This project uses **PokéAPI**, a free public REST API that does not require authentication.

**Base URL:**

```text
https://pokeapi.co/api/v2/
```

### Endpoints Used

```text
GET /pokemon?limit=20&offset=0
```

Fetches a paginated list of Pokémon.

```text
GET /pokemon/{name}
```

Fetches detailed information about a Pokémon using its name.

```text
GET /pokemon/{id}
```

Fetches detailed information about a Pokémon using its ID.

```text
GET /type/{type}
```

Fetches Pokémon belonging to a particular type.

---

## 📁 Project Structure

```text
pokemon-app/
│
├── public/
│   └── ...
│
├── src/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   └── ...
│
├── dist/
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

The application follows a component-based architecture to keep the UI reusable, maintainable, and easy to extend.

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd pokemon-app
```

### 3. Install dependencies

```bash
npm install
```

---

## 💻 Running Locally

Start the Vite development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

The production files will be generated inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

## ⚡ Development Approach

The application follows a clean frontend architecture:

```text
PokéAPI
   ↓
API Service
   ↓
React Components
   ↓
Pokemon Cards / Details
   ↓
User Interactions
```

The UI is designed around reusable components so that functionality such as cards, search, filtering, loading states, and error states can be maintained independently.

---

## 🧩 Challenges Faced

### 1. API Integration

Handling Pokémon data required working with multiple API endpoints and managing asynchronous requests.

### 2. Loading States

Instead of leaving the UI blank while waiting for API responses, loading states are displayed to provide a better user experience.

### 3. Error Handling

The application handles cases such as:

* Pokémon not found
* API request failure
* Network errors
* Unexpected API responses

### 4. Pagination

Loading Pokémon progressively helps avoid requesting the complete Pokémon dataset at once and keeps the application responsive.

### 5. Responsive UI

The interface needed to work across different screen sizes while maintaining a consistent card-based layout.

### 6. Type-Based UI

Different Pokémon types are represented using visually distinct styling to make the information easier to understand at a glance.

---

##

---

##

---

##

---

##
