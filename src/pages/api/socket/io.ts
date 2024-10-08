import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIo } from 'socket.io'
import { NextApiResponseServerIO } from '@/type'

export const config = {
    api: {
        bodyParser: false
    }
}

const IoHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        const path = '/api/socket/io'
        const httpServer: NetServer = res.socket.server as any
        const io = new ServerIo(httpServer, {
            path: path,
            addTrailingSlash: false
        })
        res.socket.server.io = io
    }
    res.end()
}

export default IoHandler
