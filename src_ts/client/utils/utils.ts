/**
* by kueiapp.com
*/
// ES6

function isNumber(input:string):boolean
{
	return !isNaN(parseInt(input))
}

function isEmail(input:string):boolean {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(input);
}

export default {isNumber, isEmail}