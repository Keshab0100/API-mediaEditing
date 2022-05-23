const express = require("express");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const videoShow = require('videoshow')
const Gtts = require('gtts');
const app = express();
app.use(cookieParser());
app.use(fileUpload());
const port = process.env.PORT || 8000;
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
console.log(ffmpeg.path, ffmpeg.version);

// 1. Create and store token in cookie, DONE
app.post("/create_new_storage", async (req, res) => {
  const token = await jwt.sign(
    { id: "49329325" },
    "secretKeyandItMinshouldBe32CharLong"
  );
  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({
      status: "ok",
      message: "Storage Created Successfully",
    });
});

// 2. Upload File, DONE
app.post("/upload_file", (req,res) => {
    const file = req.files.my_file;
    file.mv("../public/Uploads/" + file.name, (err, result) => {
        if(err) throw err;
        res.send({
            status: "ok",
            file_path: `../public/Uploads/${file.name}`,
        })
    })
})

// 3. Create Audio, DONE
app.post("/text_file_to_audio", (req, res) => {
    const text = fs.readFileSync('../public/Uploads/my_file.txt');
    const textFinal = text.toString();
    const gtts = new Gtts(textFinal, 'hi');
    gtts.save('../public/Uploads/audio.mp3', function (err, result) {
        if(err) { throw new Error(err) }
        console.log('Success! Open file to hear result.');
    });
    res.send({
        "status": "ok",
        "message": "text to speech converted",
        "audio_file_path": "public/Audio/"
    })    
})

// 4. Merge Image and Audio, notDONE
// app.post("/merge_image_and_audio", (req, res) => {
//     const images = ["../public/images/IMG01.jpg", "../public/images/IMG02.jpg", "../public/images/IMG03.jpg"]
//     var videoOptions = {
//         fps: 25,
//         loop: 5,
//         transition: true,
//         transitionDuration: 1,
//         format: 'mp4',
//     }
//     videoShow(images, videoOptions)
//         .audio('../public/Uploads/audio.mp3')
//         .save('../public/Uploads/video.mp4')
//         .on('start', function (command) {
//             console.log('ffmpeg process started:'+ command)
//         })
//         .on('error', function (err, stdout, stderr) {
//             console.log("Some error occured" + err)
//         })
//         .on('end', function (output) {
//             console.log('Conversion completed' + output)
//         })
//     res.send({
//         "status": "ok",
//         "message": "Video Created Successfully",
//         "video_file_path":"public/Uploads"
//     })
// })


app.listen(port, () => {
  console.log("Listening");
});
