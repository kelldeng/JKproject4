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

	// the serializeddata == the querystring
	var theQueryString = $("#form-tipi").serialize();
	console.log(theQueryString);

	// parse the query string into an object

	const data = {};

	if (theQueryString) {
		theQueryString.slice(0).split('&').forEach((item) => {
			// begins at index 0
			// split('&') splits a string into an array of substrings using an separator, such as the & character
			// from statement1=1&statement2=2&statement3=2 into ["statement1=1","statement2=2","statement3=2"]
			// goal: return each individual statement key value pair
		  const parts = item.split('='); // further split key value pair to [statement1,1]
		  //console.log("parts: "+parts) 
		  data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
		  // leave out everything else, only retain the value from the key value pair
		  // decodeURIComponent() helps to decode the encoded strings such as & =, it begins with the first statement and ends at statement 10
		});
	  }
	
	// haha the easy code to get scores.
	// const statement1Score = parseInt(data.statement1);
	// //console.log(`The statement1Score is ${statement1Score}`)
	// const statement2Score = 8 - (parseInt(data.statement2));
	// const statement3Score = parseInt(data.statement3);
	// const statement4Score = 8 - (parseInt(data.statement4));
	// const statement5Score = parseInt(data.statement5);
	// const statement6Score = 8 - (parseInt(data.statement6));
	// const statement7Score = parseInt(data.statement7);
	// const statement8Score = 8 - (parseInt(data.statement8));
	// const statement9Score = parseInt(data.statement9);
	// const statement10Score = 8- (parseInt(data.statement10));


	// extract the scores for each statement, the fancy way 

	const scores = [
		parseInt(data.statement1),
		parseInt(data.statement2),
		parseInt(data.statement3),
		parseInt(data.statement4),
		parseInt(data.statement5),
		parseInt(data.statement6),
		parseInt(data.statement7),
		parseInt(data.statement8),
		parseInt(data.statement9),
		parseInt(data.statement10)
	  ]; console.log("orginal scores: "+scores)
	
	// Reverse code the scores for relevant statements

	const reverseCodedStatements = [2, 4, 6, 8, 10];

	for (let i = 0; i < scores.length; i++) {

	if (reverseCodedStatements.includes(i + 1)) { // Add 1 to i to match the statement number with the index
		// begins at index 0. But if taking index 1, which is 2nd in line, then use reverse order.
		scores[i] = 8 - scores[i]; // starts at point 1, and uses a 7 point scale, so the last digit is 8 
	}
	}
	console.log("updated scores after reversing: "+ scores)

	let extraversionScore = (scores[0]+scores[5])/2;
	console.log("extraversionScore is " + extraversionScore);
	let agreeablenessScore = (scores[1]+scores[6])/2;
	console.log("agreeablenessScore is " + agreeablenessScore);
	let conscientiousnessScore = (scores[2]+scores[7])/2;
	console.log("conscientiousnessScore is " + conscientiousnessScore);
	let emotionalStabilityScore = (scores[3]+scores[8])/2;
	console.log("emotionalStabilityScore is " + emotionalStabilityScore);
	let opennessScore = (scores[4]+scores[9])/2;
	console.log("opennessScore is " + opennessScore);

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