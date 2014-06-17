# tv4-mutant: is a fork of tv4

It adds the ability to reformat fields in the source POJO, based on definitions given in a JSON Schema.

It adds two calls to the tv-4 API, ```addReformatter``` and ```reformat```

Apologies for doing examples in coffeescript, but I'm in a rush...

```coffeescript
Tv4 = require './tv4'

# formats work in the same way as usual
Tv4.addFormat(
    'uk-mobile-phone': (data, schema) ->
        if not data? or /^(447\d{7,11})$/.test(data)
            return null
        else
            return "'#{data}' is not a uk mobile number"

    'lowercase': (data, schema) ->
        if not data? or not /[A-Z]/.test(data)
            return null
        else
            return "'#{data}' must be lowercase"
    )

# a reformatter will raise an error if it doesn't like its input
# it returns a reformatted value if it wants to reformat the data
# or it returns null if it wishes to do nothing
Tv4.addReformatter 'date-time', (data, schema) ->
    if not data?
        return null
    else if data instanceof Date
        if isNaN data.getTime()
            throw new Error("invalid date object")
        else
            return null
    else if typeof data is 'string'
        reformatted = new Date(data)
        if isNaN reformatted.getTime()
            throw new Error("invalid time format")
        return reformatted
    else
        throw new Error("'#{data}' cannot be reformatted to date")

# an example schema
ScheduleEvent =
    type: "object"
    additionalProperties: false
    properties:
        index:
            type: "number" 
        openAt:
            type: "object"
            format: "date-time"
        dueAt:
            type: "object"
            format: "date-time"
        timeoutAt:
            type: "object"
            format: "date-time"
        previousEventTimeoutAt:     #this is required, and should be null for the first event
            type: ["object", "null"]
            format: "date-time"
        status:
            type: "string"
            enum: "EarlyTime, Due".split(', ')
        lastPromptSentAt:
            type: ["object", "null"]
            format: "date-time"
        promptsRemaining:
            type: "integer"
    required: 'index,openAt,dueAt,timeoutAt,previousEventTimeoutAt,status,lastPromptSentAt,promptsRemaining'.split(',')

# an example instance
scheduleEventInstance =
    index: 1
    openAt: '2011-02-01T01:01:01.123Z'
    dueAt: '2011-02-01T01:01:01.123Z'
    timeoutAt: '2011-02-01T01:01:01.123Z'
    previousEventTimeoutAt: null
    status: 'Due'
    lastPromptSentAt: '2011-02-01T01:01:01.123Z'
    promptsRemaining: 1

# run reformat on the instance.
console.log Tv4.reformat(scheduleEventInstance, ScheduleEvent)
```

produces:

```
{ index: 1,
  openAt: Tue Feb 01 2011 01:01:01 GMT+0000 (GMT),
  dueAt: Tue Feb 01 2011 01:01:01 GMT+0000 (GMT),
  timeoutAt: Tue Feb 01 2011 01:01:01 GMT+0000 (GMT),
  previousEventTimeoutAt: null,
  status: 'Due',
  lastPromptSentAt: Tue Feb 01 2011 01:01:01 GMT+0000 (GMT),
  promptsRemaining: 1 }
```

