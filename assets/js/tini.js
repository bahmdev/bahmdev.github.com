$( document ).ready(function() {

    var audio = new Audio("assets/media/music.mp3");
    audio.loop = true;
    var links = ["https://xkcd.com/149/"];
    links.push("https://www.xkcd.com/303/");
    links.push("https://www.xkcd.com/153/");
    links.push("https://www.xkcd.com/138/");
    links.push("https://www.youtube.com/watch?v=pEsZkTTgydc");
    links.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    links.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    links.push("https://github.com/NARKOZ/hacker-scripts");

    $("#chat").click(function(){
        //window.location.href="http://maps.google.com/maps?q="+data["loc"];
        window.open(links[Math.floor(Math.random() * links.length)]);

    });


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
            introText: 'Made with <3 just for you | Ask me anything!',
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

    Smooch.on('message:sent', function(message) {
        var rspns = message.text
        var lines = rspns.split(" ");
        var cmd = lines[0];

        if (cmd == "/help") {
            Smooch.sendMessage("=> COMMANDS:" +
                "\n/help\n/resume\n/email\n/python\n/github\n/twitter\n/linkedin\n/togglemusic \<rate\>\n/location");
        } else if (cmd == "/email") {
            Smooch.sendMessage("=> bahmdev@gmail.com");
        } else if (cmd == "/resume") {
            Smooch.sendMessage("=> I'll put the link to that soon.");
        } else if (cmd == "/python") {
            window.open("https://repl.it/languages/python");
            Smooch.sendMessage("=> Disable pop up blocker please if it didn't work");
        } else if (cmd == "/github") {
            window.location.href = "https://github.com/bahmdev";
        } else if (cmd == "/twitter") {
            window.location.href = "https://twitter.com/bahmdev";
        } else if (cmd == "/linkedin") {
            window.location.href = "https://www.linkedin.com/in/bahmdev";
        } else if (cmd == "/togglemusic") {
            if (audio.paused) {
                if (lines.length > 1)
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

        } else if (cmd.charAt(0) == "/"){
            Smooch.sendMessage("=> Invalid Command, type /help for information.");
        }

    });







});