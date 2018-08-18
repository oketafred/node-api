const path = require('path');
const jwt     = require('jsonwebtoken');
const key = require('./key');
const download = require('image-downloader');
const fs = require('fs');
const resizeImg = require('resize-img');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./jwtoken');

const validity = (req,res,next)=>{
	let token = localStorage.getItem("jwttoken");
	if(token){
		jwt.verify(token, key.secret, function(err, decoded) {
			if (err) {
        res.send(JSON.stringify({ error: "unauthorized" }));
			}
			else{
				next();
			}
		});
	}
	else{
    res.send(JSON.stringify({ error: "unauthorized" }));
	}
	
};



const ThumbnailCreation = (req,res,next)=>{
	let url = req.query.url;
	let ext = path.extname(url);
	if(ext === '.bmp' || ext === '.jpg' || ext ==='.png'){
		//generate
		const options = {
		 url: url,
		 dest: './images'
		};

		download.image(options)
		.then(({ filename, image }) => {
			
			resizeImg(fs.readFileSync(filename), {width:50, height:50}).then(buf => {
				fs.writeFileSync("./thumbnails/"+filename, buf);
			next();
		}).catch((err) => {
			res.send("Error");
		});
 
	})
	}

	else{
		res.send('File extensions allowed- [bmp,png,jpg]');
	}

};



module.exports.validity = validity;

module.exports.ThumbnailCreation = ThumbnailCreation;