"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://jchvf589sh.execute-api.us-east-1.amazonaws.com/default/project4_foxmajor";

/* SUPPORTING FUNCTIONS */

let newscores = []; //empty array
let personality= ""; //empty personality 

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
	
	let the_serialized_data = $("#form-signup").serialize();
	console.log("the_serialized_data: "+ the_serialized_data);

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
			localStorage.studentid = results[0]['studentid']; 
			$("#createdby").val(localStorage.studentid);
			$("#createdby2").val(localStorage.studentid);
			$("#createdby3").val(localStorage.studentid);
			//manage the appearence of things...
			$('#login_message').html('');
			$('#login_message').removeClass();
			$('.secured').removeClass('locked');
			$('.secured').addClass('unlocked');
			$('#div-login').hide(); //hide the login page
			$("#container-3col").hide(); //hide the 3 column container
			$("#container-2col").show(); //show the 2 column container
			$('#div-tipi').show();   //show the default page
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
	$("html, body").animate({ scrollTop: "0px" });
};

//quiz results feature
let submitresultsController = () => {

	$('#tipi_message').html("");
	$('#tipi_message').removeClass();

	// the serializeddata == the querystring
	var theQueryString = $("#form-tipi").serialize();
	var createdby = $("#createdby").val();
	console.log(theQueryString);

	const data = {};

	if (theQueryString) {
		theQueryString.slice(0).split('&').forEach((item) => {
		  const parts = item.split('='); // further split key value pair to [statement1,1]
		  data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
		});
	  }

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
	  ]; console.log("orginal scores: " + scores)
	
	// Check if any of the scores are NaN
	if (scores.some(isNaN)) {
		// Show error message or take appropriate action for NaN scores
		console.log("Error: Some scores are not valid numbers");
		$('#tipi_message').html('Error: Some scores are not valid numbers.');
		$('#tipi_message').addClass("alert alert-danger text-center");
		return; // Exit the function
	}
	else{	
	// Reverse code the scores for relevant statements

	const reverseCodedStatements = [2, 4, 6, 8, 10];

	for (let i = 0; i < scores.length; i++) {
		if (reverseCodedStatements.includes(i + 1)) { 
			scores[i] = 8 - scores[i];
		}
	}
	console.log("updated scores after reversing: "+ scores)


	var extraversion = (scores[0]+scores[5])/2;
	newscores.push(extraversion); 

	var agreeableness = (scores[1]+scores[6])/2;
	newscores.push(agreeableness); 

	var conscientiousness = (scores[2]+scores[7])/2;
	newscores.push(conscientiousness); 

	var emotionalstability = (scores[3]+scores[8])/2;
	newscores.push(emotionalstability); 

	var openness = (scores[4]+scores[9])/2;
	newscores.push(openness); 

	console.log("newscores: "+newscores)
	
	$('#tipi_message').html("Success!");
	$('#tipi_message').addClass("alert alert-success text-center");
	}

	const EorI = extraversion >= agreeableness ? "E" : "I";
  	const SorN = openness >= conscientiousness ? "N" : "S";
 	const TorF = agreeableness >= emotionalstability ? "F" : "T";
  	const JorP = conscientiousness >= emotionalstability ? "J" : "P";
	console.log(EorI + SorN + TorF + JorP)
	personality = EorI + SorN + TorF + JorP;

	var serializedData = $.param({
		createdby: createdby,
        extraversion: newscores[0],
        agreeableness: newscores[1],
        conscientiousness: newscores[2],
        emotionalstability: newscores[3],
        openness: newscores[4],
		personality: personality
    });

	console.log("serializedData: " + serializedData)

    $.ajax({
        url: endpoint01 + "/assessment",
        data: serializedData,
        method: "POST",
        success: (results) => {
            console.log(results);
			$('#div-tipi').hide();
			$('#div-results').show();
			getresultsController();
        },
        error: (data) => {
            console.log(data);
        }
    });
}

let getresultsController = () => {

	//display personality, scale -> graph 
	var traits = ["Extraversion","Agreeableness","Conscientiousness","Emotional Stability","Openness"];
	var ctx = document.getElementById('myChart1').getContext('2d');

	Chart.defaults.font.size = 16;
	var myChart1 = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: traits,
			datasets: [{
				//axis: 'x',
				label: 'TIPI Scores',
				data: newscores,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)'
					],
				borderWidth: 1
			}]
		},
		options: {
			indexAxis: 'y', // display content horizontally
			scales: {
				x:{
					min: 0,
				  	max: 7
				},
				y: {
				  	beginAtZero: true,
				}
			
			}
		}
	});

	var personalityData = $.param({
		personality: personality
    });

	console.log(personalityData)

	$.ajax({
		url: endpoint01 + "/results",
		method: "GET",
		data: personalityData,
		success: (results)=>{
			console.log(results);
			let majorarray = []
			majorarray.push(results[0].major1)
			majorarray.push(results[0].major2)
			majorarray.push(results[0].major3)
			console.log(majorarray)
			let link = 'https://bulletin.temple.edu/undergraduate/fox-business-management/'

			for(let i=0;i<majorarray.length;i++){
				let majorName = majorarray[i];
				let majorLink;
			
				if (majorarray[i] == "Entrepreneurship &​ Innovation Management") {
					majorLink = $('<a></a>').attr('href', link + "entrepreneurship").text(majorName);
				}
				else if (majorarray[i] == "International Business") {
					majorLink = $('<a></a>').attr('href', link + "international-business-administration").text(majorName);
				}
				else if (majorarray[i] == "Real Estate") {
					majorLink = $('<a></a>').attr('href', link + "realestate").text(majorName);
				}
				else if (majorarray[i] == "Risk Management & Insurance") {
					majorLink = $('<a></a>').attr('href', link + "risk-management-insurance").text(majorName);
				}
				else if (majorarray[i] == "Statistical Science & Data Analytics") {
					majorLink = $('<a></a>').attr('href', link + "statistical-science-data-analytics").text(majorName);
				}
				else{
					majorLink = $('<a></a>').attr('href', link + majorName.toLowerCase().replace(/\s+/g, "-")).text(majorName);
				}
			
				// append list item to ordered list
				$('#majors_list ol').append($('<li></li>').append(majorLink));
			}
		},
		error: (data)=>{
			console.log("Unexpected error");
			console.log(data);
		},
	})
}


$(document).ready( () => {

    if (localStorage.studentid){
		//there is a session
		$("#container-3col").hide();
		$("#container-2col").show();
		$(".secured").removeClass("locked");		
		//show the default div
		$("#div-tipi").show();	
		//assign a value to the createdby tags
		$("#createdby").val(localStorage.studentid);
		$("#createdby2").val(localStorage.studentid);
		$("#createdby3").val(localStorage.studentid);
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

		$('#btnGetResults').click( ()=>{
			getresultsController();
		})

		/* what happens if the logout link is clicked? */
		$('#link-logout').click( () => {
			// First ... remove userid from localstorage
			localStorage.removeItem("studentid");
			// Now force the page to refresh
			window.location = "./index.html";
			

		});

	

});