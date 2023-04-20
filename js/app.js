"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://jchvf589sh.execute-api.us-east-1.amazonaws.com/default/project4_foxmajor";

/* SUPPORTING FUNCTIONS */

// feature 0, get login info 

let loginController = () => {
	//clear any previous messages
	$('#login_message').html("");
	$('#login_message').removeClass();

	//first, let's do some client-side error trapping.
	let username = $("#username").val();
	let password = $("#password").val();
	if (username == "" || password == "" || password.length < 8 ){
		$('#login_message').html('The user name and password are both required.');
		$('#login_message').addClass("alert alert-danger text-center");
		return; //quit the function now!   
	}

	// get the data off the form
	let the_serialized_data = $("#form-login").serialize();
	console.log(the_serialized_data);

	$.ajax({
		url: endpoint01 + "/auth",
		data: the_serialized_data,
		method: "GET",
		success: (results) => {
			console.log(results);
			//login succeeded.  Set userid.
			localStorage.userid = results[0]['userid']; 
			$("#createdby").val(localStorage.userid);
			$("#createdby2").val(localStorage.userid);
			$("#createdby3").val(localStorage.userid);
			//manage the appearence of things...
			$('#login_message').html('');
			$('#login_message').removeClass();
			$('.secured').removeClass('locked');
			$('.secured').addClass('unlocked');
			$('#div-login').hide(); //hide the login page
			$("#container-3col").hide(); //hide the 3 column container
			$("#container-2col").show(); //show the 2 column container
			$('#div-cards').show();   //show the default page
			// refresh the cards page
			cardsController();
		},
		error: (data) => {
			// login failed.  Remove userid 
			localStorage.removeItem("userid");
			$('#login_message').html("Login Failed. Try again.");
			$('#login_message').addClass("alert alert-danger text-center");
		}
	})

	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};



$(document).ready( () => {

    if (localStorage.userid){
		//there is a session
		$("#container-3col").hide();
		$("#container-2col").show();
		$(".secured").removeClass("locked");		
		//show the default div
		$("#div-cards").show();		
		//assign a value to the createdby tags
		$("#createdby").val(localStorage.userid);
		$("#createdby2").val(localStorage.userid);
		$("#createdby3").val(localStorage.userid);
		// refresh the data
		cardsController();
	}

    // if no one is sign in.
    else {
		//there is no session
		$("#container-3col").show()
		$(".secured").removeClass("unlocked");
		$(".secured").addClass("locked");
		//show the login div
		$("#div-login").show();
	}

     /* ------------------  basic navigation -----------------*/	
    /* this controls navigation - show / hide pages as needed */

    /* what happens if the login button is clicked? */
	$('#btnLogin').click( () => {
		loginController();
	});

    $('#btnSignup').click( () => {
		$(".content-wrapper").hide(); // it hides the divs :D 	
		$('#div-signup').show(); 
	});

    $('#btnCancel').click( ()=> {
		$(".content-wrapper").hide(); // it hides the divs :D 	
		$('#div-login').show();   //show the default page
	});



	

});