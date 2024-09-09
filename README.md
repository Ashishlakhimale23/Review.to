# Review.to

Review.to is a powerful tool designed to help users collect and display testimonials on their websites. It provides an easy way to gather reviews from customers and create an attractive "wall of love" to showcase positive feedback.

## Purpose

The main purpose of this repository is to:
1. Collect reviews from users
2. Provide code that can be easily integrated into a user's website to display gathered testimonials

## Key Features

- **Space Creation**: Users can create a dedicated space for collecting reviews.
- **Custom Review Form**: After creating a space, users receive a unique link to a review form that can be shared with their customers.
- **Testimonial Selection**: Users can select specific testimonials to be displayed.
- **Wall of Love**: Create a visually appealing masonry grid of selected testimonials.
- **Single Testimonial Addition**: Users have the option to add individual testimonials manually.

## Technologies Used

- MERN Stack (MongoDB, Express.js, React.js, Node.js) with TypeScript
- Firebase for OAuth authentication
- TanStack Query for data fetching and caching
- Zod for schema validation
- Recoil for state management
- Cloudinary for image storage

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Ashishlakhimale23/Review.to.git
   ```
2. Navigate to the project directory:
   ```
   cd Review.to
   ```
3. Install dependencies for both backend and frontend:
   ```
   cd backend && npm install
   cd frontend && npm install
   ```

## Environment Setup

### Backend (.env file)

Create a `.env` file in the `backend` directory with the following variables:

```
DB_URL=<your_mongodb_url>
FIREBASE_TYPE=<firebase_type>
FIREBASE_PROJECT_ID=<your_firebase_project_id>
FIREBASE_PRIVATE_KEY_ID=<your_firebase_private_key_id>
FIREBASE_PRIVATE_KEY=<your_firebase_private_key>
FIREBASE_CLIENT_EMAIL=<your_firebase_client_email>
FIREBASE_CLIENT_ID=<your_firebase_client_id>
FIREBASE_AUTH_URI=<your_firebase_auth_uri>
FIREBASE_TOKEN_URI=<your_firebase_token_uri>
FIREBASE_AUTH_PROVIDER_URL=<your_firebase_auth_provider_url>
FIREBASE_UNIVERSE_DOMAIN=<your_firebase_universe_domain>
CLOUDINARY_NAME=<your_cloudinary_name>
API_KEY=<your_cloudinary_api_key>
API_SECRET=<your_cloudinary_api_secret>
UPLOAD_PRESET=<your_cloudinary_upload_preset>
PORT=8000
```

### Frontend (.env file)

Create a `.env` file in the `frontend` directory with the following variables:

```
BASE_URL=<your_backend_base_url>
FIREBASE_APIKEY=<your_firebase_api_key>
FIREBASE_AUTHDOMAIN=<your_firebase_auth_domain>
FIREBASE_PROJECTID=<your_firebase_project_id>
FIREBASE_STORAGEBUCKET=<your_firebase_storage_bucket>
FIREBASE_MESSAGINGSENDERID=<your_firebase_messaging_sender_id>
FIREBASE_APPID=<your_firebase_app_id>
FIREBASE_MEASUREMENTID=<your_firebase_measurement_id>
```

## Usage

1. Start the backend server:
   ```
   cd backend && npm run dev
   ```
2. Start the frontend application:
   ```
   cd frontend && npm run dev
   ```
3. Access the application through your web browser at `http://localhost:5173` (or the port specified in your frontend setup).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

