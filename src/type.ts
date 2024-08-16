import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next';
import { Server as SocketIoServer } from 'socket.io'
import { Server, Member, Profile, Channel } from "@prisma/client";

export type ServerWithMemberWithProfile = Server & {
  member: (Member & { profile: Profile })[],
  channel: (Channel)[]
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer
    }
  }
}
