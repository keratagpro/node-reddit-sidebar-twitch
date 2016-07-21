const fs = require("fs");
const spritesmith = require("spritesmith");

function createSpritesheet(streams, filename = 'stream-sprites.png') {
    return new Promise((resolve, reject) => {
        var thumbnails = streams.map(stream => stream.thumbnail);
        var options = {
            src: thumbnails,
            padding: 0,
            algorithm: "top-down",
            algorithmOpts: {
                sort: false
            }
        };

        spritesmith.run(options, function(err, result) {
            if (err) {
                return reject(err);
            }

            fs.writeFile(filename, result.image, err => {
                err ? reject(err) : resolve(streams);
            });

        });
    });
}

module.exports = {
    createSpritesheet
};
