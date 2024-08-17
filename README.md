# Discord Clone

This project is a full-featured Discord clone that replicates core functionalities such as video calls, audio calls, servers, channels, and image/PDF uploads.

## Features

- **Video Calls**: Seamless video communication with peers.
- **Audio Calls**: High-quality voice communication.
- **Servers**: Create and manage servers with various channels.
- **Chat**: Real-time messaging with websockets.
- **Channels**: Organized communication with multiple channels within a server.
- **Image/PDF Upload**: Easily share images and PDFs within chats.

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **TypeScript**: type safety.
- **Socket.IO**: Real-time, bidirectional communication between web clients and servers.
- **TanStack/Query**: Powerful data synchronization and caching for server-state management.
- **Prisma**: Next-generation ORM for database access and migrations.
- **PostgreSQL**: Relational database system used for storing persistent data.
- **UploadThing**: Simplified file uploading service.
- **LiveKit**: Scalable infrastructure for real-time audio and video.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **shadcn/ui**: Pre-build components with typescript and tailwind.
- **zod**: TypeScript-first schema declaration and validation library.
- **Zustand**: A small, fast, and scalable bearbones state management solution.
- **Kinde**: Simple, powerful authentication and customer identity.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PatelTirth25/discord-clone.git
   cd discord-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be running at `http://localhost:3000`.

## Environment Variables

- KINDE_CLIENT_ID=<YOUR_KINDE_CLIENT_ID>
- KINDE_CLIENT_SECRET=<YOUR_KINDE_CLIENT_SECRET>
- KINDE_ISSUER_URL=<YOUR_KINDE_ISSUER_URL>
- KINDE_SITE_URL=http://localhost:3000
- KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
- KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/

- UPLOADTHING_SECRET=<YOUR_UPLOADTHING_SECRET>
- UPLOADTHING_APP_ID=<YOUR_UPLOADTHING_APP_ID>

- NEXT_PUBLIC_SITE_URL=http://localhost:3000

- DATABASE_URL=<YOUR_DATABASE_URL>

- LIVEKIT_API_KEY=<YOUR_LIVEKIT_API_KEY>
- LIVEKIT_API_SECRET=<YOUR_LIVEKIT_API_SECRET>
- NEXT_PUBLIC_LIVEKIT_URL=<YOUR_LIVEKIT_URL>

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

