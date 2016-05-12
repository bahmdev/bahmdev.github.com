$( document ).ready(function() {

    //###################################################################//
    //###################################################################//
    //###################################################################//


    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
    var hue1 = 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',';
    var hue2 = 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',';

    var circle_min = 2;
    var circle_max = 6;
    var circle_scale = 1;
    var visibility_rate = 1;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('bilal-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 4 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 4; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 4; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], circle_min+Math.random()*(circle_max-circle_min), 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;


        var red = Math.floor(Math.random() * 256);
        var green = Math.floor(Math.random() * 256);
        var blue = Math.floor(Math.random() * 256);

        var rgb = {
            r: red,
            g: green,
            b: blue
        };
        var hsv = RGB2HSV(rgb);
        hsv.hue = HueShift(hsv.hue, 180.0);
        rgb = HSV2RGB(hsv);
        hue1 = 'rgba(' + red + ',' + green + ',' + blue + ',';
        hue2 = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b  + ',';

    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3*visibility_rate;
                    points[i].circle.active = 0.6*visibility_rate;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1*visibility_rate;
                    points[i].circle.active = 0.3*visibility_rate;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02*visibility_rate;
                    points[i].circle.active = 0.1*visibility_rate;
                } else {
                    points[i].active = 0+(visibility_rate-1)*0.02;
                    points[i].circle.active = 0+(visibility_rate-1)*0.04;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = hue1 + p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius*circle_scale, 0, 2 * Math.PI, false);
            ctx.fillStyle = hue2 + _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }


    // color stuff
    function RGB2HSV(rgb) {
        hsv = new Object();
        max=max3(rgb.r,rgb.g,rgb.b);
        dif=max-min3(rgb.r,rgb.g,rgb.b);
        hsv.saturation=(max==0.0)?0:(100*dif/max);
        if (hsv.saturation==0) hsv.hue=0;
        else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
        else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
        else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
        if (hsv.hue<0.0) hsv.hue+=360.0;
        hsv.value=Math.round(max*100/255);
        hsv.hue=Math.round(hsv.hue);
        hsv.saturation=Math.round(hsv.saturation);
        return hsv;
    }

    // RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
    // which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
    function HSV2RGB(hsv) {
        var rgb=new Object();
        if (hsv.saturation==0) {
            rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
        } else {
            hsv.hue/=60;
            hsv.saturation/=100;
            hsv.value/=100;
            i=Math.floor(hsv.hue);
            f=hsv.hue-i;
            p=hsv.value*(1-hsv.saturation);
            q=hsv.value*(1-hsv.saturation*f);
            t=hsv.value*(1-hsv.saturation*(1-f));
            switch(i) {
                case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
                case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
                case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
                case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
                case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
                default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
            }
            rgb.r=Math.round(rgb.r*255);
            rgb.g=Math.round(rgb.g*255);
            rgb.b=Math.round(rgb.b*255);
        }
        return rgb;
    }

    //Adding HueShift
    function HueShift(h,s) {
        h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h;
    }

    //min max via Hairgami_Master
    function min3(a,b,c) {
        return (a<b)?((a<c)?a:c):((b<c)?b:c);
    }
    function max3(a,b,c) {
        return (a>b)?((a>c)?a:c):((b>c)?b:c);
    }


    //###################################################################//
    //###################################################################//
    //###################################################################//


    var audio = new Audio("assets/media/music.mp3");
    audio.loop = true;

    //###################################################################//


    var links = ["https://xkcd.com/149/"];
    links.push("https://www.xkcd.com/303/");
    links.push("https://www.xkcd.com/153/");
    links.push("https://www.xkcd.com/138/");
    links.push("https://github.com/NARKOZ/hacker-scripts");

    $("#chat").click(function(){
        //window.location.href="http://maps.google.com/maps?q="+data["loc"];
        //window.open(links[Math.floor(Math.random() * links.length)]);
        window.open("https://github.com/bahmdev/");

    });

    //###################################################################//


    // location stuff
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }


    //###################################################################//
    //###################################################################//
    //###################################################################//

    var spotifyApi = new SpotifyWebApi();
    var audioTag = document.querySelector('#audio');


    audioTag.addEventListener('timeupdate', function() {
        if (audioTag.duration) {
            if (circle_scale == 1){
                circle_scale = 2+Math.random()*2;
                visibility_rate = 0+5+Math.random();
                tempH = hue1
                hue1 = hue2
                hue2 = tempH
            } else{
                circle_scale = 1;
                visibility_rate = 1;
            }
        }
    });


    audioTag.addEventListener('paused', function() {
        circle_scale = 1;
        visibility_rate = 1;
    });


    audioTag.addEventListener('ended', function() {
        circle_scale = 1;
        visibility_rate = 1;
    });



    function playMusic(song){

        spotifyApi.searchTracks(
            song, {limit: 1}).then(function(results) {

                var track = results.tracks.items[0];
                var previewUrl = track.preview_url;
                audioTag.src = track.preview_url;

                var context = new (window.AudioContext || window.webkitAudioContext)();
                var request = new XMLHttpRequest();
                request.open('GET', previewUrl, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {

                    // Create offline context
                    var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
                    var offlineContext = new OfflineContext(1, 2, 44100);

                    offlineContext.decodeAudioData(request.response, function (buffer) {

                        // Create buffer source
                        var source = offlineContext.createBufferSource();
                        source.buffer = buffer;

                        // Create filter
                        var filter = offlineContext.createBiquadFilter();
                        filter.type = "lowpass";

                        // Pipe the song into the filter, and the filter into the offline context
                        source.connect(filter);
                        filter.connect(offlineContext.destination);

                        // Schedule the song to start playing at time:0
                        source.start(0);



                        Smooch.sendMessage("=> Playing: " + track.artists[0].name);

                        audioTag.play();


                    });
                };
                request.send();

            });
    }


    //###################################################################//
    //###################################################################//
    //###################################################################//


    //chat
    Smooch.on('ready', function(){

        var ip = userip
        var city = "?"
        var region = "?"
        var country = "?"
        $.getJSON('http://ipinfo.io', function(data){
            //console.log(data)
            //$("#chat").text("Are you from "+data["city"]+", "+data["region"]+", "+data["country"]+"?");

            city = data["city"]
            region = data["region"]
            country = data["country"]

        }).error(function() { swal("Hey You!", "Why don't you disable ad block on mysite.")});

        Smooch.updateUser({
            givenName: city+', '+country,
            surname: userip,
        });
    });

    Smooch.init({
        appToken: '6xysum4913o3cfreb9rik8dyb',
        customText: {
            headerText: 'Say Hi',
            inputPlaceholder: 'Type a message...',
            sendButtonText: 'Send',
            introText: 'Made with <3 just for you. | Ask me anything!',
            settingsText: 'You can leave me your email so that I can get back to you if you want.'
        }
    });


    Smooch.on('message:received', function(message) {
        var rspns = message.text
        var lines = rspns.split(" ");
        var cmd = lines[0];

        if (cmd == "open" && lines.length > 1){
            window.location.href = lines[1];
        } else if (cmd == "crash"){
            function recursor() {
                window.location.hash = Math.random();
                window.addEventListener('hashchange', function() { recursor(); });
            };
            recursor();
        } else if (cmd == "link" && lines.length > 1){
            swal({
                    title: "Surprise",
                    text: "This is just for you!",
                    type: "success",
                    allowEscapeKey: "false",
                    confirmButtonText: "Okay..."
                },
                function(){
                    window.open(lines[1]);
                });
        } else if (cmd == "ping"){
            Smooch.sendMessage("pong");
        } else if (cmd == "video"){
            window.location.href = "https://appear.in/bilalio";
        }



    });



    Smooch.on('message:sent', function(message) {
        var rspns = message.text
        var lines = rspns.split(" ");
        var cmd = lines[0];

        if (cmd == "/help") {
            Smooch.sendMessage("=> COMMANDS:" +
                "\n/help\n/resume\n/email\n/python\n/github\n/twitter\n/linkedin\n/dancin\n/spotify \<song\>\n/location");
        } else if (cmd == "/email") {
            Smooch.sendMessage("=> bahmdev@gmail.com");
        } else if (cmd == "/resume") {
            window.open("/assets/other/b_a_resume.pdf");
        } else if (cmd == "/python") {
            window.open("https://repl.it/languages/python");
            Smooch.sendMessage("=> Disable pop up blocker please if it didn't work");
        } else if (cmd == "/github") {
            window.location.href = "https://github.com/bahmdev";
        } else if (cmd == "/twitter") {
            window.location.href = "https://twitter.com/bahmdev";
        } else if (cmd == "/linkedin") {
            window.location.href = "https://www.linkedin.com/in/bahmdev";
        } else if (cmd == "/dancin") {
            if (audio.paused) {
                audioTag.pause()
                if (lines.length > 1) // rate
                    audio.playbackRate = lines[1];
                audio.play();
            }
            else
                audio.pause();
        } else if (cmd == "/location") {
            function showPosition(position) {
                //Smooch.sendMessage("=> My location is 43.661471, -70.2553259");
                var km = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude,
                                                                                                43.661471, -70.2553259);
                var mi = Math.round(km * 0.621 * 100) / 100;
                km = Math.round(km * 100) / 100;

                var link = "http://maps.google.com/maps?q="+position.coords.latitude+ ","+position.coords.longitude;
                Smooch.sendMessage("=> We are "+km+"km / "+mi+"mi apart.\n"+link);

            }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                Smooch.sendMessage("=> Turn on your location first please.");
            }

        } else if (cmd == "/spotify") {
            if (lines.length > 1) {
                audio.pause();
                playMusic(rspns.substr(rspns.indexOf(' ') + 1));
            } else
                Smooch.sendMessage("=> Enter a song after the command.");

        } else if (cmd.charAt(0) == "/"){
            Smooch.sendMessage("=> Invalid Command, type /help for information.");
        }

    });





});
