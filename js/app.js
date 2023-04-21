"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://jchvf589sh.execute-api.us-east-1.amazonaws.com/default/project4_foxmajor";

/* SUPPORTING FUNCTIONS */

// feature 1: create new account

let signupController = () => {

	$("#signup_message").html("");
	$("#signup_message").removeClass();

	// first, let's do some client side error trapping
	let newfirstname = $("#newfirstname").val();
    let newlastname = $("#newlastname").val();
    let newusername =  $("#newusername").val()
	let newpassword = $("#newpassword").val() //want its value, based on form input from html page
	let newpassword2 = $("#newpassword2").val()

	// if there's empty content...
	if(newusername == "" || newfirstname =="" || newlastname == "" || newpassword== "" || newpassword2== ""){
		$("#signup_message").html("All fields are required. Please try again.");
		$('#signup_message').addClass("alert alert-danger text-center");
	return; //to stop the argument :D
	}


	// if the password is too short 
	if(newpassword.length < 8 || newpassword2.length < 8){
		$("#signup_message").html("Password is too short. Please try again.");
		$('#signup_message').addClass("alert alert-danger text-center");
	return; //to stop the argument :D
	}

	// if password do not match...
	if(newpassword != newpassword2){
		$("#signup_message").html("The passwords do not match. Please try again.");
		$('#signup_message').addClass("alert alert-danger text-center");
	return; //to stop the argument :D
	}
	

	// serialize the data from the form 
	let the_serialized_data = $("#form-signup").serialize();
	console.log("the_serialized_data: "+the_serialized_data);
	// now calling the ajax call
	$.ajax({
		url: endpoint01 + "/users",
		data: the_serialized_data,
		method: "POST",
		success: (results) => {
			console.log(results)
            $("#fname").val(newfirstname);
            $("#lname").val(newlastname);
			$("#username").val(newusername); //so all the author needs to do is to click at the sign in
			$("#password").val(newpassword);
			$(".content-wrapper").hide();
			$("#div-login").show();
		},

		error: (data) => { //any problem from the API
			console.log(data)
			//console.log(data["responseJSON"])
			//console.log(data.responseJSON)
			//$('#signup_message').html('Username may be already in use');
			$('#signup_message').html(data["responseJSON"]);
			$('#signup_message').addClass("alert alert-danger text-center");
		}
	});

}

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
			//cardsController();
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

//quiz results feature
let submitresultsController = () => {

	let the_serialized_data = $("#form-tipi").serialize();
	console.log(the_serialized_data);

	



}

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
		//cardsController();
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

    $('#btnMakeAccount').click(() => {
		signupController();
	});

	$('#btnSubmitResults').click(() => {
		submitresultsController();
	});

    $('#btnSignup').click( () => {
		$(".content-wrapper").hide(); // it hides the divs :D 	
		$('#div-signup').show(); 
	});

    $('#btnCancel').click( ()=> {
		$(".content-wrapper").hide(); // it hides the divs :D 	
		$('#div-login').show();   //show the default page
	});

	/* what happens if the logout link is clicked? */
	$('#link-logout').click( () => {
		// First ... remove userid from localstorage
		localStorage.removeItem("userid");
		// Now force the page to refresh
		window.location = "./index.html";
	});


	

});