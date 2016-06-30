var fs = require("fs");
var spritesmith = require("spritesmith");

const SPRITESHEET_FILEPATH = __dirname+"/../.tmp/twitch-sprites.png";

function createSpritesheet(streams) {
    return new Promise((resolve, reject) => {
        var thumbnails = streams.map(stream => stream.thumbnail);
        var options = {
            src: thumbnails,
            padding: 0
        };

        spritesmith.run(options, function(err, result) {

            if (err) {
                console.log(err);
                return reject(err);
            }

            streams = streams.map(stream => {
                var coords = result.coordinates[stream.thumbnail];

                stream.sprite = {
                    x: coords.x,
                    y: coords.y,
                    width: coords.width,
                    height: coords.height,
                };

                return stream;
            });

            fs.writeFile(SPRITESHEET_FILEPATH, result.image, err => {
                if (err) {
                    reject(err);
                }

                resolve(streams);
            });

        });
    });
}

module.exports = {
    createSpritesheet: createSpritesheet
};
