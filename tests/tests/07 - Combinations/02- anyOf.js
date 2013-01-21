tests.add("anyOf success", function () {
	var data = "hello";
	var schema = {
		"anyOf": [
			{"type": "integer"},
			{"type": "string"},
			{"minLength": 1}
		]
	};
	var valid = validate(data, schema);
	return valid;
});

tests.add("anyOf failure", function () {
	var data = true;
	var schema = {
		"anyOf": [
			{"type": "integer"},
			{"type": "string"}
		]
	};
	var valid = validate(data, schema);
	return !valid;
});
