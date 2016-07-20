var fs = require("fs");
var spritesmith = require("spritesmith");

const SPRITESHEET_FILEPATH = __dirname + "/../.tmp/stream-sprites.png";

function createSpritesheet(streams) {
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

            fs.writeFile(SPRITESHEET_FILEPATH, result.image, err => {
                err ? reject(err) : resolve(streams);
            });

        });
    });
}

module.exports = {
    createSpritesheet: createSpritesheet
};
