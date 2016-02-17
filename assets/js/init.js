 $( document ).ready(function() {

	      $("#chat").click(function(){
	            //window.location.href="http://maps.google.com/maps?q="+data["loc"];
	            window.location.href="https://goo.gl/kak4Ry";
	      });

          var GetIpInfo = function(ipAddr) {
			var info = null;
			var infoUrl = "http://ipinfo.io/" + ipAddr;
				$.ajax({
				url: infoUrl,
				type: 'GET',
				dataType: 'json',
				async: false,
				success: function(data) {
				    info = data;
				}
			});
			return info;
		};

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
              
            }).error(function() { swal("Hey You!", "Why don't you disable ad block on mysite.")
 });




            Smooch.updateUser({
                givenName: city+', '+country,
                surname: userip,
            });


            

          });

          Smooch.init({
            appToken: '6xysum4913o3cfreb9rik8dyb',
            customText: {
              headerText: 'Say Hi!',
              inputPlaceholder: 'Type a message...',
              sendButtonText: 'Send',
              introText: 'Come on, you do not have to be shy,<br/> Ask me anything!',
              settingsText: 'You can leave me your email so that I can get back to you if you want.'
            }
          });

          
			
         


});