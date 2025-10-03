# URL Shortener System

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

[![Stars](https://img.shields.io/github/stars/Manojgowda898/url-shortener-system?style=for-the-badge&color=yellow)](https://github.com/Manojgowda898/url-shortener-system/stargazers)
[![Forks](https://img.shields.io/github/forks/Manojgowda898/url-shortener-system?style=for-the-badge&color=blue)](https://github.com/Manojgowda898/url-shortener-system/network/members)
[![Issues](https://img.shields.io/github/issues/Manojgowda898/url-shortener-system?style=for-the-badge&color=orange)](https://github.com/Manojgowda898/url-shortener-system/issues)
[![Last Commit](https://img.shields.io/github/last-commit/Manojgowda898/url-shortener-system?style=for-the-badge&color=success)](https://github.com/Manojgowda898/url-shortener-system/commits/main)

</div>
A production-ready URL shortener built with React + Vite, showcasing advanced algorithms and data structures with local development capabilities. 

---

## 🚀 Features

### Core Functionality
- ✅ URL shortening with custom codes (3-20 characters)
- ✅ URL validation and sanitization
- ✅ Automatic Base62 short code generation
- ✅ Real-time click tracking and analytics
- ✅ URL expiration (TTL) with automatic cleanup
- ✅ Export to CSV format
- ✅ Permanent localStorage persistence
- ✅ Cross-tab data synchronization

### Data Structures & Algorithms
- **HashMap**: O(1) URL lookup by short code using JavaScript Map
- **LRU Cache**: O(1) cache for 10 most recently accessed URLs
- **Trie**: O(k) prefix-based search where k = query length
- **Hash Function**: Polynomial rolling hash with prime number (31)
- **Base62 Encoding**: Converts numbers to compact alphanumeric strings

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (HashRouter)
- **Icons**: Lucide React
- **State Management**: React Hooks + localStorage
- **Build Tool**: Vite

---

## 📁 Project Structure

```
src/
├── dataStructures/
│   ├── LRUCache.js          # LRU Cache implementation
│   └── Trie.js              # Trie data structure for search
├── utils/
│   ├── urlUtils.js          # URL utilities (hash, base62, validation)
│   └── exportUtils.js       # Export functions (CSV, JSON)
├── hooks/
│   └── useURLShortener.js   # Custom hook for URL shortener logic
├── components/
│   ├── StatsCard.jsx        # Statistics display card
│   ├── URLInput.jsx         # URL input form
│   ├── SearchBar.jsx        # Search and filter bar
│   ├── URLCard.jsx          # Individual URL card
│   ├── Redirect.jsx         # URL redirection component
│   ├── EmptyState.jsx       # Empty state component
│   └── AlgorithmInfo.jsx    # Algorithm information display
└── App.jsx                  # Main application component
```
---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Manojgowda898/url-shortener-system
cd url-shortener
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
---

## 📚 Usage Examples

### Basic URL Shortening
```javascript
// Input: https://www.example.com/very/long/url
// Output: http://localhost:5173/#/r/abc123
```

### Custom Code
```javascript
// URL: https://github.com/Manojgowda898
// Custom Code: "mygithub"
// Result: http://localhost:5173/#/r/mygithub
```

### With Expiration
```javascript
// URL: https://event.com
// Expiry: 7 days
// Link auto-expires after 7 days
```
---

## 🔍 Algorithm Details

<div align="center">

### 🏗️ Architecture & Performance

| Data Structure | Time Complexity | Implementation |
|---------------|----------------|----------------|
| ![HashMap](https://img.shields.io/badge/HashMap-FF6B6B?style=flat-square) | O(1) Lookup | JavaScript Map |
| ![LRU Cache](https://img.shields.io/badge/LRU_Cache-4ECDC4?style=flat-square) | O(1) Access | Custom Class |
| ![Trie](https://img.shields.io/badge/Trie-45B7D1?style=flat-square) | O(k) Search | Prefix Tree |
| ![Base62](https://img.shields.io/badge/Base62-96CEB4?style=flat-square) | O(log n) | Encoding |
| ![Hashing](https://img.shields.io/badge/Hashing-FECA57?style=flat-square) | O(n) | Polynomial Hash |

</div>

### Hash Function

```javascript
// Polynomial rolling hash with prime 31
hash = (hash * 31 + charCode) % 1000000
```
- **Time Complexity**: O(n) where n = URL length
- **Collision Resolution**: Combines hash with timestamp

### Base62 Encoding
```javascript
// Converts number to base62 string
// Character set: 0-9, a-z, A-Z (62 characters)
// Example: 123456 → "W7e"
```
- **Time Complexity**: O(log₆₂(n))
- **Space Efficiency**: Shorter than base10 or base16

### LRU Cache
```javascript
// Capacity: 10 URLs
// Eviction: Least Recently Used
// Access: O(1)
```
- Stores frequently accessed URLs
- Improves performance for hot URLs

### Trie Search
```javascript
// Prefix-based search
// Example: "goo" matches "google.com", "goodreads.com"
```
- **Time Complexity**: O(m) where m = prefix length
- **Space Complexity**: O(ALPHABET_SIZE × N × M)

---

## 🎯 API Reference

### useURLShortener Hook

```javascript
const {
  urls,              // Array of URL objects
  stats,             // { total: number, clicks: number, active: number }
  error,             // Current error message
  setError,          // Set error message
  createShortUrl,    // (longUrl, customCode, expiryDays) => URL object
  handleUrlClick,    // (code) => void (tracks clicks + opens URL)
  deleteUrl,         // (code) => void
  searchUrls,        // (query) => filtered URLs
  lruCache,          // LRU Cache instance
  trie               // Trie instance
} = useURLShortener();

```

### Utility Functions

```javascript
// URL Validation
isValidUrl(url: string): boolean

// Hash Generation
hashUrl(url: string): number

// Base62 Encoding
toBase62(num: number): string

// Short Code Generation
generateShortCode(url: string): string

// Custom Code Validation
isValidCustomCode(code: string): boolean

// Expiration Check
isExpired(url: object): boolean

// QR Code Generation
generateQRCode(text: string): string

// Export to CSV
exportToCSV(urls: Array): void

// Export to JSON
exportToJSON(urls: Array): void
```

---

## 🧪 Testing Scenarios

### Test URL Shortening
```javascript
1. Enter: https://youtube.com/watch?v=abc123
2. Get: http://localhost:5173/#/r/002FMG
3. Click: Opens YouTube + increments counter
```

### Test Custom Codes
```javascript
1. Create: URL + "mygithub" custom code
2. Result: http://localhost:5173/#/r/mygithub
3. Conflict: "Custom code already taken" error
```

### Test URL Expiration
```javascript
1. Create URL with expiry: 0.001 days
2. Wait 2 minutes
3. Try to click the URL
4. Expected: "This link has expired" error
```

### Test LRU Cache
```javascript
1. Create 15 URLs
2. Click URLs #1-3 (now in cache)
3. Click URLs #4-13 (cache updates)
4. URLs #1-3 evicted from cache
```

### Test Search Functionality
```javascript
// Search terms that work:
"youtube"    → Finds YouTube URLs
"github"     → Finds GitHub URLs  
"002"        → Finds by short code prefix
"watch"      → Finds watchseries.bar
```

### Test Data Persistence
```javascript
1. Create several URLs
2. Refresh browser (F5)
3. All URLs and stats maintained via localStorage
4. Close/reopen browser - data persists
```
### Test Redirect System
```javascript
1. Copy: http://localhost:5173/#/r/002FMG
2. Paste in new tab → Redirects to original URL
3. Click tracking works for both in-app and direct visits
```

---

## 📊 Performance Metrics
## ⚡ Performance Metrics

<div align="center">

![URL Creation](https://img.shields.io/badge/URL_Creation-O(n)-success?style=flat-square)
![URL Lookup](https://img.shields.io/badge/URL_Lookup-O(1)-brightgreen?style=flat-square)
![Search](https://img.shields.io/badge/Search-O(k)-blue?style=flat-square)
![Cache](https://img.shields.io/badge/Cache-O(1)-orange?style=flat-square)

</div>

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Create URL | O(n) | O(n) |
| Lookup URL | O(1) | O(1) |
| Search URLs | O(m) | O(1) |
| Click URL | O(1) | O(1) |
| Delete URL | O(n) | O(1) |
| Cache Access | O(1) | O(capacity) |

Where:
- n = URL length
- m = search query length

---

## 📸 Screenshots & Demo
* ### Dashboard Overview 
![Dashboard Overview](assets/screenshots/dashboard-overview.png)

* ### URL Shortening Process 
![URL Shortening Process ](assets/screenshots/url-shortening.png)

* ### Search & Filter Functionality 
![Search & Filter Functionality](assets/screenshots/search-filter.png)

* ### Analytics & Click Tracking 
![Analytics & Click Tracking](assets/screenshots/analytics.png)

* ### Mobile Responsive Design 
![Mobile Responsive Design](assets/screenshots/mobile-view.png)

* ### Live Demo 
![Live Demo](assets/screenshots/demo.gif)

* ### Export Functionality 
[View CSV Export Example](assets/screenshots/dashboard.png)

---

## 🌐 Local Development Features

- Port: 5173 (Vite default)
- Routing: HashRouter for client-side routing
- Redirects: Full redirect system for copied URLs
- Persistence: localStorage (survives browser restarts)
- Analytics: Complete click tracking with timestamps

---

## 🔒 Security Features

- UURL validation with native URL constructor
- XSS prevention through React DOM escaping
- Input sanitization for custom codes
- No external dependencies for core logic

---

## 🚀 Future Enhancements

- User authentication
- Database persistence (MongoDB/PostgreSQL)
- Rate limiting
- Custom domains
- Bulk URL import
- Advanced analytics (geographic, device, browser)
- API endpoints
- URL preview before redirect
- Password-protected URLs
- Link grouping/folders

---

## 🙏 Acknowledgements
### Technologies & Libraries
- React: Frontend framework for building user interfaces
- Vite: Fast build tool and development server
- Tailwind CSS: Utility-first CSS framework for styling
- React Router DOM: Client-side routing for single-page applications
- Lucide React: Beautiful & consistent icon toolkit
- ES6+ JavaScript: Modern JavaScript features and syntax

### Data Structures & Algorithms
- LRU Cache: For efficient caching of frequently accessed URLs
- Trie Data Structure: For fast prefix-based search functionality
- HashMap: For O(1) lookups using JavaScript Map
- Base62 Encoding: For compact URL short code generation
- Polynomial Rolling Hash: For efficient URL hashing
---
## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting issues or pull requests.

---
