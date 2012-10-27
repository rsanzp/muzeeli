var src="http://stream.muzeeli.fr/ange";
var xml_current_song="http://www.muzeeli.fr/api/current_song.php";
var url_facebook="http://www.facebook.com/pages/Muzeeli/29845639606";
var url_twitter="http://twitter.com/muzeeli";
var url_myspace="http://www.myspace.com/muzeeli";
var radiowebsite="http://www.muzeeli.fr";
var cout_sms="0,5 euros";
var numero_sms="71018";
var motcle_sms="MUZEELI DEDI";
var radioName="Muzeeli";
var analyticsID="UA-22872647-5";

var my_media = null;
// Play audio
//
function playAudio(src) {
			if (my_media == null) {
                // Create Media object from src
				$('#message').html("Chargement du flux ...");
             my_media = new Media(src, onSuccess, onError);
            } // else play current audio
            // Play audio
            my_media.play();
        }

// Stop audio
// 
function stopAudio() {
            if (my_media) {
         
                my_media.stop();
            }
        }

// onSuccess Callback
//
function onSuccess() {
            console.log("playAudio():Audio Success");
            $('#message').html("Musique dans un instant !");
            setTimeout("hideInfo()",5000);
        }

function hideInfo() {
	$('#message').html("");
}

// onError Callback 
//
function onError(error) {
            
        }
        
$(function(){
  	  $("[data-localize]").localize("muzeeli");
})

function getSong(xml_current_song) {
	
	$.ajax( {
        type: "GET",
        url: xml_current_song,
        dataType: "xml",
        cache:false,
        success: function(xml) 
                 {
                   $(xml).find('track').each(   
                     function()
                     {
                        var title = $(this).find('title').text();
                        var artists = $(this).find('artists').text();
                        var cover = $(this).find('cover').text();
                        if (cover=="") cover="css/images/no_cover.png";
                        var callmeback = $(this).find('callmeback').text();
                        $('#title').html(title);
                        $('#artists').html(artists);
                        $('#cover').html("<img src='"+cover+"' />");
                        $('#callmeback').html(callmeback);
                        window.plugins.statusBarNotification.notify(radioName, title+' by '+artists);
                      });
                  },
       error : function()
					{
					$('#error').css("display","block");
					return;
					},
		complete : function()
					{
					var callmeback = (callmeback!="")?$('#callmeback').html():"3000";
					setTimeout("getSong(xml_current_song)",callmeback);
					}
		
    });
}

function setSocialUrl(url_facebook,url_twitter,url_myspace) {
	$('#urlfacebook').attr("href",url_facebook);
	if (url_facebook=="") {
		$('#iconefacebook').css("display","none");
	}
	$('#urltwitter').attr("href",url_twitter);
	if (url_twitter=="") {
		$('#iconetwitter').css("display","none");
	}
	$('#urlmyspace').attr("href",url_myspace);
	if (url_myspace=="") {
		$('#iconemyspace').css("display","none");
	}
	$('#radiowebsite').attr("href",radiowebsite);
	if (radiowebsite=="") {
		$('#radiowebsite').css("display","none");
	}
}

function onPhoneStateChanged(phoneState,src) 
{
    switch (phoneState) {
        case "RINGING":
            console.log('Phone is ringing.');
            stopAudio();
            break;
        case "OFFHOOK":
            console.log('Phone is off the hook.');
            break;
        case "IDLE":
            console.log('Phone has returned to the idle state.');
            playAudio(src);
            break;
        default:
            // no default...
    }
}

function shareSong() {
	//var share = new Share();
	var artists=$('#artists').html();
	var title=$('#title').html();
	window.plugins.share.show({
	    subject: radioName,
	    text: 'J\'écoute '+title+' de '+artists+' sur '+radioName+' '+radiowebsite},
	    function() {}, // Success function
	    function() {alert('Share failed')} // Failure function

	);
}


$(document).bind('pageinit',function(){
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {	
		PhoneListener.start(onPhoneStateChanged,onError)
		var largeur=$(window).width();
		$('#width').html(largeur);
		getSong(xml_current_song);
		setSocialUrl(url_facebook,url_twitter,url_myspace);
		window.plugins.analytics.start(analyticsID);
		window.plugins.analytics.trackPageView("Player");

		$('#play').click(function(event){
				playAudio(src);
			});
		$('#stop').click(function(event){
			stopAudio();
		});
		
		$('#share').click(function(event){
			shareSong();
		});
		
		$('#player').click(function(event){
			window.plugins.analytics.trackPageView("Player");
		});
		$('#sms').click(function(event){
			window.plugins.analytics.trackPageView("Dédicace");
		});
		$('#facebook').click(function(event){
			window.plugins.analytics.trackPageView("Réseaux sociaux");
		});
		$('#plus').click(function(event){
			window.plugins.analytics.trackPageView("Plus");
		});
		
		
		$('.quit').click(function(event){
			window.plugins.statusBarNotification.clear();
			navigator.app.exitApp();
		});
	 }
	
	}
);
