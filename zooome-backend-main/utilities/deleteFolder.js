const fs = require('fs');
const path = require('path');

const deleteFolder = async (folderName) => {
    try {
        const folderPath = path.join(__dirname, `../media/${folderName}`);

        if (fs.existsSync(folderPath)) {
            await fs.promises.rm(folderPath, { recursive: true, force: true });
            console.log('Folder and its contents deleted successfully');
        } else {
            console.log('Folder does not exist:', folderPath);
        }
    } catch (err) {
        console.error('Error deleting folder:', err);
    }
};


module.exports = deleteFolder;