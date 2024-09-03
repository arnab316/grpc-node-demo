const fs = require('fs');
const path = require('path');

const PROTO_PATH = path.join(__dirname, './proto/todo.proto');

fs.access(PROTO_PATH, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`File not found: ${PROTO_PATH}`);
    } else {
        console.log(`File exists: ${PROTO_PATH}`);
    }
});
