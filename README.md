# Where2Buy (Laravel Backend)

A crowdsourced mobile application where users can ask where to find a specific item, and other users can respond with locations and information.

Originally developed as a university project using pure PHP and Java (native Android), this version was rebuilt with Laravel as a REST API backend and a React-based web interface. The API is shared between the React web application and the Flutter mobile application.

This project consists of two applications:
- Laravel + React web application (this repository)
- Flutter mobile application [https://github.com/heyitsmocha/where2buy-flutter]

## Technical Features
- Architecture: REST API consumed by both web and mobile clients
- Authentication: Laravel Sanctum for API authentication and SPA session authentication
- Database: MySQL with geospatial data support for location-based queries
- Web Interface: Inertia.js + React, Shadcn, Base UI, Tailwind CSS
- Maps: OpenStreetMap integration with Leaflet

## Demo
<details>
    <summary>Item Search</summary>
    
https://github.com/user-attachments/assets/a58baba1-a8e4-448e-b75c-7ed8886b746a

https://github.com/user-attachments/assets/092ec972-f3ce-4bba-ae0f-ac74f099ff33
</details>
<details>
    <summary>Login</summary>
    
https://github.com/user-attachments/assets/041a2855-474b-473a-b64c-db984ae43c1c

https://github.com/user-attachments/assets/4aaef3b2-96aa-4b2c-92e1-b9cad5599f53    
</details>
<details>
    <summary>View Responses</summary>

https://github.com/user-attachments/assets/50ffa989-7ecc-4174-bc9c-9466ef3646db

https://github.com/user-attachments/assets/dc5b746e-4740-4644-9e60-91f051f79f6b
</details>

## Requirements
- This project was tested on PHP 8.2.25 and MySQL 8.0.30.
- MySQL 8.0+ is required for geospatial data compatibility.
  
## Setup
1. Clone the repository:
   ```
   git clone https://github.com/heyitsmocha/where2buy-laravel.git
   cd where2buy-laravel
   ```
2. Install PHP dependencies:
   ```
   composer install
   ```
3. Install Node dependencies:
   ```
   npm install
   ```
4. Copy the environment file:
   ```
   cp .env.example .env
   ```
   or on Windows:
   ```
   copy .env.example .env
   ```
5. Generate the application key:
   ```
   php artisan key:generate
   ```
6. Migrate the database:
   ```
   php artisan migrate
   ```
7. (Optional) Seed the database:
   ```
   php artisan db:seed --class=DatabaseSeeder
   ```
    This will create a user with the following credentials:
   - Email: `test@example.com`
   - Password `password`

9. Start the development server:
   ```
   composer run dev
   ```

## Accessing the Backend

On the backend host machine, the application is available at:
```
http://localhost:8000
```

On other devices on the same network:
- Web application:
  ```
  http://<host-pc-local-ip>:8000
  ```
- Flutter app:
    - Set `API_BASE_URL` in the Flutter project's `.env` file to
      ```
      http://<host-pc-local-ip>:8000/api/
      ```
    - If the backend is hosted on a DHCP-enabled network, the machine's IP address may change over time (e.g. after reconnecting to the network or restarting the router). If the Flutter app can no longer connect, verify the host machine's current local IP address (e.g. `192.168.x.x` or `10.x.x.x`) and update `API_BASE_URL` if needed.
    - For a permanent setup, consider configuring a DHCP reservation or assigning a static IP address to the backend machine.
