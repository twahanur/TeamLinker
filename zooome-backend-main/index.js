const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;
const rootMiddleware = require('./middleware/rootMiddleware');
const socket = require('socket.io');
const fileUpload = require('./utilities/fileUpload');
const deleteFolder = require('./utilities/deleteFolder');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');


// Middleware
rootMiddleware(app);

// Routes
app.use('/api', require('./route/route'));
app.get('/', (req, res) => {
    res.send('Hello World ' + req.country);
});

// Server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const io = socket(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://zooome.web.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    maxHttpBufferSize: 2 * 1024 * 1024 * 1024 // 2GB limit
});

const room = {
    // roomID: [
    //     {
    //         id: 'id',
    //         name: 'sohan',
    //         role: 'admin',
    //     }
    // ]
}


io.on('connection', (socket) => {
    console.log('Socket connection established', socket.id);

    socket.on('send-request', ({ id, name }) => {
        if (room[id] && room[id]?.length > 0) {
            const adminID = room[id].find(user => user.role === 'admin');
            io.to(adminID.id).emit('send-request', { id: socket.id, name: name });
        }
        else {
            io.to(socket.id).emit('get-request', { status: true });
        }
    });

    socket.on('get-request', ({ id, status }) => {
        io.to(id).emit('get-request', { status: status });
    });


    socket.on('join-room', ({ id, name }) => {
        console.log('join-room', id);
        socket.join(id);
        let myInfo = {
            id: socket.id,
            name: name,
        }
        if (!room[id] || room[id]?.length === 0) {
            myInfo['role'] = 'admin';
            room[id] = [myInfo];
        }
        else {
            myInfo['role'] = 'user';
            room[id].push(myInfo);
        }
        io.to(socket.id).emit('me', myInfo);
        socket.to(id).emit('user-joined', myInfo);

        socket.on('send-message', (data) => {
            io.to(data?.to).emit('send-message', {
                data: data?.data,
                user: data?.userInfo || null,
                from: socket.id,
                type: data?.type,
            });
        });

        socket.on('change-video-action', (data) => {
            io.in(data?.room).emit('change-video-action', {
                ...data,
                id: socket.id,
            });
        });


        socket.on('chat-message', async (data) => {
            io.in(data?.room).emit('chat-message', data);
        });


        socket.on('disconnect',  () => {
            console.log('Socket connection disconnected', socket.id);
            Object.keys(room).map(roomID => {
                const user = room[roomID].find(user => user.id === socket.id)
                if (user) {
                    room[roomID] = room[roomID].filter(user => user.id !== socket.id);
                    if (room[roomID].length === 0) {
                        delete room[roomID];
                        deleteFolder(roomID);
                    }
                    else if (user.role === 'admin') {
                        room[roomID][0].role = 'admin';
                    }
                    socket.to(roomID).emit('user-left', {
                        id: socket.id,
                        name: user.name,
                    });
                }
            });
        });

    });
});

app.post('/chat-message', async (req, res) => {
    try {
        res.status(200).json({ message: 'Message sent successfully' });
        const file = await req?.files?.file;
        const data = await JSON.parse(req.body.data);
        console.log(file);
        if (room[data?.room]?.length > 0) {
            let newChat = await data
            if (file) {
                const fileName = await fileUpload(file, data?.room);
                newChat['file'] = fileName;
            }
            await io.in(data?.room).emit('chat-message', data);
        }
    } catch (error) {
        console.log(error);
    }
});


app.get('/media', async (req, res) => {
    try {
        const { name, room } = await req.query;
        const rootDir = await path.join(__dirname, `./media/${room}`);
        const filePath = await path.join(rootDir, name);
        if (await !fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        const mimeType = mime.lookup(filePath);
        res.setHeader('Content-Type', mimeType);

        const stream = await fs.createReadStream(filePath);
        await stream.pipe(res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/download', async (req, res) => {
    try {
        const { name, room } = await req.query;
        const rootDir = await path.join(__dirname, `./media/${room}`);
        const filePath = await path.join(rootDir, name);
        if (await !fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(filePath, name);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




