# Artoo

A cloud-based file management solution built on Cloudflare's edge infrastructure.
Artoo is the client side component of the Artoo file management system. It provides a modern user interface for secure file operations through Cloudflare Workers and R2 storage.

api side: https://github.com/b-rucel/artoo-api

## Features

- **Modern File Management**:
  - Browse files and directories with intuitive navigation
  - Upload files with progress tracking
  - Download files directly from the browser
  - View file details and previews
- **User Experience**:
  - Responsive design for desktop and mobile devices
  - Dark and light theme support
  - Hierarchical folder tree navigation
  - Grid and list view options
- **Security**:
  - JWT-based authentication
  - Secure API communication
  - Protected routes for authenticated users

## Self-Hosting Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or bun package manager
- A running instance of the [Artoo API](https://github.com/b-rucel/artoo-api)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/b-rucel/artoo.git
   cd artoo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure the environment:
   Create or modify `.env` file in the project root:
   ```
   VITE_ARTOO_API_URL='https://your-artoo-api-url/api'
   ```
   Replace `your-artoo-api-url` with your deployed Artoo API endpoint.

4. Build for production:
   ```bash
   npm run build
   # or
   bun run build
   ```

5. Deploy the contents of the `dist` directory to your preferred hosting service:
   - Cloudflare Pages
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static file hosting

### Deployment Options

#### Cloudflare Pages (Recommended)

For the best performance with your Artoo API running on Cloudflare Workers:

1. Log in to your Cloudflare dashboard
2. Navigate to Pages and create a new project
3. Connect your GitHub repository or upload the `dist` directory
4. Configure build settings if deploying directly from source:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Set environment variables (including `VITE_ARTOO_API_URL`)
6. Deploy

## Local Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or bun package manager
- A running instance of the Artoo API (local or remote)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/b-rucel/artoo.git
   cd artoo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure the environment:
   Create or modify `.env` file in the project root:
   ```
   VITE_ARTOO_API_URL='http://localhost:8787/api'
   ```
   Adjust the URL to point to your development API endpoint.

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Access the application at http://localhost:5173

## Technology Stack

- React 19
- Vite
- Tailwind CSS
- Shadcn UI components
- Lucide React icons

## User Management

The Artoo UI connects to the Artoo API for authentication. Users are managed through the API's KV namespace. See the [API documentation](https://github.com/b-rucel/artoo-api) for details on how to add and manage users.

## Browser Compatibility

The application is compatible with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
