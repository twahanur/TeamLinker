const fs = require('fs');
const path = require('path');

const fileUpload = (file, roomName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const roomPath = await path.join(__dirname, `../media/${roomName}`);
            if (!fs.existsSync(roomPath)) {
                fs.mkdirSync(roomPath, {
                    recursive: true,
                });
            }
            const uniqRandomNumber = await Math.floor(Math.random() * 10000000000);
            const currentDate = await Date.now()
            const currentFileName = await file?.name?.replaceAll(' ', '-').replaceAll('?', '-').replaceAll('&', '-')
            const newFileName = await `zooome-${uniqRandomNumber}-${currentDate}-${currentFileName}`;
            const filePath = await path.join(roomPath, newFileName);
            await file?.mv(filePath);
            resolve(newFileName);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = fileUpload;