Resources
-----------
```
wild: frontend resource server	
	(handles requests from browsers and returns web pages)
	- GET: response: web pages
	- POST: request: application/json
			response: web pages

cat: backend resource server
	(handles requests from frontend resource server and returns json data)
	- GET: response: application/json
	- POST: request: application/json
			response: application/json
	- PUT: request: application/json
		   response: application/json
	- DELETE: request: application/json
			  response: application/json

elf: backend server
	 (not accessible from outside)
	 (handles more serious business logic: e.g. DB)
```

End Points
-----------
### Overview ###
This is a list of all REST end points for CoffeeChat. 

\* \- documentation needed
\! \- implementation needed

### User End Points ###
GET

[/cat/user/{userID}/](#userBasicProfile)

! [/cat/user/{userID}/positions/](#userPositions)

! [/cat/user/{userID}/profile/](#userProfile)

[/cat/user/{userID}/community/{communityID}/survey/](#userCommunitySurvey) 

\*! [/cat/user/{userID}/community/{communityID}/match/](#userCommunityMatchCurrent)

\*! [/cat/user/{userID}/community/{communityID}/match/{matchID}/](#userCommunityMatchID)

\*! [/cat/user/{userID}/community/{communityID}/match/all/](#userCommunityMatchAll)

\*! [/cat/user/{userID}/community/{communityID}/all/](#userCommunityAll)

POST

! [/cat/user/{userID}/update/](#updateUserBasicProfile)

! [/cat/user/{userID}/positions/update/](#updateUserPositions)

[/cat/user/{userID}/community/{communityID}/feedback/update/](#userCommunitySurvey)

[/cat/user/{userID}/community/{communityID}/survey/update/](#updateUserCommunitySurvey) 

! [/cat/user/{userID}/community/{communityID}/match/accept/](#acceptUserCommunityMatch)

! [/cat/user/{userID}/community/{communityID}/match/reject/](#rejectUserCommunityMatch) 

! [/cat/user/{userID}/community/{communityID}/match/feedback/](#feedbackUserCommunityMatch) 


### Community End Points ###
GET

[/cat/community/{communityID}/survey/](#communitySurvey)

\*! [/cat/community/{communityID}/users/](#communityUsers)

[/cat/community/{communityID}/match/all/](#communityMatchAll)

\*! [/cat/community/{communityID}/match/{matchID}/](#communityMatchID)

POST

\*! [/cat/community/{communityID}/survey/update/](#communityUpdateSurvey)

### User End Points ###

<a name="userBasicProfile"></a>
#### GET /cat/user/{userID}/

Returns a user's basic profile.

Sample Response:

```
{
    userId: "1234",
    firstName: "First Name",
    lastName: "Last Name",
    email: "email@gmail.com",
    headLine: "Job",
    linkedInProfile: "https://linkedin....",
    profilePic: "https://media.licdn.com......"
}
```

<a name="userPositions"></a>
#### GET /cat/user/{userID}/positions/

Returns an array of a user's positions.

Sample Response:
```
[
	{
		id: 1
		current: 1,
		title: "Software Engineer",
		company: "Groupon",
		startDate: "2015-09-01",
		endDate: "2016-09-01"
	},
	{
		id: 1
		current: 0,
		title: "Software Engineer",
		company: "Google",
		startDate: "2015-09-01",
		endDate: "2016-09-01"
	}
]
```

<a name="userProfile"></a>
#### GET /cat/user/{userID}/profile/
Returns a user's profile. This includes their basic profile and their positions.

Sample Response:
```
{
    userId: "1234",
    firstName: "First Name",
    lastName: "Last Name",
    email: "email@gmail.com",
    headLine: "Job",
    linkedInProfile: "https://linkedin....",
    profilePic: "https://media.licdn.com......",
    positions: [
		{
			current: 1,
			title: "Software Engineer",
			company: "Groupon",
			startDate: "2015-09-01",
			endDate: "2016-09-01"
		},
		{
			current: 1,
			title: "Software Engineer",
			company: "Google",
			startDate: "2015-09-01",
			endDate: "2016-09-01"
		}
	]
}
```

<a name="userCommunitySurvey"></a>
#### GET /cat/user/{userID}/community/{communityID}/survey/
Returns a user's survey results for a community. Below is an example of a grouped and ungrouped set of fields.

Sample Response:
```
{
    community: "1",
    fields: [{
        fieldID: 1,
        name: "Industries",
        required: true,
        grouped: false,
        priority: 1,
        displayType: 1,
        values: [{
            id: 631,
            name: "Dairy"
        }, {
            id: 611,
            name: "Farming"
        }, {
            id: 641,
            name: "Fishery"
        }]
    }, {
        fieldID: 11,
        name: "School",
        required: true,
        grouped: false,
        priority: 2,
        displayType: 2,
        values: [{
            id: 3331,
            name: "Northwestern University"
        }, {
            id: 3341,
            name: "University of Chicago"
        }]
    }, {
        fieldID: 2,
        name: "Hobby",
        required: true,
        grouped: true,
        priority: 4,
        displayType: 1,
        values: [{
            name: "Fashion",
            values: [{
                id: 2921,
                name: "Blogging"
            }, {
                id: 2911,
                name: "Design"
            }, {
                id: 2941,
                name: "Interior Design"
            }, {
                id: 2901,
                name: "Knitting"
            }, {
                id: 2931,
                name: "Retail"
            }]
        }, {
            name: "Healthy Living",
            values: [{
                id: 2751,
                name: "Backpacking"
            }, {
                id: 2781,
                name: "Cooking"
            }, {
                id: 2771,
                name: "Vegan"
            }, {
                id: 2761,
                name: "Yoga"
            }]
        }]
    }]
}
```

<a name="userCommunityMatchCurrent"></a>
#### GET /cat/user/{userID}/community/{communityID}/match/
Returns a user's current match.

Sample Response:
```

```

<a name="userCommunityMatchID"></a>
#### GET /cat/user/{userID}/community/{communityID}/match/{matchID}/
Returns a match of a user in a community with a specified matchID.

Sample Response:
```

```

<a name="userCommunityMatchAll"></a>
#### GET /cat/user/{userID}/community/{communityID}/match/all/
Returns a list of all matches for a user in a community.

Sample Response:
```

```

<a name="userCommunityAll"></a>
#### GET /cat/user/{userID}/community/{communityID}/all/
Returns all of a user's information for a community, including positions, matches, survey results, and basic profile.

Sample Response:
```
{

}
```

<a name="updateUserBasicProfile"></a>
#### POST cat/user/{userID}/update/
Updates a user's basic profile.
Sample Body:
```
{
	userId: "1234",
    firstName: "First Name",
    lastName: "Last Name",
    email: "email@gmail.com",
    headLine: "Job",
}
```

<a name="updateUserPositions"></a>
#### POST cat/user/{userID}/positions/update/
Updates a user's positions. If an id is included, that field will be updated, otherwise, it will be added.
Sample Body:
```
{
	positions: [
		{
			id: 1
			current: 0,
			title: "Software Engineer",
			company: "Google",
			startDate: "2015-09-01",
			endDate: "2016-09-01"
		}, {
			current: 0,
			title: "Software Engineer",
			company: "Google",
		}
	]
}
```

<a name="updateUserCommunitySurvey"></a>
#### POST cat/user/{userID}/community/{communityID}/survey/update/
Updates a user's survey results.
Sample Body:
```
{
	data: [
		{
		    "fieldID":1,
		    "chocies": [1161,31,21]
		},
		{
		    "fieldID": 2,
		    "chocies": [2751,2951,2951]
		}
	]
}
```

<a name="acceptUserCommunityMatch"></a>
#### POST cat/user/{userID}/community/{communityID}/match/accept/
Updates a user's current match status to accepted.
Sample Body:
```
{
	userID: 1
	communityID: 1
}
```

<a name="rejectUserCommunityMatch"></a>
#### POST cat/user/{userID}/community/{communityID}/match/reject/
Updates a user's current match status to rejected.
Sample Body:
```
{
	userID: 1
	communityID: 1
}
```

<a name="feedbackUserCommunityMatch"></a>
#### POST cat/user/{userID}/community/{communityID}/match/feedback/
Updates a user's current match status to feedback.
Sample Body:
```
{
	userID: 1
	communityID: 1
}
```

### Community End Points ###

<a name="communitySurvey"></a>
#### GET /cat/community/{communityID}/survey/
Returns the survey for a community.

Sample Response:
```
{
    community: "1",
    fields: [{
        fieldID: 1,
        name: "Industries",
        required: true,
        grouped: false,
        priority: 1,
        displayType: 1,
        values: [{
            id: 631,
            name: "Dairy"
        }, {
            id: 611,
            name: "Farming"
        }, {
            id: 641,
            name: "Fishery"
        }]
    }, {
        fieldID: 11,
        name: "School",
        required: true,
        grouped: false,
        priority: 2,
        displayType: 2,
        values: [{
            id: 3331,
            name: "Northwestern University"
        }, {
            id: 3341,
            name: "University of Chicago"
        }]
    }, {
        fieldID: 2,
        name: "Hobby",
        required: true,
        grouped: true,
        priority: 4,
        displayType: 1,
        values: [{
            name: "Fashion",
            values: [{
                id: 2921,
                name: "Blogging"
            }, {
                id: 2911,
                name: "Design"
            }, {
                id: 2941,
                name: "Interior Design"
            }, {
                id: 2901,
                name: "Knitting"
            }, {
                id: 2931,
                name: "Retail"
            }]
        }, {
            name: "Healthy Living",
            values: [{
                id: 2751,
                name: "Backpacking"
            }, {
                id: 2781,
                name: "Cooking"
            }, {
                id: 2771,
                name: "Vegan"
            }, {
                id: 2761,
                name: "Yoga"
            }]
        }]
    }]
}
```

<a name="communityUsers"></a>
#### GET /cat/community/{communityID}/users/
Returns all users in a community and their basic profiles.

Sample Response:
```
[
	{
	    userId: "1234",
	    firstName: "First Name",
	    lastName: "Last Name",
	    email: "email@gmail.com",
	    headLine: "Job",
	    linkedInProfile: "https://linkedin....",
	    profilePic: "https://media.licdn.com......"
	}, {
	    userId: "1234",
	    firstName: "First Name",
	    lastName: "Last Name",
	    email: "email@gmail.com",
	    headLine: "Job",
	    linkedInProfile: "https://linkedin....",
	    profilePic: "https://media.licdn.com......"
	}
]
```

<a name="communityMatchAll"></a>
#### GET /cat/community/{communityID}/match/all/
Returns all matches in a community.

Sample Response:
```
{
    "community": "1",
    "total": 6,
    "matches":
    [
        {
            "id": 21,
            "userAID": 91,
            "userAstatus": 2,
            "userBID": 481,
            "userBstatus": 1,
            "matchTime": "2016-02-28T06:00:16.000Z"
        },
        {
            "id": 31,
            "userAID": 91,
            "userAstatus": 3,
            "userBID": 491,
            "userBstatus": 2,
            "matchTime": "2016-02-28T06:01:59.000Z"
        },
        {
            "id": 41,
            "userAID": 91,
            "userAstatus": 3,
            "userBID": 131,
            "userBstatus": 3,
            "matchTime": "2016-02-28T06:02:14.000Z"
        },
        {
            "id": 51,
            "userAID": 91,
            "userAstatus": 4,
            "userBID": 151,
            "userBstatus": 4,
            "matchTime": "2016-02-28T06:02:21.000Z"
        },
        {
            "id": 61,
            "userAID": 541,
            "userAstatus": 0,
            "userBID": 91,
            "userBstatus": 5,
            "matchTime": "2016-02-28T06:02:34.000Z"
        },
        {
            "id": 71,
            "userAID": 551,
            "userAstatus": 1,
            "userBID": 91,
            "userBstatus": 3,
            "matchTime": "2016-02-28T06:02:41.000Z"
        }
    ]
}
```

<a name="communityMatchID"></a>
#### GET /cat/community/{communityID}/match/{matchID}/
Returns a match from a community with the specified matchID.

Sample Response:
```

```

<a name="communityUpdateSurvey"></a>
#### POST /cat/community/{communityID}/survey/update/
Updates the survey fields.

Sample Body:
```
{

}
```