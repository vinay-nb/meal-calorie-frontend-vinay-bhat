# Meal Calorie Tracker 🥗

A production-ready web application designed to help users track their nutrition instantly. Simply enter a dish name and serving size, and get a complete breakdown of calories and macronutrients.

## 🚀 Getting Started

To get the project running locally, follow these simple steps:

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd meal-calorie-count-generator
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add your API base URL:
    ```env
    NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## 🧠 Tech Decisions & Trade-offs

### **Why IndexedDB for Search History?**
We chose **IndexedDB** over standard LocalStorage for managing the user's recent search history for a few key reasons:
*   **Handling Large Datasets**: While LocalStorage is capped at ~5MB, IndexedDB is designed to handle significantly larger datasets. This allows our app to store detailed meal breakdowns and raw API responses without worrying about hitting browser storage limits.
*   **Asynchronous Operations**: Writing and reading operations in IndexedDB are asynchronous. This is a huge advantage for performance because it prevents the storage logic from blocking the main UI thread, ensuring that the user experience remains smooth and responsive even as their history grows.
*   **Robust Data Structure**: It provides a more powerful indexing system, making it easier to manage unique entries and complex objects compared to the simple string-based storage of LocalStorage.

### **Security: HTTP-Only Cookies**
For handling sensitive session data, we opted for **HTTP-Only cookies** to ensure maximum protection.
*   **XSS Protection**: By setting cookies with the `HttpOnly` flag, we make them inaccessible to client-side JavaScript. This is a critical defense against Cross-Site Scripting (XSS) attacks, as it prevents malicious scripts from stealing session tokens even if they manage to run on the page.
*   **Seamless Auth**: This method allows the browser to automatically handle token transmission with each request, reducing the amount of manual token management needed in the frontend code.

### **Zustand for State Management**
We use **Zustand** for global state management because it's lightweight and easy to use. It handles our authentication state and meal search history, syncing perfectly with our IndexedDB persistence layer to keep your data safe across page reloads.

## **ScrenShots
<img width="1470" height="834" alt="Screenshot 2026-05-09 at 4 10 47 PM" src="https://github.com/user-attachments/assets/4df942ec-396c-472a-9689-f1c08ababb45" />
<img width="1470" height="834" alt="Screenshot 2026-05-09 at 4 11 02 PM" src="https://github.com/user-attachments/assets/0e435058-eed7-4cf2-96d4-60cc08bcbd23" />
<img width="1470" height="834" alt="Screenshot 2026-05-09 at 4 11 18 PM" src="https://github.com/user-attachments/assets/03964a04-8fc5-46f7-82f8-ceb3ba6da205" />
<img width="343" height="744" alt="Screenshot 2026-05-09 at 4 13 56 PM" src="https://github.com/user-attachments/assets/4899d346-9bc0-4fb5-8871-1e6429686327" />
<img width="1470" height="835" alt="Screenshot 2026-05-09 at 4 14 33 PM" src="https://github.com/user-attachments/assets/2955ab98-6172-4615-88b4-6c42d19d00e8" />


