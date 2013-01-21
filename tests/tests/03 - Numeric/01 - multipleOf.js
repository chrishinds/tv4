tests.add("multipleOf", function () {
	var data = 5;
	var schema = {"multipleOf": 2.5};
	var valid = validate(data, schema);
	return valid;
});

tests.add("multipleOf failure", function () {
	var data = 5;
	var schema = {"multipleOf": 0.75};
	var valid = validate(data, schema);
	return !valid;
});